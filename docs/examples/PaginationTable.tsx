import React, { useState, useEffect, useMemo } from 'react'
import { Table } from 'antd'
import { VList } from 'virtuallist-antd'

function PaginationTable() {
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        const tempDataSource = []
        for (let i = 0; i < 201; i += 1) {
            tempDataSource.push({
                company_name: `aaa${i}`,
            })
        }

        setTimeout(() => {
            setDataSource(tempDataSource)
        }, 2000)
    }, [])

    const columns = [
        {
            title: '序号',
            key: 'id',
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
    ]

    const pagination = {
        defaultPageSize: 50,
        defaultCurrent: 1,
        showQuickJumper: true,
        showTotal(total): any {
            return `总共${total}条数据`
        },
        showSizeChanger: true,
        pageSizeOptions: ['10', '50', '100'],
    }

    const vc = useMemo(
        () =>
            VList({
                height: 600,
            }),
        []
    )

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ y: 600 }}
            pagination={pagination}
            rowKey="company_name"
            components={vc}
        />
    )
}

export default PaginationTable
