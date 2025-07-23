import React, { useState, useEffect, useMemo } from 'react';
import { Table } from 'antd';
import { VList } from '../../src/index';
import 'antd/dist/antd.css';

type DataSourceType = { [key: string]: string }
function AutoHeightTable() {
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

  useEffect(() => {
    const tempDataSource: DataSourceType[] = [];
    for (let i = 0; i < 1000; i += 1) {
      tempDataSource.push({
        company_name: `aaa${i} 富士山下的你好美 你知道吗 aaa${i} 富士山下的你好美 你知道吗 aaa${i} 富士山下的你好美 你知道吗`,
        company_name1: `aaa${i} index index index index`,
        company_name2: `aaa${i} company index index index`,

        company_name3: `aaa${i} company company index index`,
        company_name4: `aaa${i} company company company index`,
        company_name5: `aaa${i} company company company company`,
        company_name6: `aaa${i} company index index company`,
      });
    }

    setDataSource(tempDataSource);
  }, []);

  const columns: any[] = [
    {
      title: '序号',
      key: 'id',
      fixed: 'left',
      render(text, record, index) {
        return index + 1;
      },
      width: 100,
    },
    {
      title: '公司',
      dataIndex: 'company_name',
      width: 200,
    },
    {
      title: '公司1',
      dataIndex: 'company_name1',
      width: 200,
    },
    {
      title: '公司2',
      dataIndex: 'company_name2',
      width: 200,
    },
  ];

  const vc1 = useMemo(() => VList({  }), []);


  return <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: 'calc(100vh - 55px)', x: '100%' }}
            rowKey="company_name"
            components={vc1}
        />
  ;
}

export default AutoHeightTable;
