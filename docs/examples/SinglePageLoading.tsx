import React, { useState, useCallback } from "react";
import { Table } from "antd";
import { VList } from "../../src/index";
import 'antd/dist/antd.css';

const generateData = () => {
  let tempDataSource = [];
  for (let i = 0; i < 50; i++) {
    tempDataSource.push({
      company_name: `aaa${i} 富士山下的你好美 你知道吗`,
      company_name1: `aaa${i} index index index index`,
      company_name2: `aaa${i} company index index index`,

      company_name3: `aaa${i} company company index index`,
      company_name4: `aaa${i} company company company index`,
      company_name5: `aaa${i} company company company company`,
      company_name6: `aaa${i} company index index company`
    });
  }

  return tempDataSource;
};

function SinglePageLoading() {
  const [dataSource, setDataSource] = useState(generateData());

  const [loading, setLoading] = useState(false);

  const columns: any = [
    {
      title: "序号",
      key: "id",
      fixed: "left",
      render(text, record, index) {
        return index + 1;
      },
      width: 100
    },
    {
      title: "公司",
      dataIndex: "company_name",
      width: 200
    },
    {
      title: "公司1",
      dataIndex: "company_name1",
      width: 200
    },
    {
      title: "公司2",
      dataIndex: "company_name2",
      width: 200
    }
  ];

  const handleReachEnd = useCallback(() => {
    setLoading(true);
    setDataSource((pre) => {
      const temp = generateData();
      return [...pre, ...temp];
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        scroll={{ y: 500, x: '100%' }}
        rowKey={"company_name"}
        components={VList({
          height: 500,
          onReachEnd: handleReachEnd,
        })}
      />
    </>
  );
}

export default SinglePageLoading
