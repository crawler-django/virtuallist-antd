import React, { useCallback, useMemo, useState } from 'react'
import { Button, Table } from 'antd'
import { VList } from '../../src/index'

import 'antd/dist/antd.css'

const generateData = () => {
    const temp = []

    for (let i = 0; i < 2; i += 1) {
        temp.push({
            a: i,
            b: 'bbbb'.repeat(Math.floor(Math.random() * 10)),
            children: [
                {
                    a: `${i}_${i}`,
                    b: 'test',
                    children: [
                        {
                            a: `${i}_${i}_${i}`,
                            b: 'testtest',
                        },
                        {
                            a: `${i}_${i}_${i}_${i}`,
                            b: 'testtest',
                        },

                        {
                            a: `nm${i}`,
                            b: 'testtest',
                        },
                        {
                            a: `ds${i}`,
                            b: 'testtest',
                        },
                        {
                            a: `${i}sss`,
                            b: 'testtest',
                        },
                        {
                            a: `llll${i}`,
                            b: 'testtest',
                        },
                    ],
                },
            ],
        })
    }

    return temp
}

const initData = generateData()

function TreeTable() {
    const [data, setData] = useState(initData)

    // eslint-disable-next-line no-unused-vars
    const [flag, setFlag] = useState(false)

    const handleClick = (record, e) => {
        e.preventDefault()
    }

    const handleChangeClick = useCallback(() => {
        setFlag((pre) => {
            if (!pre) {
                setData([])
            } else {
                setData(generateData())
            }

            // setData((d) => [...d]);

            return !pre
        })
    }, [])

    const columns = [
        {
            title: 'title1',
            dataIndex: 'a',
            key: 'a',
            width: 150,
        },
        {
            title: 'title2',
            dataIndex: 'b',
            key: 'b',
            width: 200,
        },
        {
            title: 'title3',
            dataIndex: 'c',
            key: 'c',
            width: 200,
        },
        {
            title: 'Operations',
            dataIndex: '',
            width: 200,
            key: 'x',
            render: (text, record) => (
                <a href="#" onClick={(e) => handleClick(record, e)}>
                    click {record.a}
                </a>
            ),
        },
    ]

    const vComponent = useMemo(
        () => VList({ height: 500, resetTopWhenDataChange: false }),
        []
    )

    return (
        <div>
            <h2>sub table</h2>
            <Button onClick={handleChangeClick}>变换数量</Button>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.a}
                pagination={false}
                scroll={{ y: 500, x: '100%' }}
                components={vComponent}
            />
        </div>
    )
}

export default TreeTable
