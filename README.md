# virtuallist-antd

> 

[![NPM](https://img.shields.io/npm/v/virtuallist-antd.svg)](https://www.npmjs.com/package/virtuallist-antd) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

virtualList for antd-table, 实现antd-table的虚拟列表, antd-table无限滚动, infinite scrolling for antd-table

* 你可以像平常一样在columns里使用fixed
* 支持进行条件搜索 变更数据.
* 300行不到的代码
* 目前用了节流 - 120ms 在滚动的时候刷新窗口

## example
* [简单的例子](https://codesandbox.io/s/festive-worker-wc5wp)

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
				y: 1000 // 滚动的高度, very important, 可以是受控属性, required
			}}
			// 使用VList 即可有虚拟列表的效果
			components={VList()}
		/>
	)
}

ReactDom.render(<Example />, dom)

```

## License

MIT © [crawler-django](https://github.com/crawler-django)
