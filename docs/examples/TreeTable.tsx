import React from "react";
import ReactDom from "react-dom";
import { Table } from "antd";
import { VList } from "../../src/index";

import "antd/dist/antd.css";

const generateData = () => {
  const temp = [];

  for (let i = 0; i < 100; i += 1) {
    temp.push({
      a: i,
      b: "bbbb".repeat(Math.floor(Math.random() * 10)),
      children: [
        {
          a: `${i}_${i}`,
          b: "test",
          children: [
            {
              a: `${i}_${i}_${i}`,
              b: "testtest"
            },
            {
              a: `${i}_${i}_${i}_${i}`,
              b: "testtest"
            },
            {
              a: `${i}_${i}_${i}_${i}_${i}`,
              b: "testtest"
            }
          ]
        }
      ]
    });
  }

  return temp;
};

const data = generateData();

class TreeTable extends React.Component {
  handleClick = (record, e) => {
    e.preventDefault();
    console.log(record.a);
  };

  render() {
    const columns = [
      { title: "title1", dataIndex: "a", key: "a", width: 150 },
      { title: "title2", dataIndex: "b", key: "b", width: 200 },
      { title: "title3", dataIndex: "c", key: "c", width: 200 },
      {
        title: "Operations",
        dataIndex: "",
        width: 200,
        key: "x",
        render: (text, record) => (
          <a href="#" onClick={(e) => this.handleClick(record, e)}>
            click {record.a}
          </a>
        )
      }
    ];
    return (
      <div>
        <h2>sub table</h2>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.a}
          pagination={false}
          scroll={{ y: 500, x: "100%" }}
          components={VList({ height: 500 })}
        />
      </div>
    );
  }
}

export default TreeTable
