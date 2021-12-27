import React, { useState, useCallback, useMemo } from 'react'
import { Button, Table } from 'antd'
import { VList, scrollTo } from '../../src/index'
import 'antd/dist/antd.css'

const generateData = () => {
    const tempDataSource = []
    for (let i = 0; i < 50; i += 1) {
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
    const [dataSource1, setDataSource1] = useState(generateData())
    const [dataSource2, setDataSource2] = useState(generateData())

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

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

    const handleReachEnd1 = useCallback(() => {
        setLoading1(true)
        setDataSource1((pre) => {
            const temp = generateData()
            return [...pre, ...temp]
        })
        setTimeout(() => {
            setLoading1(false)
        }, 1000)
    }, [])

    const handleReachEnd2 = useCallback(() => {
        setLoading2(true)
        setDataSource2((pre) => {
            const temp = generateData()
            return [...pre, ...temp]
        })
        setTimeout(() => {
            setLoading2(false)
        }, 1000)
    }, [])

    const components1 = useMemo(
        () =>
            VList({
                height: 500,
                onReachEnd: handleReachEnd1,
                vid: 'first',
            }),
        [handleReachEnd1]
    )
    const components2 = useMemo(
        () =>
            VList({
                height: 500,
                onReachEnd: handleReachEnd2,
                vid: 'second',
            }),
        [handleReachEnd2]
    )

    return (
        <>
            <Button onClick={() => scrollTo({ vid: 'first', y: 1000 })}>
                跳到1000
            </Button>
            <Button onClick={() => scrollTo({ vid: 'first', row: 30 })}>
                跳到row 30
            </Button>
            <Table
                columns={columns}
                dataSource={dataSource1}
                pagination={false}
                loading={loading1}
                scroll={{ y: 500, x: '100%' }}
                rowKey="company_name"
                components={components1}
            />
            <Button onClick={() => scrollTo({ vid: 'second', y: 500 })}>
                跳到500
            </Button>
            <Table
                columns={columns}
                dataSource={dataSource2}
                pagination={false}
                loading={loading2}
                scroll={{ y: 500, x: '100%' }}
                rowKey="company_name"
                components={components2}
            />
        </>
    )
}

export default SinglePageLoading
