import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { VList } from '../../src/index';
import 'antd/dist/antd.css';

const type = 'DragableBodyRow';

const vlistComponent = VList({
  height: 500,
});

const generateData = () => {
  const arr = [];

  for (let i = 0; i < 100; i += 1) {
    arr.push({
      key: i,
      date: '天道轮回'.repeat(Math.floor(Math.random() * 10)),
      amount: 120,
      type: 'income',
      note: 'transfer',
    });
  }

  return arr;
};

const DragableBodyRow = (props: any) => {
  const {
    index, moveRow, className, style, ...restProps
  } = props;
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: any) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    drop(drag(ref));
  }, [drag, drop]);

  const components = useMemo(() => vlistComponent.body.row, []);

  const tempProps = useMemo(() => ({
    ref,
    className: `${className}${isOver ? dropClassName : ''}`,
    style: { cursor: 'move', ...style },
    ...restProps,
  }), [className, dropClassName, restProps, style, isOver]);

  return (
    <>
      {' '}
      {components(tempProps, ref)}
      {' '}
    </>
  );
};

const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={(
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
  )}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        {...restProps}
        style={{ ...restProps?.style, borderRight: '1px solid #eee' }}
      />
    </Resizable>
  );
};

function DragRow() {
  const [columns, setColumns] = useState<any>(() => [
    {
      title: '序号',
      key: 'id',
      width: 75,
      fixed: 'left',
      render(text, record, index) {
        return index + 1;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 300,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 100,
    },
    {
      title: 'Note',
      width: 200,
      render: () => 'aaa',
    },
    {
      title: 'Note',
      width: 200,
      render: () => 'aaa',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      render: () => <a>Delete</a>,
    },
  ].map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      onResize: handleResize(index),
    }),
  })));

  const handleResize = useCallback((index) => (e, { size }) => {
    setColumns((pre) => {
      const temp = [...pre];
      temp[index] = {
        ...temp[index],
        width: size.width,
      };

      return temp;
    });
  }, []);

  const components = useMemo(() => ({
    ...vlistComponent,
    body: {
      ...vlistComponent.body,
      row: DragableBodyRow,
    },
    header: {
      cell: ResizableTitle,
    },
  }), []);

  const [data, setData] = useState(generateData());

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [data],
  );

  return (
    <div style={{ width: 800 }}>
      <DndProvider backend={HTML5Backend}>
        <Table
          bordered
          components={components}
          columns={columns}
          dataSource={data}
          scroll={{ x: '100%', y: 500 }}
          pagination={false}
          onRow={(record, index) => ({
            index,
            moveRow,
          } as any)}
          sticky
        />
      </DndProvider>
    </div>
  );
}

export default DragRow;
