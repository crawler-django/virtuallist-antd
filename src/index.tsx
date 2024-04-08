/* eslint-disable arrow-body-style */
import React, {
    useRef,
    useEffect,
    useContext,
    createContext,
    useReducer,
    useState,
    useMemo,
} from 'react'
import { throttle, debounce } from 'lodash-es'

import './style.css'

// ==============全局常量 ================== //
const DEFAULT_VID = 'vtable'
const vidMap = new Map()
let debounceListRender: any

// ===============reducer ============== //
const initialState = {
    // 行高度
    rowHeight: 0,
    // 当前的scrollTop
    curScrollTop: 0,
    // 总行数
    totalLen: 0,
}

function reducer(state, action) {
    const { curScrollTop, rowHeight, totalLen, ifScrollTopClear } = action

    let stateScrollTop = state.curScrollTop
    switch (action.type) {
        // 改变trs 即 改变渲染的列表trs
        case 'changeTrs':
            return {
                ...state,
                curScrollTop,
            }
        // 初始化每行的高度, 表格总高度, 渲染的条数
        case 'initHeight':
            return {
                ...state,
                rowHeight,
            }
        // 更改totalLen
        case 'changeTotalLen':
            if (totalLen === 0) {
                stateScrollTop = 0
            }

            return {
                ...state,
                totalLen,
                curScrollTop: stateScrollTop,
            }

        case 'reset':
            return {
                ...state,
                curScrollTop: ifScrollTopClear ? 0 : state.curScrollTop,
            }
        default:
            throw new Error()
    }
}

// ===============context ============== //
const ScrollContext = createContext({
    dispatch: undefined,
    renderLen: 1,
    start: 0,
    offsetStart: 0,
    // =============
    rowHeight: initialState.rowHeight,
    totalLen: 0,
    vid: DEFAULT_VID,
})

// =============组件 =================== //

function VCell(props: any): JSX.Element {
    const { children, ...restProps } = props

    return (
        <td {...restProps}>
            <div>{children}</div>
        </td>
    )
}

