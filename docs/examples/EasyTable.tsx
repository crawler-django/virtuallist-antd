import React, { useState, useMemo } from 'react'
import { Table } from 'antd'
import { VList } from '../../src/index'
import 'antd/dist/antd.css'

const generateData = () => {
    const tempDataSource = []
    for (let i = 0; i < 11; i += 1) {
        tempDataSource.push({
            company_name: `aaa${i} 富士山下的你好美 你知道吗`,
            company_name1: `aaa${i} index index index index`,
            company_name2: `aaa${i} company index index index`,

            company_name3: `aaa${i} company company index index`,
            company_name4: `aaa${i} company company company index`,
            company_name5: `aaa${i} company company company company`,
            company_name6: `aaa${i} company index index company`,
        })
    }

    return tempDataSource
}

function SinglePageLoading() {
    const [dataSource] = useState(generateData())

    const columns: any = [
        {
            title: '序号',
            key: 'id',
            fixed: 'left',
            render(text, record, index) {
                return index + 1
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
    ]

    const components1 = useMemo(
        () =>
            VList({
                height: 550,
                vid: 'first',
            }),
        []
    )

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{ y: 550, x: '100%' }}
                rowKey="company_name"
                components={components1}
            />
        </>
    )
}

export default SinglePageLoading
