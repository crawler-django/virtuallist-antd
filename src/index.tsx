import React, {
    useRef,
    useEffect,
    useContext,
    createContext,
    useReducer,
    useState,
    useMemo
} from 'react'
import { throttle, isNumber } from 'lodash-es'

import './style.css'

// ===============reducer ============== //
const initialState = {
    // 行高度
    rowHeight: 0,
    // 当前的scrollTop
    curScrollTop: 0,
    // 可滚动区域的高度
    scrollHeight: 0,
    // scrollY值
    tableScrollY: 0,
}

function reducer(state, action) {
    switch (action.type) {
        // 改变trs 即 改变渲染的列表trs
        case 'changeTrs':
            // 获取值
            let curScrollTop = action.curScrollTop
            let scrollHeight = action.scrollHeight
            let tableScrollY = action.tableScrollY

            if (state.scrollHeight && curScrollTop > state.scrollHeight) {
                curScrollTop = state.scrollHeight
            }

            return {
                ...state,
                curScrollTop,
                scrollHeight,
                tableScrollY,
            }
        // 初始化每行的高度, 表格总高度, 渲染的条数
        case 'initHeight':
            // 获取值
            let rowHeight = action.rowHeight
            return {
                ...state,
                rowHeight,
            }

        case 'reset':
            return {
                ...state,
                curScrollTop: action?.ifScrollTopClear ? 0 : state.curScrollTop,
                scrollHeight: 0,
            }
        default:
            throw new Error()
    }
}

// ==============全局变量 ================== //
const DEFAULT_VID = 'vtable'
const vidMap = new Map()

// ===============context ============== //
const ScrollContext = createContext({
    dispatch: undefined,
    renderLen: 1,
    start: 0,
    offsetStart: 0,
    // =============
    rowHeight: initialState.rowHeight,
    totalLen: 0,
    vid: DEFAULT_VID
})

// =============组件 =================== //

function VCell(props): JSX.Element {
    const { children, ...restProps } = props

    return (
        <td {...restProps}>
            <div>{children}</div>
        </td>
    )
}