function VRow(props: any, ref: any): JSX.Element {
    const { dispatch, rowHeight, totalLen, vid } = useContext(ScrollContext)

    const { children, style, ...restProps } = props

    const trRef = useRef<HTMLTableRowElement>(null)

    useEffect(() => {
        const initHeight = (tempRef) => {
            if (tempRef?.current?.offsetHeight && !rowHeight && totalLen) {
                const tempRowHeight = tempRef?.current?.offsetHeight ?? 0

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

        initHeight(
            Object.prototype.hasOwnProperty.call(ref, 'current') ? ref : trRef
        )
    }, [trRef, dispatch, rowHeight, totalLen, ref, vid])

    return (
        <tr
            {...restProps}
            ref={
                Object.prototype.hasOwnProperty.call(ref, 'current')
                    ? ref
                    : trRef
            }
            style={{
                ...style,
                height: rowHeight || 'auto',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </tr>
    )
}

function VWrapper(props: any): JSX.Element {
    const { children, ...restProps } = props

    const { renderLen, start, dispatch, vid, totalLen } = useContext(
        ScrollContext
    )

    const contents = useMemo(() => {
        return children[1]
    }, [children])

    const contentsLen = useMemo(() => {
        return contents?.length ?? 0
    }, [contents])

    useEffect(() => {
        if (totalLen !== contentsLen) {
            dispatch({
                type: 'changeTotalLen',
                totalLen: contentsLen ?? 0,
            })
        }
    }, [contentsLen, dispatch, vid, totalLen])

    let tempNode = null
    if (Array.isArray(contents) && contents.length) {
        tempNode = [
            children[0],
            contents.slice(start, start + (renderLen ?? 1)).map((item) => {
                if (Array.isArray(item)) {
                    // 兼容antd v4.3.5 --- rc-table 7.8.1及以下
                    return item[0]
                }
                // 处理antd ^v4.4.0  --- rc-table ^7.8.2
                return item
            }),
        ]
    } else {
        tempNode = children
    }

    return <tbody {...restProps}>{tempNode}</tbody>
}

function VTable(props: any, otherParams): JSX.Element {
    const { style, children, ...rest } = props
    const { width, ...rest_style } = style

    const { vid, scrollY, reachEnd, onScroll, resetScrollTopWhenDataChange } =
        otherParams ?? {}

    const [state, dispatch] = useReducer(reducer, initialState)

    const wrap_tableRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)

    // 数据的总条数
    const [totalLen, setTotalLen] = useState<number>(
        children[1]?.props?.data?.length ?? 0
    )

    useEffect(() => {
        setTotalLen(state.totalLen)
    }, [state.totalLen])

    // 组件卸载的清除操作
    useEffect(() => {
        return () => {
            vidMap.delete(vid)
        }
    }, [vid])

    // table总高度
    const tableHeight = useMemo<string | number>(() => {
        let temp: string | number = 'auto'

        if (state.rowHeight && totalLen) {
            temp = state.rowHeight * totalLen
        }
        return temp
    }, [state.rowHeight, totalLen])

    // table的scrollY值
    const [tableScrollY, setTableScrollY] = useState(0)

    // tableScrollY 随scrollY / tableHeight 进行变更
    useEffect(() => {
        let temp = 0

        if (typeof scrollY === 'string') {
            temp =
                (wrap_tableRef.current?.parentNode as HTMLElement)
                    ?.offsetHeight ?? 0
        } else {
            temp = scrollY
        }

        // if (isNumber(tableHeight) && tableHeight < temp) {
        //   temp = tableHeight;
        // }

        // 处理tableScrollY <= 0的情况
        if (temp <= 0) {
            temp = 0
        }

        setTableScrollY(temp)
    }, [scrollY, tableHeight])

    // 渲染的条数
    const renderLen = useMemo<number>(() => {
        let temp = 1
        if (state.rowHeight && totalLen && tableScrollY) {
            if (tableScrollY <= 0) {
                temp = 0
            } else {
                const tempRenderLen =
                    ((tableScrollY / state.rowHeight) | 0) + 1 + 2
                // console.log('tempRenderLen', tempRenderLen)
                // temp = tempRenderLen > totalLen ? totalLen : tempRenderLen;
                temp = tempRenderLen
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
        start -= 1
        offsetStart += state.rowHeight
    } else {
        start = 0
    }

    // 数据变更 操作scrollTop
    useEffect(() => {
        const scrollNode = wrap_tableRef.current?.parentNode as HTMLElement

        if (resetScrollTopWhenDataChange) {
            // 重置scrollTop
            if (scrollNode) {
                scrollNode.scrollTop = 0
            }

            dispatch({ type: 'reset', ifScrollTopClear: true })
        } else {
            // 不重置scrollTop 不清空curScrollTop
            dispatch({ type: 'reset', ifScrollTopClear: false })
        }

        if (vidMap.has(vid)) {
            vidMap.set(vid, {
                ...vidMap.get(vid),
                scrollNode,
            })
        }
    }, [totalLen, resetScrollTopWhenDataChange, vid, children])

    useEffect(() => {
        const throttleScroll = throttle((e) => {
            const historyScrollHeight = vidMap.get(vid)?.scrollHeight

            const scrollTop: number = e?.target?.scrollTop ?? 0
            const scrollHeight: number = e?.target?.scrollHeight ?? 0
            const clientHeight: number = e?.target?.clientHeight ?? 0
            const ratio: number = window.devicePixelRatio
            const precisionScrollTop = ratio === 1 ? scrollTop : Math.ceil(scrollTop)
            // 到底了 没有滚动条就不会触发reachEnd. 建议设置scrolly高度少点或者数据量多点.
            if (precisionScrollTop === scrollHeight) {
                // reachEnd && reachEnd()
            } else if (
                precisionScrollTop + clientHeight >= scrollHeight &&
                historyScrollHeight !== scrollHeight
            ) {
                // 相同的tableData情况下, 上次reachEnd执行后, scrollHeight不变, 则不会再次请求reachEnd
                vidMap.set(vid, {
                    ...vidMap.get(vid),
                    scrollHeight,
                })
                // 有滚动条的情况
                // eslint-disable-next-line no-unused-expressions
                reachEnd && reachEnd()
            }

            // eslint-disable-next-line no-unused-expressions
            onScroll && onScroll()

            // 若renderLen大于totalLen, 置空curScrollTop. => table paddingTop会置空.
            dispatch({
                type: 'changeTrs',
                curScrollTop: renderLen <= totalLen ? scrollTop : 0,
                vid,
            })
        }, 60)

        const ref = wrap_tableRef?.current?.parentNode as HTMLElement

        if (ref) {
            ref.addEventListener('scroll', throttleScroll)
        }

        return () => {
            ref.removeEventListener('scroll', throttleScroll)
        }
    }, [onScroll, reachEnd, renderLen, totalLen, vid])

    debounceListRender(start, renderLen)

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
                    rowHeight: vidMap?.get(vid)?.rowItemHeight,
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
                        transform: `translateY(-${offsetStart}px)`,
                    }}
                >
                    {children}
                </table>
            </ScrollContext.Provider>
        </div>
    )
}

// ================导出===================
export function VList(props: {
    height: number | string
    // 到底的回调函数
    onReachEnd?: () => void
    onScroll?: () => void
    // 列表渲染时触发的回调函数(参数可以拿到 start: 渲染开始行, renderLen: 渲染行数)
    // listRender: provide info: {start, renderLen} on render list.
    // start: start index in render list.
    // renderLen: render length in render list.
    onListRender?: (listInfo: { start: number; renderLen: number }) => void
    // 列表渲染时触发的回调函数防抖毫秒数.
    // listRender debounceMs.
    debounceListRenderMS?: number
    // 唯一标识
    vid?: string
    // 重置scrollTop 当数据变更的时候.  默认为true
    // reset scrollTop when data change
    resetTopWhenDataChange?: boolean
}): any {
    const {
        vid = DEFAULT_VID,
        height,
        onReachEnd,
        onScroll,
        onListRender,
        debounceListRenderMS,
        resetTopWhenDataChange = true,
    } = props

    const resetScrollTopWhenDataChange = onReachEnd
        ? false
        : resetTopWhenDataChange

    if (!vidMap.has(vid)) {
        vidMap.set(vid, { _id: vid })
    }

    debounceListRender = onListRender
        ? debounce((_start, _renderLen) => {
              onListRender({ start: _start, renderLen: _renderLen })
          }, debounceListRenderMS ?? 300)
        : () => {}

    return {
        table: (p) =>
            VTable(p, {
                vid,
                scrollY: height,
                reachEnd: onReachEnd,
                onScroll,
                onListRender,
                resetScrollTopWhenDataChange,
            }),
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

    try {
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

        return { vid, rowItemHeight }
    } catch (e) {
        console.error('dont call scrollTo before init table')

        return { vid, rowItemHeight: -1 }
    }
}
