// import { TableComponents } from 'antd/lib/table'
import React, {
    useRef,
    useEffect,
    useContext,
    createContext,
    useReducer
} from 'react'
import { throttle } from 'lodash-es'

import './style.css'

// ===============reducer ============== //
const initialState = {
    // 行高度
    rowHeight: 0,
    // 当前的scrollTop
    curScrollTop: 0,
    // 可滚动区域的高度
    scrollHeight: 0
}

function reducer(state, action) {
    switch (action.type) {
        // 改变trs 即 改变渲染的列表trs
        case 'changeTrs':
            // 获取值
            let curScrollTop = action.curScrollTop
            let scrollHeight = action.scrollHeight

            if (state.scrollHeight !== 0) {
                scrollHeight = state.scrollHeight
            }

            if (curScrollTop > scrollHeight) {
                curScrollTop = scrollHeight
            }

            return {
                ...state,
                curScrollTop,
                scrollHeight
            }
        // 初始化每行的高度, 表格总高度, 渲染的条数
        case 'initHeight':
            // 获取值
            let rowHeight = action.rowHeight
            // console.log('rowheight', rowHeight)
            return {
                ...state,
                rowHeight
            }

        case 'reset':
            return {
                ...state,
                curScrollTop: 0,
                scrollHeight: 0
            }
        default:
            throw new Error()
    }
}

// ===============context ============== //
const ScrollContext = createContext({
    fixed: 0,
    dispatch: undefined,
    renderLen: 1,
    start: 0,
    offsetStart: 0,
    // =============
    rowHeight: initialState.rowHeight
})

// ==============常量 ================== //
// 用来解决fix表格和unfix表格的高度差异
let staticRowHeight = 0

// =============组件 =================== //

function VRow(props): JSX.Element {
    const { dispatch, fixed, rowHeight } = useContext(ScrollContext)

    const { children, ...restProps } = props

    const trRef = useRef(null)
    // console.log(`row fixed ${fixed}`)

    useEffect(() => {
        const initHeight = trRef => {
            if (trRef?.current?.offsetHeight && !rowHeight) {
                let tempRowHeight = trRef?.current?.offsetHeight ?? 0
                if (!fixed) {
                    staticRowHeight = tempRowHeight
                }
                // console.log('state', rowHeight, tempRowHeight)
                dispatch({
                    type: 'initHeight',
                    rowHeight: fixed ? staticRowHeight : tempRowHeight
                })
            }
        }

        initHeight(trRef)
    }, [trRef, dispatch, rowHeight, fixed])

    return (
        <tr
            {...restProps}
            ref={trRef}
            style={{
                height: rowHeight && fixed ? rowHeight + 1 : rowHeight,
                boxSizing: 'border-box'
            }}
        >
            {children}
        </tr>
    )
}

function VWrapper(props): JSX.Element {
    const { children, ...restProps } = props

    const { renderLen, start, offsetStart } = useContext(ScrollContext)

    // console.log(`wrap fixed ${fixed}`)
    // console.log(start, renderLen)
    let trs = []
    for (let i = 0; i < renderLen; i++) {
        if (children[start + i]) {
            trs.push(children[start + i])
        }
    }

    // console.log(trs)

    return (
        <tbody
            {...restProps}
            style={{ transform: `translateY(-${offsetStart}px)` }}
        >
            {trs}
        </tbody>
    )
}

function VTable(props): JSX.Element {
    const { style, children, ...rest } = props
    const { width, ...rest_style } = style

    // const [curScrollTop, setCurScrollTop] = useState(0)

    const [state, dispatch] = useReducer(reducer, initialState)

    const wrap_tableRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef(null)

    let totalLen = children[2]?.props?.children?.length ?? 0
    let tableScrollY = children[2]?.props?.children[0]?.props?.scroll?.y ?? 0
    let fixed = children[0]?.props?.fixed ?? 0

    // console.log(`VTable fixed ${fixed}`)
    // table总高度
    let tableHeight: string | number = 'auto'
    if (state.rowHeight && totalLen) {
        tableHeight = state.rowHeight * totalLen
    }

    // console.log(state.rowHeight, totalLen, tableScrollY)
    // 渲染的条数
    let renderLen = 1
    if (state.rowHeight && totalLen && tableScrollY) {
        let tempRenderLen = (tableScrollY / state.rowHeight) | (0 + 1 + 5)
        // console.log('tempRenderLen', tempRenderLen)
        renderLen = tempRenderLen > totalLen ? totalLen : tempRenderLen
    }
    // console.log('table', renderLen)

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
        if (start > 1) {
            start = start - 1
            offsetStart += state.rowHeight
        }
        if (start >= totalLen - renderLen) {
            start = totalLen - renderLen
            offsetStart = 0
        }
    }

    // console.log(start, offsetStart)

    useEffect(() => {
        // totalLen变化, 那么搜索条件一定变化, 数据也一定变化.
        let parentNode: any = wrap_tableRef.current.parentNode
        parentNode.scrollTop = 0
        dispatch({ type: 'reset' })
    }, [totalLen])

    // console.log(totalLen, scrollY)

    useEffect(() => {
        const throttleScroll = throttle(e => {
            let scrollTop = e?.target?.scrollTop ?? 0
            if (scrollTop !== state.curScrollTop) {
                let scrollHeight = e.target.scrollHeight - tableScrollY
                dispatch({
                    type: 'changeTrs',
                    curScrollTop: scrollTop,
                    scrollHeight
                })
            }
        }, 120)

        let ref = wrap_tableRef?.current?.parentNode

        if (ref) {
            ref.addEventListener('scroll', throttleScroll)
        }

        return () => {
            // console.log('clear')
            ref.removeEventListener('scroll', throttleScroll)
        }
    }, [wrap_tableRef, state.curScrollTop, tableScrollY, state.scrollHeight])

    return (
        <div
            ref={wrap_tableRef}
            style={{
                width,
                position: 'relative',
                height: tableHeight,
                boxSizing: 'border-box',
                paddingTop: state.curScrollTop,
                fontFamily: 'sans-serif'
            }}
        >
            <ScrollContext.Provider
                value={{
                    fixed,
                    dispatch,
                    rowHeight: state.rowHeight,
                    start,
                    offsetStart,
                    renderLen
                }}
            >
                <table
                    {...rest}
                    ref={tableRef}
                    style={{
                        ...rest_style,
                        width,
                        position: 'relative'
                    }}
                >
                    {children}
                </table>
            </ScrollContext.Provider>
        </div>
    )
}

// ================导出===================
export function VList() {
    // 初始化staticRowHeight
    staticRowHeight = 0

    return {
        table: VTable,
        body: {
            wrapper: VWrapper,
            row: VRow
        }
    }
}
