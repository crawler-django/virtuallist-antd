# virtuallist-antd

>

[![NPM](https://img.shields.io/npm/v/virtuallist-antd.svg)](https://www.npmjs.com/package/virtuallist-antd) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> 仓库(github): https://github.com/crawler-django/virtuallist-antd

> 版本更新记录(update detail): https://github.com/crawler-django/virtuallist-antd/blob/master/update.md

virtualList for antd-table, 实现 antd-table 的虚拟列表, antd-table 无限滚动, infinite scrolling for antd-table. 支持 antd 树形表格, antd 版本要在 4.17.0 及以上, virtuallist-antd 要再 0.6.3 及以上. (support tree data, after antd v4.17.0, after virtuallist-antd v0.6.3)

-   已经支持 4.0 的 antd-table.(4.x ---- v0.3.0 后, 3.x ---- v0.2.8.)

    (support antdv4. 4.x --- ^v0.3.0, 3.x --- v0.2.8. 3.x not updated)

-   你可以像平常一样在 columns 里使用 fixed

    (u can use fixed as usual)

-   支持进行条件搜索 变更数据.

    (support search data as usual)

-   目前用了节流 - 60ms 在滚动的时候刷新窗口

    (use throttle, 60ms)

-   支持分页, calc().

    (support pagination, support scrolly for calc())

-   只支持纵向虚拟列表.

    (only support vertical virtuallist)

-   此组件会计算第一行的高度, 并且以第一行的高度为准来固定每行的高度. 组件有自带的 css,  会使每行的 td 不会换行.

    (this component will calculate first line's height and amend following each line's height based on it. It has its own css, which prevents each line's TD from wrapping (td do not wrap))

## example

-   [简单的例子(easy example)](https://codesandbox.io/s/festive-worker-wc5wp)
-   [简单的分页例子(easy pagination example)](https://codesandbox.io/s/gracious-resonance-tmw44)
-   [简单的 resize 例子(easy resize columns example)](https://codesandbox.io/s/vibrant-darkness-kvt56?file=/index.js)
-   [简单的单页无限加载例子(easy infinite load data on single page that example)](https://codesandbox.io/s/reachend-wuxianjiazaixunigundong-y9nhd)
-   [简单的 scrollTo 例子(easy scrollTo example)](https://codesandbox.io/s/scrollto-jx10t)
-   [简单的树形表格例子(easy tree table example)](https://codesandbox.io/s/reachend-wuxianjiazaixunigundong-forked-63iom?file=/src/index.tsx)

## complex example

-   [拖拽行(drag row)](https://codesandbox.io/s/drag-row-1fjg4?file=/index.js)
-   [拖拽手柄列(drag row in handle-icon)](https://codesandbox.io/s/tuozhuaishoubinglie-antd4156-forked-1d6z1?file=/index.js)
-   [编辑列(edit cell)](https://codesandbox.io/s/editable-example-3656ln?file=/src/App.js)

## Install

```bash
npm install --save virtuallist-antd
```

## Usage

```tsx
import React, { useMemo } from 'react'
import ReactDom from 'react-dom'

import { VList } from 'virtuallist-antd'
import { Table } from 'antd'

function Example(): JSX.Element {
	const dataSource = [...]
	const columns = [...]
	const rowkey = 'xxx'

	const vComponents = useMemo(() => {
		// 使用VList 即可有虚拟列表的效果
		return VList({
			height: 1000 // 此值和scrollY值相同. 必传. (required).  same value for scrolly
		})
	}, [])

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			rowKey={rowKey}
			scroll={{
				y: 1000 // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
			}}
			components={vComponents}
		/>
	)
}

ReactDom.render(<Example />, dom)

```

## VList

```tsx
	VList({
		height: number | string,  // (必填) 对应scrollY.
		onReachEnd: () => void, // (可选) 滚动条滚到底部触发api. (scrollbar to the end)
		onScroll: () => void, // (可选) 滚动时触发的api. (triggered by scrolling)
		vid: string, // (可选, 如果同一页面存在多个虚拟表格时必填.) 唯一标识. (unique vid, required when exist more vitual table on a page)
		resetTopWhenDataChange: boolean, // 默认为true. 是否数据变更后重置滚动条 (default true, Whether to reset scrollTop when data changes)
	})

	VList returns: {
		table: VTable,
		body: {
			wrapper: VWrapper,
			row: VRow,
			cell: VCell,
		}
	}
```

## api

```tsx
import { scrollTo } from 'virtuallist-antd'

// scrollTo
scrollTo({
    row: number, // 行数. (row number)
    y: number, // y偏移量. (offset Y)
    vid: string, // 对应VList的vid. (same as VList vid)
})
```

## License

MIT © [crawler-django](https://github.com/crawler-django)
