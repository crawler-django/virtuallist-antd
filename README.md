# virtuallist-antd

> 

[![NPM](https://img.shields.io/npm/v/virtuallist-antd.svg)](https://www.npmjs.com/package/virtuallist-antd) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> 仓库(github): https://github.com/crawler-django/virtuallist-antd    

> 版本更新记录(update detail): https://github.com/crawler-django/virtuallist-antd/blob/master/update.md

virtualList for antd-table, 实现antd-table的虚拟列表, antd-table无限滚动, infinite scrolling for antd-table. 暂时不会支持树形结构的表格功能. (not support tree data)

* 已经支持4.0的antd-table.(4.x ---- v0.3.0后,  3.x ---- v0.2.8.) 

  (support antdv4. 4.x --- ^v0.3.0, 3.x --- v0.2.8. 3.x not updated)
* 你可以像平常一样在columns里使用fixed

  (u can use fixed as usual)

* 支持进行条件搜索 变更数据.

  (support search data as usual)
* 目前用了节流 - 60ms 在滚动的时候刷新窗口

  (use throttle, 60ms)
* 支持分页, calc().

  (support pagination, support scrolly for calc())
* 只支持纵向虚拟列表.

  (only support vertical virtuallist)
* 此组件会计算第一行的高度, 并且以第一行的高度为准来固定每行的高度. 组件有自带的css, 会使每行的td不会换行.

  (this component will calculate first line's height and amend following each line's height based on it. It has its own css, which prevents each line's TD from wrapping (td do not wrap))

## example
* [简单的例子(easy example)](https://codesandbox.io/s/festive-worker-wc5wp)
* [简单的分页例子(easy pagination example)](https://codesandbox.io/s/gracious-resonance-tmw44)
* [简单的resize例子(easy resize columns example)](https://codesandbox.io/s/vibrant-darkness-kvt56?file=/index.js)
* [简单的单页加载例子(easy load data on single page that example)](https://codesandbox.io/s/reachend-wuxianjiazaixunigundong-y9nhd)
* [简单的scrollTo例子(easy scrollTo example)](https://codesandbox.io/s/scrollto-jx10t)

## Install

```bash
npm install --save virtuallist-antd
```

## Usage

```tsx
import * as React from 'react'
import ReactDom from 'react-dom'

import { VList } from 'virtuallist-antd'
import { Table } from 'antd'

function Example(): JSX.Element {
	const dataSource = [...]
	const columns = [...]
	const rowkey = 'xxx'
	return (
		<Table 
			dataSource={dataSource}
			columns={columns}
			rowKey={rowKey}
			scroll={{
				y: 1000 // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
			}}
			// 使用VList 即可有虚拟列表的效果
			components={VList({
				height: 1000 // 此值和scrollY值相同. 必传. (required).  same value for scrolly
			})}
		/>
	)
}

ReactDom.render(<Example />, dom)

```

## License

MIT © [crawler-django](https://github.com/crawler-django)