function VRow(props, ref): JSX.Element {
    const { dispatch, rowHeight, totalLen, vid } = useContext(ScrollContext)

    const { children, style, ...restProps } = props

    const trRef = useRef<HTMLTableRowElement>(null)

    useEffect(() => {
        const initHeight = (trRef) => {
            if (trRef?.current?.offsetHeight && !rowHeight && totalLen) {
                let tempRowHeight = trRef?.current?.offsetHeight ?? 0
                vidMap.set(vid, {
                    ...vidMap.get(vid),
                    rowItemHeight: tempRowHeight,
                })
                dispatch({
                    type: 'initHeight',
                    rowHeight: tempRowHeight,
                })
            }
        }

        initHeight(ref.hasOwnProperty('current') ? ref : trRef)
    }, [trRef, dispatch, rowHeight, totalLen])

    return (
        <tr
            {...restProps}
            ref={ref.hasOwnProperty('current') ? ref : trRef}
            style={{
                ...style,
                height: rowHeight ? rowHeight : 'auto',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </tr>
    )
}

function VWrapper(props): JSX.Element {
    const { children, ...restProps } = props

    const { renderLen, start, offsetStart } = useContext(ScrollContext)

    let contents = children[1]

    let tempNode = null
    if (Array.isArray(contents) && contents.length) {
        tempNode = [
            children[0],
            contents.slice(start, start + renderLen).map((item) => {
                if (Array.isArray(item)) {
                    // 兼容antd v4.3.5 --- rc-table 7.8.1及以下
                    return item[0]
                } else {
                    // 处理antd ^v4.4.0  --- rc-table ^7.8.2
                    return item
                }
            }),
        ]
    } else {
        tempNode = children
    }

    return (
        <tbody
            {...restProps}
        >
            {tempNode}
        </tbody>
    )
}

function VTable(props, tempObj): JSX.Element {
    const { style, children, ...rest } = props
    const { width, ...rest_style } = style

    const { vid, scrollY, reachEnd, onScroll } = tempObj ?? {}

    // const [curScrollTop, setCurScrollTop] = useState(0)

    const [state, dispatch] = useReducer(reducer, initialState)

    const wrap_tableRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)

    // 数据的总条数
    const [totalLen, setTotalLen] = useState<number>(
        children[1]?.props?.data?.length ?? 0
    )

    useEffect(() => {
        return () => {
            // console.log('销毁', vid)
            vidMap.delete(vid)
        }
    }, [])

    useEffect(() => {
        if (isNumber(children[1]?.props?.data?.length)) {
            setTotalLen(children[1]?.props?.data?.length)
        }
    }, [children])

    // table总高度
    const tableHeight = useMemo<string | number>(() => {
        let temp: string | number = 'auto'
        if (state.rowHeight && totalLen) {
            temp = state.rowHeight * totalLen
        }
        return temp
    }, [state.rowHeight, totalLen])

    // table的scrollY值
    let tableScrollY = 0
    if (typeof scrollY === 'string') {
        tableScrollY = (wrap_tableRef.current?.parentNode as HTMLElement)
            ?.offsetHeight
    } else {
        tableScrollY = scrollY
    }

    if (isNumber(tableHeight) && tableHeight < tableScrollY) {
        tableScrollY = tableHeight
    }

    // 处理tableScrollY <= 0的情况
    if (tableScrollY <= 0) {
        tableScrollY = 0
    }

    // 渲染的条数
    const renderLen = useMemo<number>(() => {
        let temp = 1
        if (state.rowHeight && totalLen && tableScrollY) {
            if (tableScrollY <= 0) {
                temp = 0
            } else {
                let tempRenderLen =
                    ((tableScrollY / state.rowHeight) | 0) + 1 + 2
                // console.log('tempRenderLen', tempRenderLen)
                temp = tempRenderLen > totalLen ? totalLen : tempRenderLen
            }
        }
        return temp
    }, [state.rowHeight, totalLen, tableScrollY])

    // 渲染中的第一条
    let start = state.rowHeight ? (state.curScrollTop / state.rowHeight) | 0 : 0
    // 偏移量
    let offsetStart = state.rowHeight ? state.curScrollTop % state.rowHeight : 0

    // 用来优化向上滚动出现的空白
    if (
        state.curScrollTop &&
        state.rowHeight &&
        state.curScrollTop > state.rowHeight
    ) {
        if (start > totalLen - renderLen) {
            // 可能以后会做点操作
            // offsetStart = 0
        } else if (start > 1) {
            start = start - 1
            offsetStart += state.rowHeight
        }
    } else {
        start = 0
    }

    useEffect(() => {
        const scrollNode = wrap_tableRef.current?.parentNode as HTMLElement
        vidMap.set(vid, {
            ...vidMap.get(vid),
            scrollNode,
        })
        
        if (!reachEnd) {
            if (scrollNode) {
                scrollNode.scrollTop = 0
            }

            dispatch({ type: 'reset', ifScrollTopClear: true })
        } else {
            // 不清空curScrollTop
            dispatch({ type: 'reset', ifScrollTopClear: false })
        }
    }, [totalLen])

    useEffect(() => {
        const throttleScroll = throttle((e) => {
            let scrollTop: number = e?.target?.scrollTop ?? 0
            let scrollHeight: number = e?.target?.scrollHeight ?? 0
            let clientHeight: number = e?.target?.clientHeight ?? 0

            // 到底了 没有滚动条就不会触发reachEnd. 建议设置scrolly高度少点或者数据量多点.
            if (scrollTop === scrollHeight) {
                // reachEnd && reachEnd()
            } else if (scrollTop + clientHeight >= scrollHeight) {
                // 有滚动条的情况
                reachEnd && reachEnd()
            }

            onScroll && onScroll()
            
            dispatch({
                type: 'changeTrs',
                curScrollTop: scrollTop,
                scrollHeight,
                tableScrollY,
            })
            
        }, 60)

        let ref = wrap_tableRef?.current?.parentNode as HTMLElement

        if (ref) {
            ref.addEventListener('scroll', throttleScroll)
        }

        return () => {
            ref.removeEventListener('scroll', throttleScroll)
        }
    }, [wrap_tableRef, tableScrollY])

    return (
        <div
            className="virtuallist"
            ref={wrap_tableRef}
            style={{
                width: '100%',
                position: 'relative',
                height: tableHeight,
                boxSizing: 'border-box',
                paddingTop: state.curScrollTop,
            }}
        >
            <ScrollContext.Provider
                value={{
                    dispatch,
                    rowHeight: state.rowHeight,
                    start,
                    offsetStart,
                    renderLen,
                    totalLen,
                    vid,
                }}
            >
                <table
                    {...rest}
                    ref={tableRef}
                    style={{
                        ...rest_style,
                        width,
                        position: 'relative',
                        transform: `translateY(-${offsetStart}px)`
                    }}
                >
                    {children}
                </table>
            </ScrollContext.Provider>
        </div>
    )
}

/**
 * put tempObj in vtable.
 * @param tempObj 
 * @returns 
 */
const transformTable = (tempObj) => {
    return (props) => VTable(props, tempObj)
}

// ================导出===================
export function VList(props: {
    height: number | string
    onReachEnd?: () => void
    onScroll?: () => void
    vid?: string
}): any {
    
    const _vid = props.vid ?? DEFAULT_VID

    let TableComponent

    if (!vidMap.has(_vid)) {
        TableComponent = transformTable({
            vid: _vid,
            scrollY: props.height,
            reachEnd: props.onReachEnd,
            onScroll: props.onScroll,
        })
        vidMap.set(_vid, {
            components: TableComponent,
        })
    } else {
        TableComponent = vidMap.get(_vid)?.components
    }

    return {
        table: TableComponent,
        body: {
            wrapper: VWrapper,
            row: VRow,
            cell: VCell,
        },
    }
}

export function scrollTo(option: {
    /**
     * 行数
     */
    row?: number
    /**
     * y的偏移量
     */
    y?: number
    /**
     * 同一页面拥有多个虚拟表格的时候的唯一标识.
     */
    vid?: string
}) {
    const { row, y, vid = DEFAULT_VID } = option

    const { scrollNode, rowItemHeight } = vidMap.get(vid)

    if (row) {
        if (row - 1 > 0) {
            scrollNode.scrollTop = (row - 1) * (rowItemHeight ?? 0)
        } else {
            scrollNode.scrollTop = 0
        }
    } else {
        scrollNode.scrollTop = y ?? 0
    }
}
