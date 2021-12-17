import React, { useCallback, useMemo, useState } from 'react'
import { Table } from 'antd'
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc'
import { MenuOutlined } from '@ant-design/icons'
import { arrayMoveImmutable } from 'array-move'
import { VList } from '../../src/index'

const vlistComponents = VList({ height: 500, resetTopWhenDataChange: false })
const VRow = vlistComponents.body.row
const VWrapper = vlistComponents.body.wrapper
const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
))

const SortableItem = sortableElement((props) => <VRow {...props} />)
const SortableContainer = sortableContainer((props) => <VWrapper {...props} />)

const columns = [
    {
        title: 'Sort',
        dataIndex: 'sort',
        width: 100,
        className: 'drag-visible',
        render: () => <DragHandle />,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        className: 'drag-visible',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
]

const generateData = () => {
    const temp = []

    for (let i = 0; i < 100; i += 1) {
        temp.push({
            key: `${i + 1}`,
            name: `John Brown${i}`,
            age: 32,
            address: 'New York No. 1 Lake Park',
            index: i,
        })
    }

    return temp
}

const data = generateData()

class SortableTable extends React.Component {
    state = {
        dataSource: data,
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { dataSource } = this.state
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(
                [].concat(dataSource),
                oldIndex,
                newIndex
            ).filter((el) => !!el)
            console.log('Sorted items: ', newData)
            this.setState({ dataSource: newData })
        }
    }

    DraggableContainer = (props) => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    )

    DraggableBodyRow = ({ className, style, ...restProps }) => {
        const { dataSource } = this.state
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex(
            (x) => x.index === restProps['data-row-key']
        )
        return <SortableItem index={index} {...restProps} />
    }

    render() {
        const { dataSource } = this.state

        return (
            <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                rowKey="index"
                components={{
                    ...vlistComponents,
                    body: {
                        ...vlistComponents?.body,
                        wrapper: this.DraggableContainer,
                        row: this.DraggableBodyRow,
                    },
                }}
            />
        )
    }
}

export default SortableTable
