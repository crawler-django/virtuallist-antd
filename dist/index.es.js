import React, { createContext, useContext, useRef, useEffect, useReducer } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".style_ant-table-tbody__cO5bv > tr > td {\n    box-sizing: border-box;\n    white-space: nowrap;\n    overflow: hidden;\n    vertical-align: middle;\n    text-overflow: ellipsis;\n    width: inherit;\n}";
styleInject(css);

// ===============reducer ============== //
var initialState = {
    // 行高度
    rowHeight: 0,
    // 当前的scrollTop
    curScrollTop: 0,
    // 可滚动区域的高度
    scrollHeight: 0
};
function reducer(state, action) {
    switch (action.type) {
        // 改变trs 即 改变渲染的列表trs
        case 'changeTrs':
            // 获取值
            var curScrollTop = action.curScrollTop;
            var scrollHeight = action.scrollHeight;
            if (scrollHeight <= 0) {
                scrollHeight = 0;
            }
            if (state.scrollHeight !== 0) {
                scrollHeight = state.scrollHeight;
            }
            if (curScrollTop > scrollHeight) {
                curScrollTop = scrollHeight;
            }
            return __assign(__assign({}, state), { curScrollTop: curScrollTop,
                scrollHeight: scrollHeight });
        // 初始化每行的高度, 表格总高度, 渲染的条数
        case 'initHeight':
            // 获取值
            var rowHeight = action.rowHeight;
            // console.log('rowheight', rowHeight)
            return __assign(__assign({}, state), { rowHeight: rowHeight });
        case 'reset':
            return __assign(__assign({}, state), { curScrollTop: 0, scrollHeight: 0 });
        default:
            throw new Error();
    }
}
// ===============context ============== //
var ScrollContext = createContext({
    fixed: 0,
    dispatch: undefined,
    renderLen: 1,
    start: 0,
    offsetStart: 0,
    // =============
    rowHeight: initialState.rowHeight
});
// ==============常量 ================== //
// 用来解决fix表格和unfix表格的高度差异
var staticRowHeight = 0;
// =============组件 =================== //
function VRow(props) {
    var _a = useContext(ScrollContext), dispatch = _a.dispatch, fixed = _a.fixed, rowHeight = _a.rowHeight;
    var children = props.children, restProps = __rest(props, ["children"]);
    var trRef = useRef(null);
    // console.log(`row fixed ${fixed}`)
    useEffect(function () {
        var initHeight = function (trRef) {
            var _a, _b, _c, _d, _e;
            if (((_b = (_a = trRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.offsetHeight) && !rowHeight) {
                var tempRowHeight = (_e = (_d = (_c = trRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.offsetHeight, (_e !== null && _e !== void 0 ? _e : 0));
                if (!fixed) {
                    staticRowHeight = tempRowHeight;
                }
                // console.log('state', rowHeight, tempRowHeight)
                dispatch({
                    type: 'initHeight',
                    rowHeight: fixed ? staticRowHeight : tempRowHeight
                });
            }
        };
        initHeight(trRef);
    }, [trRef, dispatch, rowHeight, fixed]);
    return (React.createElement("tr", __assign({}, restProps, { ref: trRef, style: {
            height: rowHeight && fixed ? rowHeight + 1 : rowHeight,
            boxSizing: 'border-box'
        } }), children));
}
function VWrapper(props) {
    var children = props.children, restProps = __rest(props, ["children"]);
    var _a = useContext(ScrollContext), renderLen = _a.renderLen, start = _a.start, offsetStart = _a.offsetStart;
    // console.log(`wrap fixed ${fixed}`)
    // console.log(start, renderLen)
    var trs = [];
    for (var i = 0; i < renderLen; i++) {
        if (children[start + i]) {
            trs.push(children[start + i]);
        }
    }
    // console.log(trs)
    return (React.createElement("tbody", __assign({}, restProps, { style: { transform: "translateY(-" + offsetStart + "px)" } }), trs));
}
function VTable(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var style = props.style, children = props.children, rest = __rest(props, ["style", "children"]);
    var width = style.width, rest_style = __rest(style
    // const [curScrollTop, setCurScrollTop] = useState(0)
    , ["width"]);
    // const [curScrollTop, setCurScrollTop] = useState(0)
    var _p = useReducer(reducer, initialState), state = _p[0], dispatch = _p[1];
    var wrap_tableRef = useRef(null);
    var tableRef = useRef(null);
    var totalLen = (_d = (_c = (_b = (_a = children[2]) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.length, (_d !== null && _d !== void 0 ? _d : 0));
    var tableScrollY = (_k = (_j = (_h = (_g = (_f = (_e = children[2]) === null || _e === void 0 ? void 0 : _e.props) === null || _f === void 0 ? void 0 : _f.children[0]) === null || _g === void 0 ? void 0 : _g.props) === null || _h === void 0 ? void 0 : _h.scroll) === null || _j === void 0 ? void 0 : _j.y, (_k !== null && _k !== void 0 ? _k : 0));
    var fixed = (_o = (_m = (_l = children[0]) === null || _l === void 0 ? void 0 : _l.props) === null || _m === void 0 ? void 0 : _m.fixed, (_o !== null && _o !== void 0 ? _o : 0));
    // console.log(`VTable fixed ${fixed}`)
    // table总高度
    var tableHeight = 'auto';
    if (state.rowHeight && totalLen) {
        tableHeight = state.rowHeight * totalLen;
    }
    // console.log(state.rowHeight, totalLen, tableScrollY)
    // 渲染的条数
    var renderLen = 1;
    if (state.rowHeight && totalLen && tableScrollY) {
        var tempRenderLen = (tableScrollY / state.rowHeight) | (0 + 1 + 5);
        // console.log('tempRenderLen', tempRenderLen)
        renderLen = tempRenderLen > totalLen ? totalLen : tempRenderLen;
    }
    // console.log('table', renderLen)
    // 渲染中的第一条
    var start = state.rowHeight ? (state.curScrollTop / state.rowHeight) | 0 : 0;
    // 偏移量
    var offsetStart = state.rowHeight ? state.curScrollTop % state.rowHeight : 0;
    // 用来优化向上滚动出现的空白
    if (state.curScrollTop &&
        state.rowHeight &&
        state.curScrollTop > state.rowHeight) {
        if (start > 1) {
            start = start - 1;
            offsetStart += state.rowHeight;
        }
        if (start >= totalLen - renderLen) {
            start = totalLen - renderLen;
            offsetStart = 0;
        }
    }
    // console.log(start, offsetStart)
    useEffect(function () {
        // totalLen变化, 那么搜索条件一定变化, 数据也一定变化.
        var parentNode = wrap_tableRef.current.parentNode;
        parentNode.scrollTop = 0;
        dispatch({ type: 'reset' });
    }, [totalLen]);
    // console.log(totalLen, scrollY)
    useEffect(function () {
        var _a, _b;
        var throttleScroll = throttle(function (e) {
            var _a, _b, _c;
            var scrollTop = (_c = (_b = (_a = e) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.scrollTop, (_c !== null && _c !== void 0 ? _c : 0));
            if (scrollTop !== state.curScrollTop) {
                var scrollHeight = e.target.scrollHeight - tableScrollY;
                dispatch({
                    type: 'changeTrs',
                    curScrollTop: scrollTop,
                    scrollHeight: scrollHeight
                });
            }
        }, 120);
        var ref = (_b = (_a = wrap_tableRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.parentNode;
        if (ref) {
            ref.addEventListener('scroll', throttleScroll);
        }
        return function () {
            // console.log('clear')
            ref.removeEventListener('scroll', throttleScroll);
        };
    }, [wrap_tableRef, state.curScrollTop, tableScrollY, state.scrollHeight]);
    return (React.createElement("div", { ref: wrap_tableRef, style: {
            width: width,
            position: 'relative',
            height: tableHeight,
            boxSizing: 'border-box',
            paddingTop: state.curScrollTop,
            fontFamily: 'sans-serif'
        } },
        React.createElement(ScrollContext.Provider, { value: {
                fixed: fixed,
                dispatch: dispatch,
                rowHeight: state.rowHeight,
                start: start,
                offsetStart: offsetStart,
                renderLen: renderLen
            } },
            React.createElement("table", __assign({}, rest, { ref: tableRef, style: __assign(__assign({}, rest_style), { width: width, position: 'relative' }) }), children))));
}
// ================导出===================
function VList() {
    // 初始化staticRowHeight
    staticRowHeight = 0;
    return {
        table: VTable,
        body: {
            wrapper: VWrapper,
            row: VRow
        }
    };
}

export { VList };
//# sourceMappingURL=index.es.js.map
