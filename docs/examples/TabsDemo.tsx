import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tabs } from 'antd';
import { VList } from '../../src/index';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

function TabsDemo() {
  const [dataSource, setDataSource] = useState([]);
  const [activeKey, setActiveKey] = useState('tab1');

  useEffect(() => {
    const tempDataSource = [];
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

  const vc1 = useMemo(() => VList({
    height: 500,
    vid: 'first',
  }), []);

  const vc2 = useMemo(() => VList({
    height: 'calc(20vh)',
    vid: 'second',
  }), []);

  const vc3 = useMemo(() => VList({
    height: 'calc(60vh)',
    vid: 'thrid',
  }), []);

  return (
    <>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <TabPane key="tab1" tab="Tab 1">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            /** 不建议使用x: max-content. 如果columns有fixed, x为max-content的话. ellipsis会失效 */
            scroll={{ y: 500, x: '100%' }}
            rowKey="company_name"
            components={vc1}
          />
        </TabPane>

        <TabPane key="tab2" tab="Tab 2">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: 'calc(40vh)' }}
            rowKey="company_name"
            components={vc2}
          />
        </TabPane>

        <TabPane key="tab3" tab="Tab 3">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: 'calc(60vh)' }}
            rowKey="company_name"
            components={vc3}
          />
        </TabPane>
      </Tabs>
    </>
  );
}

export default TabsDemo;
