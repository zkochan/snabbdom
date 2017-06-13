(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var is = require("./is");
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        }
        else if (is.primitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        }
        else if (is.primitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i]);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
;
exports.default = h;

},{"./is":4,"./vnode":30}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pre(vnode, newVnode) {
    var attachData = vnode.data.attachData;
    // Copy created placeholder and real element from old vnode
    newVnode.data.attachData.placeholder = attachData.placeholder;
    newVnode.data.attachData.real = attachData.real;
    // Mount real element in vnode so the patch process operates on it
    vnode.elm = vnode.data.attachData.real;
}
function post(_, vnode) {
    // Mount dummy placeholder in vnode so potential reorders use it
    vnode.elm = vnode.data.attachData.placeholder;
}
function destroy(vnode) {
    // Remove placeholder
    if (vnode.elm !== undefined) {
        vnode.elm.parentNode.removeChild(vnode.elm);
    }
    // Remove real element from where it was inserted
    vnode.elm = vnode.data.attachData.real;
}
function create(_, vnode) {
    var real = vnode.elm, attachData = vnode.data.attachData;
    var placeholder = document.createElement('span');
    // Replace actual element with dummy placeholder
    // Snabbdom will then insert placeholder instead
    vnode.elm = placeholder;
    attachData.target.appendChild(real);
    attachData.real = real;
    attachData.placeholder = placeholder;
}
function attachTo(target, vnode) {
    if (vnode.data === undefined)
        vnode.data = {};
    if (vnode.data.hook === undefined)
        vnode.data.hook = {};
    var data = vnode.data;
    var hook = vnode.data.hook;
    data.attachData = { target: target, placeholder: undefined, real: undefined };
    hook.create = create;
    hook.prepatch = pre;
    hook.postpatch = post;
    hook.destroy = destroy;
    return vnode;
}
exports.attachTo = attachTo;
;
exports.default = attachTo;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
exports.htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment,
};
exports.default = exports.htmlDomApi;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
    "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled",
    "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
    "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
    "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
    "truespeed", "typemustmatch", "visible",
    // AMP attributes
    "⚡", "amp", "amp-boilerplate"];
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var colonChar = 58;
var xChar = 120;
var booleanAttrsDict = Object.create(null);
for (var i = 0, len = booleanAttrs.length; i < len; i++) {
    booleanAttrsDict[booleanAttrs[i]] = true;
}
function updateAttrs(oldVnode, vnode) {
    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
        if (old !== cur) {
            if (booleanAttrsDict[key]) {
                if (cur) {
                    elm.setAttribute(key, "");
                }
                else {
                    elm.removeAttribute(key);
                }
            }
            else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
exports.attributesModule = { create: updateAttrs, update: updateAttrs };
exports.default = exports.attributesModule;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
exports.classModule = { create: updateClass, update: updateClass };
exports.default = exports.classModule;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CAPS_REGEX = /[A-Z]/g;
function updateDataset(oldVnode, vnode) {
    var elm = vnode.elm, oldDataset = oldVnode.data.dataset, dataset = vnode.data.dataset, key;
    if (!oldDataset && !dataset)
        return;
    if (oldDataset === dataset)
        return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};
    var d = elm.dataset;
    for (key in oldDataset) {
        if (!dataset[key]) {
            if (d) {
                delete d[key];
            }
            else {
                elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
            }
        }
    }
    for (key in dataset) {
        if (oldDataset[key] !== dataset[key]) {
            if (d) {
                d[key] = dataset[key];
            }
            else {
                elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
            }
        }
    }
}
exports.datasetModule = { create: updateDataset, update: updateDataset };
exports.default = exports.datasetModule;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
exports.eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};
exports.default = exports.eventListenersModule;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = { create: updateProps, update: updateProps };
exports.default = exports.propsModule;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function (fn) { raf(function () { raf(fn); }); };
function setNextFrame(obj, prop, val) {
    nextFrame(function () { obj[prop] = val; });
}
function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    var oldHasDel = 'delayed' in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === 'delayed' && style.delayed) {
            for (var name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        }
        else if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm, s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
exports.styleModule = {
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};
exports.default = exports.styleModule;

},{}],11:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"util/":17}],12:[function(require,module,exports){
console.log('lol');
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory); // AMD. Register as an anonymous module.
  } else if (typeof exports === 'object') {
    module.exports = factory(); // NodeJS
  } else { // Browser globals (root is window)
  root.fakeRaf = factory();
  }
}(this, function () {

var original;

var requesters = [];

function fakeRaf(fn) {
  requesters.push(fn);
}

function use() {
  original = window.requestAnimationFrame;
  window.requestAnimationFrame = fakeRaf;
}

function restore() {
  window.requestAnimationFrame = original;
}

function step() {
  var cur = requesters;
  requesters = [];
  cur.forEach(function(f) { f(16); });
}

return {use: use, restore: restore, step: step};

}));

},{}],13:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],14:[function(require,module,exports){
(function (global){
/*jshint -W054 */
(function (exports) {
  'use strict';

  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  exports.knuthShuffle = shuffle;
}('undefined' !== typeof exports && exports || 'undefined' !== typeof window && window || global));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],16:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],17:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":16,"_process":15,"inherits":13}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var is = require("./is");
var htmldomapi_1 = require("./htmldomapi");
function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
var h_1 = require("./h");
exports.h = h_1.h;
var thunk_1 = require("./thunk");
exports.thunk = thunk_1.thunk;
function init(modules, domApi) {
    var i, j, cbs = {};
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                : api.createElement(tag);
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}
exports.init = init;

},{"./h":1,"./htmldomapi":3,"./is":4,"./thunk":28,"./vnode":30}],19:[function(require,module,exports){
var assert = require('assert');
var snabbdom = require('../snabbdom');

var patch = snabbdom.init([]);
var attachTo = require('../helpers/attachto').default;
var h = require('../h').default;

describe('attachTo', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('adds element to target', function() {
    var vnode1 = h('div', [
       h('div#wrapper', [
         h('div', 'Some element'),
         attachTo(elm, h('div#attached', 'Test')),
       ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children.length, 2);
  });
  it('updates element at target', function() {
    var vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'First text')),
      ]),
    ]);
    var vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'New text')),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'First text');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.children[0].innerHTML, 'New text');
  });
  it('element can be inserted before modal', function() {
    var vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'Text')),
      ]),
    ]);
    var vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        h('div', 'A new element'),
        attachTo(elm, h('div#attached', 'Text')),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'Text');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.children[0].innerHTML, 'Text');
  });
  it('removes element at target', function() {
    var vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', 'First text')),
      ]),
    ]);
    var vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.children[0].innerHTML, 'First text');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.children.length, 1);
  });
  it('remove hook receives real element', function() {
    function rm(vnode, cb) {
      assert.equal(vnode.elm.tagName, 'DIV');
      assert.equal(vnode.elm.innerHTML, 'First text');
      cb();
    }
    var vnode1 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
        attachTo(elm, h('div#attached', {hook: {remove: rm}}, 'First text')),
      ]),
    ]);
    var vnode2 = h('div', [
      h('div#wrapper', [
        h('div', 'Some element'),
      ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm = patch(vnode1, vnode2).elm;
  });
});

},{"../h":1,"../helpers/attachto":2,"../snabbdom":18,"assert":11}],20:[function(require,module,exports){
var assert = require('assert');

var snabbdom = require('../snabbdom');
var patch = snabbdom.init([
  require('../modules/attributes').default,
]);
var h = require('../h').default;

describe('attributes', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('have their provided values', function() {
    var vnode1 = h('div', {attrs: {href: '/foo', minlength: 1, value: true}});
    elm = patch(vnode0, vnode1).elm;
    assert.strictEqual(elm.getAttribute('href'), '/foo');
    assert.strictEqual(elm.getAttribute('minlength'), '1');
    assert.strictEqual(elm.getAttribute('value'), 'true');
  });
  it('can be memoized', function() {
    var cachedAttrs = {href: '/foo', minlength: 1, value: true};
    var vnode1 = h('div', {attrs: cachedAttrs});
    var vnode2 = h('div', {attrs: cachedAttrs});
    elm = patch(vnode0, vnode1).elm;
    assert.strictEqual(elm.getAttribute('href'), '/foo');
    assert.strictEqual(elm.getAttribute('minlength'), '1');
    assert.strictEqual(elm.getAttribute('value'), 'true');
    elm = patch(vnode1, vnode2).elm;
    assert.strictEqual(elm.getAttribute('href'), '/foo');
    assert.strictEqual(elm.getAttribute('minlength'), '1');
    assert.strictEqual(elm.getAttribute('value'), 'true');
  });
  it('are not omitted when falsy values are provided', function() {
    var vnode1 = h('div', {attrs: {href: null, minlength: 0, value: false}});
    elm = patch(vnode0, vnode1).elm;
    assert.strictEqual(elm.getAttribute('href'), 'null');
    assert.strictEqual(elm.getAttribute('minlength'), '0');
    assert.strictEqual(elm.getAttribute('value'), 'false');
  });
  it('are set correctly when namespaced', function() {
    var vnode1 = h('div', {attrs: {'xlink:href': '#foo'}});
    elm = patch(vnode0, vnode1).elm;
    assert.strictEqual(elm.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), '#foo');
  });
  it('should not touch class nor id fields', function() {
    elm = document.createElement('div');
    elm.id = 'myId';
    elm.className = 'myClass';
    vnode0 = elm;
    var vnode1 = h('div#myId.myClass', {attrs: {}}, ['Hello']);
    elm = patch(vnode0, vnode1).elm;
    assert.strictEqual(elm.tagName, 'DIV');
    assert.strictEqual(elm.id, 'myId');
    assert.strictEqual(elm.className, 'myClass');
    assert.strictEqual(elm.textContent, 'Hello');
  });
  describe('boolean attribute', function() {
    it('is present and empty string if the value is truthy', function() {
      var vnode1 = h('div', {attrs: {required: true, readonly: 1, noresize: 'truthy'}});
      elm = patch(vnode0, vnode1).elm;
      assert.strictEqual(elm.hasAttribute('required'), true);
      assert.strictEqual(elm.getAttribute('required'), '');
      assert.strictEqual(elm.hasAttribute('readonly'), true);
      assert.strictEqual(elm.getAttribute('readonly'), '');
      assert.strictEqual(elm.hasAttribute('noresize'), true);
      assert.strictEqual(elm.getAttribute('noresize'), '');
    });
    it('is omitted if the value is falsy', function() {
      var vnode1 = h('div', {attrs: {required: false, readonly: 0, noresize: null}});
      elm = patch(vnode0, vnode1).elm;
      assert.strictEqual(elm.getAttribute('required'), null);
      assert.strictEqual(elm.getAttribute('readonly'), null);
      assert.strictEqual(elm.getAttribute('noresize'), null);
    });
  });
  describe('Object.prototype property', function() {
    it('is not considered as a boolean attribute and shouldn\'t be omitted', function() {
      var vnode1 = h('div', {attrs: {constructor: true}});
      elm = patch(vnode0, vnode1).elm;
      assert.strictEqual(elm.getAttribute('constructor'), 'true');
      var vnode2 = h('div', {attrs: {constructor: false}});
      elm = patch(vnode0, vnode2).elm;
      assert.strictEqual(elm.getAttribute('constructor'), 'false');
    });
  });
});

},{"../h":1,"../modules/attributes":5,"../snabbdom":18,"assert":11}],21:[function(require,module,exports){
var assert = require('assert');
var shuffle = require('knuth-shuffle').knuthShuffle;

var snabbdom = require('../snabbdom');
var patch = snabbdom.init([
  require('../modules/class').default,
  require('../modules/props').default,
  require('../modules/eventlisteners').default,
]);
var h = require('../h').default;
var toVNode = require('../tovnode').default;

function prop(name) {
  return function(obj) {
    return obj[name];
  };
}

function map(fn, list) {
  var ret = [];
  for (var i = 0; i < list.length; ++i) {
    ret[i] = fn(list[i]);
  }
  return ret;
}

var inner = prop('innerHTML');

describe('snabbdom', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  describe('hyperscript', function() {
    it('can create vnode with proper tag', function() {
      assert.equal(h('div').sel, 'div');
      assert.equal(h('a').sel, 'a');
    });
    it('can create vnode with children', function() {
      var vnode = h('div', [h('span#hello'), h('b.world')]);
      assert.equal(vnode.sel, 'div');
      assert.equal(vnode.children[0].sel, 'span#hello');
      assert.equal(vnode.children[1].sel, 'b.world');
    });
    it('can create vnode with one child vnode', function() {
      var vnode = h('div', h('span#hello'));
      assert.equal(vnode.sel, 'div');
      assert.equal(vnode.children[0].sel, 'span#hello');
    });
    it('can create vnode with props and one child vnode', function() {
      var vnode = h('div', {}, h('span#hello'));
      assert.equal(vnode.sel, 'div');
      assert.equal(vnode.children[0].sel, 'span#hello');
    });
    it('can create vnode with text content', function() {
      var vnode = h('a', ['I am a string']);
      assert.equal(vnode.children[0].text, 'I am a string');
    });
    it('can create vnode with text content in string', function() {
      var vnode = h('a', 'I am a string');
      assert.equal(vnode.text, 'I am a string');
    });
    it('can create vnode with props and text content in string', function() {
      var vnode = h('a', {}, 'I am a string');
      assert.equal(vnode.text, 'I am a string');
    });
    it('can create vnode for comment', function() {
      var vnode = h('!', 'test');
      assert.equal(vnode.sel, '!');
      assert.equal(vnode.text, 'test');
    });
  });
  describe('created element', function() {
    it('has tag', function() {
      elm = patch(vnode0, h('div')).elm;
      assert.equal(elm.tagName, 'DIV');
    });
    it('has different tag and id', function() {
      var elm = document.createElement('div');
      vnode0.appendChild(elm);
      var vnode1 = h('span#id');
      elm = patch(elm, vnode1).elm;
      assert.equal(elm.tagName, 'SPAN');
      assert.equal(elm.id, 'id');
    });
    it('has id', function() {
      elm = patch(vnode0, h('div', [h('div#unique')])).elm;
      assert.equal(elm.firstChild.id, 'unique');
    });
    it('has correct namespace', function() {
      var SVGNamespace = 'http://www.w3.org/2000/svg';
      var XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

      elm = patch(vnode0, h('div', [h('div', {ns: SVGNamespace})])).elm;
      assert.equal(elm.firstChild.namespaceURI, SVGNamespace);

      // verify that svg tag automatically gets svg namespace
      elm = patch(vnode0, h('svg', [
        h('foreignObject', [
          h('div', ['I am HTML embedded in SVG'])
        ])
      ])).elm;
      assert.equal(elm.namespaceURI, SVGNamespace);
      assert.equal(elm.firstChild.namespaceURI, SVGNamespace);
      assert.equal(elm.firstChild.firstChild.namespaceURI, XHTMLNamespace);

      // verify that svg tag with extra selectors gets svg namespace
      elm = patch(vnode0, h('svg#some-id')).elm;
      assert.equal(elm.namespaceURI, SVGNamespace);

      // verify that non-svg tag beginning with 'svg' does NOT get namespace
      elm = patch(vnode0, h('svg-custom-el')).elm;
      assert.notEqual(elm.namespaceURI, SVGNamespace);
    });
    it('receives classes in selector', function() {
      elm = patch(vnode0, h('div', [h('i.am.a.class')])).elm;
      assert(elm.firstChild.classList.contains('am'));
      assert(elm.firstChild.classList.contains('a'));
      assert(elm.firstChild.classList.contains('class'));
    });
    it('receives classes in class property', function() {
      elm = patch(vnode0, h('i', {class: {am: true, a: true, class: true, not: false}})).elm;
      assert(elm.classList.contains('am'));
      assert(elm.classList.contains('a'));
      assert(elm.classList.contains('class'));
      assert(!elm.classList.contains('not'));
    });
    it('receives classes in selector when namespaced', function() {
      elm = patch(vnode0,
        h('svg', [
          h('g.am.a.class.too')
        ])
      ).elm;
      assert(elm.firstChild.classList.contains('am'));
      assert(elm.firstChild.classList.contains('a'));
      assert(elm.firstChild.classList.contains('class'));
    });
    it('receives classes in class property when namespaced', function() {
      elm = patch(vnode0,
        h('svg', [
          h('g', {class: {am: true, a: true, class: true, not: false, too: true}})
        ])
      ).elm;
      assert(elm.firstChild.classList.contains('am'));
      assert(elm.firstChild.classList.contains('a'));
      assert(elm.firstChild.classList.contains('class'));
      assert(!elm.firstChild.classList.contains('not'));
    });
    it('handles classes from both selector and property', function() {
      elm = patch(vnode0, h('div', [h('i.has', {class: {classes: true}})])).elm;
      assert(elm.firstChild.classList.contains('has'));
      assert(elm.firstChild.classList.contains('classes'));
    });
    it('can create elements with text content', function() {
      elm = patch(vnode0, h('div', ['I am a string'])).elm;
      assert.equal(elm.innerHTML, 'I am a string');
    });
    it('can create elements with span and text content', function() {
      elm = patch(vnode0, h('a', [h('span'), 'I am a string'])).elm;
      assert.equal(elm.childNodes[0].tagName, 'SPAN');
      assert.equal(elm.childNodes[1].textContent, 'I am a string');
    });
    it('can create elements with props', function() {
      elm = patch(vnode0, h('a', {props: {src: 'http://localhost/'}})).elm;
      assert.equal(elm.src, 'http://localhost/');
    });
    it('can create an element created inside an iframe', function(done) {
      // Only run if srcdoc is supported.
      var frame = document.createElement('iframe');
      if (typeof frame.srcdoc !== 'undefined') {
        frame.srcdoc = "<div>Thing 1</div>";
        frame.onload = function() {
          patch(frame.contentDocument.body.querySelector('div'), h('div', 'Thing 2'));
          assert.equal(frame.contentDocument.body.querySelector('div').textContent, 'Thing 2');
          frame.remove();
          done();
        };
        document.body.appendChild(frame);
      } else {
        done();
      }
    });
    it('is a patch of the root element', function () {
      var elmWithIdAndClass = document.createElement('div');
      elmWithIdAndClass.id = 'id';
      elmWithIdAndClass.className = 'class';
      var vnode1 = h('div#id.class', [h('span', 'Hi')]);
      elm = patch(elmWithIdAndClass, vnode1).elm;
      assert.strictEqual(elm, elmWithIdAndClass);
      assert.equal(elm.tagName, 'DIV');
      assert.equal(elm.id, 'id');
      assert.equal(elm.className, 'class');
    });
    it('can create comments', function() {
      elm = patch(vnode0, h('!', 'test')).elm;
      assert.equal(elm.nodeType, document.COMMENT_NODE);
      assert.equal(elm.textContent, 'test');
    });
  });
  describe('patching an element', function() {
    it('changes the elements classes', function() {
      var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
      var vnode2 = h('i', {class: {i: true, am: true, horse: false}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('changes classes in selector', function() {
      var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
      var vnode2 = h('i', {class: {i: true, am: true, horse: false}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('preserves memoized classes', function() {
      var cachedClass = {i: true, am: true, horse: false};
      var vnode1 = h('i', {class: cachedClass});
      var vnode2 = h('i', {class: cachedClass});
      elm = patch(vnode0, vnode1).elm;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
      elm = patch(vnode1, vnode2).elm;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('removes missing classes', function() {
      var vnode1 = h('i', {class: {i: true, am: true, horse: true}});
      var vnode2 = h('i', {class: {i: true, am: true}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('changes an elements props', function() {
      var vnode1 = h('a', {props: {src: 'http://other/'}});
      var vnode2 = h('a', {props: {src: 'http://localhost/'}});
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm;
      assert.equal(elm.src, 'http://localhost/');
    });
    it('preserves memoized props', function() {
      var cachedProps = {src: 'http://other/'};
      var vnode1 = h('a', {props: cachedProps});
      var vnode2 = h('a', {props: cachedProps});
      elm = patch(vnode0, vnode1).elm;
      assert.equal(elm.src, 'http://other/');
      elm = patch(vnode1, vnode2).elm;
      assert.equal(elm.src, 'http://other/');
    });
    it('removes an elements props', function() {
      var vnode1 = h('a', {props: {src: 'http://other/'}});
      var vnode2 = h('a');
      patch(vnode0, vnode1);
      patch(vnode1, vnode2);
      assert.equal(elm.src, undefined);
    });
    describe('using toVNode()', function () {
      it('can remove previous children of the root element', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', [h('span', 'Hi')]);
        elm = patch(toVNode(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.tagName, 'DIV');
        assert.equal(elm.id, 'id');
        assert.equal(elm.className, 'class');
        assert.strictEqual(elm.childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].tagName, 'SPAN');
        assert.strictEqual(elm.childNodes[0].textContent, 'Hi');
      });
      it('can remove some children of the root element', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        var text = new Text('Foobar');
        text.testProperty = function () {}; // ensures we dont recreate the Text Node
        prevElm.appendChild(text);
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', ['Foobar']);
        elm = patch(toVNode(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.tagName, 'DIV');
        assert.equal(elm.id, 'id');
        assert.equal(elm.className, 'class');
        assert.strictEqual(elm.childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].nodeType, 3);
        assert.strictEqual(elm.childNodes[0].wholeText, 'Foobar');
        assert.strictEqual(typeof elm.childNodes[0].testProperty, 'function');
      });
      it('can remove text elements', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.className = 'class';
        var text = new Text('Foobar');
        prevElm.appendChild(text);
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', [h('h2', 'Hello')]);
        elm = patch(toVNode(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.tagName, 'DIV');
        assert.equal(elm.id, 'id');
        assert.equal(elm.className, 'class');
        assert.strictEqual(elm.childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].nodeType, 1);
        assert.strictEqual(elm.childNodes[0].textContent, 'Hello');
      })
    });
    describe('updating children with keys', function() {
      function spanNum(n) {
        if (n == null) {
          return n;
        } else if (typeof n === 'string') {
          return h('span', {}, n);
        } else {
          return h('span', {key: n}, n.toString());
        }
      }
      describe('addition of elements', function() {
        it('appends elements', function() {
          var vnode1 = h('span', [1].map(spanNum));
          var vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 1);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '3');
        });
        it('prepends elements', function() {
          var vnode1 = h('span', [4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 2);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
        });
        it('add elements in the middle', function() {
          var vnode1 = h('span', [1, 2, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
        });
        it('add elements at begin and end', function() {
          var vnode1 = h('span', [2, 3, 4].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
        });
        it('adds children to parent with no children', function() {
          var vnode1 = h('span', {key: 'span'});
          var vnode2 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 0);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
        });
        it('removes all children from parent', function() {
          var vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
          var vnode2 = h('span', {key: 'span'});
          elm = patch(vnode0, vnode1).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 0);
        });
        it('update one child with same key but different sel', function() {
          var vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
          var vnode2 = h('span', {key: 'span'}, [spanNum(1), h('i', {key: 2}, '2'), spanNum(3)]);
          elm = patch(vnode0, vnode1).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[1].tagName, 'I');
        });
      });
      describe('removal of elements', function() {
        it('removes elements from the beginning', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['3', '4', '5']);
        });
        it('removes elements from the end', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '3');
        });
        it('removes elements from the middle', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 4);
          assert.deepEqual(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '4');
          assert.equal(elm.children[3].innerHTML, '5');
        });
      });
      describe('element reordering', function() {
        it('moves element forward', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [2, 3, 1, 4].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children[0].innerHTML, '2');
          assert.equal(elm.children[1].innerHTML, '3');
          assert.equal(elm.children[2].innerHTML, '1');
          assert.equal(elm.children[3].innerHTML, '4');
        });
        it('moves element to end', function() {
          var vnode1 = h('span', [1, 2, 3].map(spanNum));
          var vnode2 = h('span', [2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[0].innerHTML, '2');
          assert.equal(elm.children[1].innerHTML, '3');
          assert.equal(elm.children[2].innerHTML, '1');
        });
        it('moves element backwards', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [1, 4, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[1].innerHTML, '4');
          assert.equal(elm.children[2].innerHTML, '2');
          assert.equal(elm.children[3].innerHTML, '3');
        });
        it('swaps first and last', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [4, 2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children[0].innerHTML, '4');
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '3');
          assert.equal(elm.children[3].innerHTML, '1');
        });
      });
      describe('combinations of additions, removals and reorderings', function() {
        it('move to left and replace', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 1, 2, 3, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 5);
          assert.equal(elm.children[0].innerHTML, '4');
          assert.equal(elm.children[1].innerHTML, '1');
          assert.equal(elm.children[2].innerHTML, '2');
          assert.equal(elm.children[3].innerHTML, '3');
          assert.equal(elm.children[4].innerHTML, '6');
        });
        it('moves to left and leaves hole', function() {
          var vnode1 = h('span', [1, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), ['4', '6']);
        });
        it('handles moved and set to undefined element ending at the end', function() {
          var vnode1 = h('span', [2, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 5, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[0].innerHTML, '4');
          assert.equal(elm.children[1].innerHTML, '5');
          assert.equal(elm.children[2].innerHTML, '3');
        });
        it('moves a key in non-keyed nodes with a size up', function() {
          var vnode1 = h('span', [1, 'a', 'b', 'c'].map(spanNum));
          var vnode2 = h('span', ['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.equal(elm.textContent, '1abc');
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 6);
          assert.equal(elm.textContent, 'dabc1e');
        });
      });
      it('reverses elements', function() {
        var vnode1 = h('span', [1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
        var vnode2 = h('span', [8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.children.length, 8);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['8', '7', '6', '5', '4', '3', '2', '1']);
      });
      it('something', function() {
        var vnode1 = h('span', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('span', [4, 3, 2, 1, 5, 0].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.children.length, 6);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['4', '3', '2', '1', '5', '0']);
      });
      it('handles random shuffles', function() {
        var n, i, arr = [], opacities = [], elms = 14, samples = 5;
        function spanNumWithOpacity(n, o) {
          return h('span', {key: n, style: {opacity: o}}, n.toString());
        }
        for (n = 0; n < elms; ++n) { arr[n] = n; }
        for (n = 0; n < samples; ++n) {
          var vnode1 = h('span', arr.map(function(n) {
            return spanNumWithOpacity(n, '1');
          }));
          var shufArr = shuffle(arr.slice(0));
          var elm = document.createElement('div');
          elm = patch(elm, vnode1).elm;
          for (i = 0; i < elms; ++i) {
            assert.equal(elm.children[i].innerHTML, i.toString());
            opacities[i] = Math.random().toFixed(5).toString();
          }
          var vnode2 = h('span', arr.map(function(n) {
            return spanNumWithOpacity(shufArr[n], opacities[n]);
          }));
          elm = patch(vnode1, vnode2).elm;
          for (i = 0; i < elms; ++i) {
            assert.equal(elm.children[i].innerHTML, shufArr[i].toString());
            assert.equal(opacities[i].indexOf(elm.children[i].style.opacity), 0);
          }
        }
      });
      it('supports null/undefined children', function() {
        var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('i', [null, 2, undefined, null, 1, 0, null, 5, 4, null, 3, undefined].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.children.length, 6);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['2', '1', '0', '5', '4', '3']);
      });
      it('supports all null/undefined children', function() {
        var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('i', [null, null, undefined, null, null, undefined]);
        var vnode3 = h('i', [5, 4, 3, 2, 1, 0].map(spanNum));
        patch(vnode0, vnode1);
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.children.length, 0);
        elm = patch(vnode2, vnode3).elm;
        assert.deepEqual(map(inner, elm.children), ['5', '4', '3', '2', '1', '0']);
      });
      it('handles random shuffles with null/undefined children', function() {
        var i, j, r, len, arr, maxArrLen = 15, samples = 5, vnode1 = vnode0, vnode2;
        for (i = 0; i < samples; ++i, vnode1 = vnode2) {
          len = Math.floor(Math.random() * maxArrLen);
          arr = [];
          for (j = 0; j < len; ++j) {
            if ((r = Math.random()) < 0.5) arr[j] = String(j);
            else if (r < 0.75) arr[j] = null;
            else arr[j] = undefined;
          }
          shuffle(arr);
          vnode2 = h('div', arr.map(spanNum));
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.children), arr.filter(function(x) {return x != null;}));
        }
      });
    });
    describe('updating children without keys', function() {
      it('appends elements', function() {
        var vnode1 = h('div', [h('span', 'Hello')]);
        var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.children), ['Hello']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
      });
      it('handles unmoved text nodes', function() {
        var vnode1 = h('div', ['Text', h('span', 'Span')]);
        var vnode2 = h('div', ['Text', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
      });
      it('handles changing text children', function() {
        var vnode1 = h('div', ['Text', h('span', 'Span')]);
        var vnode2 = h('div', ['Text2', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text2');
      });
      it('handles unmoved comment nodes', function() {
        var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
      });
      it('handles changing comment text', function() {
        var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Text2'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text2');
      });
      it('handles changing empty comment', function() {
        var vnode1 = h('div', [h('!'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Test'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, '');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Test');
      });
      it('prepends element', function() {
        var vnode1 = h('div', [h('span', 'World')]);
        var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.children), ['World']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
      });
      it('prepends element of different tag type', function() {
        var vnode1 = h('div', [h('span', 'World')]);
        var vnode2 = h('div', [h('div', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.children), ['World']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(prop('tagName'), elm.children), ['DIV', 'SPAN']);
        assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
      });
      it('removes elements', function() {
        var vnode1 = h('div', [h('span', 'One'), h('span', 'Two'), h('span', 'Three')]);
        var vnode2 = h('div', [h('span', 'One'), h('span', 'Three')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['One', 'Three']);
      });
      it('removes a single text node', function() {
        var vnode1 = h('div', 'One');
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        assert.equal(elm.textContent, 'One');
        patch(vnode1, vnode2);
        assert.equal(elm.textContent, '');
      });
      it('removes a single text node when children are updated', function() {
        var vnode1 = h('div', 'One');
        var vnode2 = h('div', [ h('div', 'Two'), h('span', 'Three') ]);
        patch(vnode0, vnode1);
        assert.equal(elm.textContent, 'One');
        patch(vnode1, vnode2);
        assert.deepEqual(map(prop('textContent'), elm.childNodes), ['Two', 'Three']);
      });
      it('removes a text node among other elements', function() {
        var vnode1 = h('div', [ 'One', h('span', 'Two') ]);
        var vnode2 = h('div', [ h('div', 'Three')]);
        patch(vnode0, vnode1);
        assert.deepEqual(map(prop('textContent'), elm.childNodes), ['One', 'Two']);
        patch(vnode1, vnode2);
        assert.equal(elm.childNodes.length, 1);
        assert.equal(elm.childNodes[0].tagName, 'DIV');
        assert.equal(elm.childNodes[0].textContent, 'Three');
      });
      it('reorders elements', function() {
        var vnode1 = h('div', [h('span', 'One'), h('div', 'Two'), h('b', 'Three')]);
        var vnode2 = h('div', [h('b', 'Three'), h('span', 'One'), h('div', 'Two')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(prop('tagName'), elm.children), ['B', 'SPAN', 'DIV']);
        assert.deepEqual(map(inner, elm.children), ['Three', 'One', 'Two']);
      });
      it('supports null/undefined children', function() {
        var vnode1 = h('i', [null, h('i', '1'), h('i', '2'), null]);
        var vnode2 = h('i', [h('i', '2'), undefined, undefined, h('i', '1'), undefined]);
        var vnode3 = h('i', [null, h('i', '1'), undefined, null, h('i', '2'), undefined, null]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.children), ['1', '2']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.children), ['2', '1']);
        elm = patch(vnode2, vnode3).elm;
        assert.deepEqual(map(inner, elm.children), ['1', '2']);
      });
      it('supports all null/undefined children', function() {
        var vnode1 = h('i', [h('i', '1'), h('i', '2')]);
        var vnode2 = h('i', [null, undefined]);
        var vnode3 = h('i', [h('i', '2'), h('i', '1')]);
        patch(vnode0, vnode1);
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.children.length, 0);
        elm = patch(vnode2, vnode3).elm;
        assert.deepEqual(map(inner, elm.children), ['2', '1']);
      });
    });
  });
  describe('hooks', function() {
    describe('element hooks', function() {
      it('calls `create` listener before inserted into parent but after children', function() {
        var result = [];
        function cb(empty, vnode) {
          assert(vnode.elm instanceof Element);
          assert.equal(vnode.elm.children.length, 2);
          assert.strictEqual(vnode.elm.parentNode, null);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {create: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can\'t touch me'),
        ]);
        patch(vnode0, vnode1);
        assert.equal(1, result.length);
      });
      it('calls `insert` listener after both parents, siblings and children have been inserted', function() {
        var result = [];
        function cb(vnode) {
          assert(vnode.elm instanceof Element);
          assert.equal(vnode.elm.children.length, 2);
          assert.equal(vnode.elm.parentNode.children.length, 3);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {insert: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can touch me'),
        ]);
        patch(vnode0, vnode1);
        assert.equal(1, result.length);
      });
      it('calls `prepatch` listener', function() {
        var result = [];
        function cb(oldVnode, vnode) {
          assert.strictEqual(oldVnode, vnode1.children[1]);
          assert.strictEqual(vnode, vnode2.children[1]);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result.length, 1);
      });
      it('calls `postpatch` after `prepatch` listener', function() {
        var pre = [], post = [];
        function preCb(oldVnode, vnode) {
          pre.push(pre);
        }
        function postCb(oldVnode, vnode) {
          assert.equal(pre.length, post.length + 1);
          post.push(post);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(pre.length, 1);
        assert.equal(post.length, 1);
      });
      it('calls `update` listener', function() {
        var result1 = [];
        var result2 = [];
        function cb(result, oldVnode, vnode) {
          if (result.length > 0) {
            console.log(result[result.length-1]);
            console.log(oldVnode);
            assert.strictEqual(result[result.length-1], oldVnode);
          }
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {update: cb.bind(null, result1)}}, [
            h('span', 'Child 1'),
            h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {update: cb.bind(null, result1)}}, [
            h('span', 'Child 1'),
            h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result1.length, 1);
        assert.equal(result2.length, 1);
      });
      it('calls `remove` listener', function() {
        var result = [];
        function cb(vnode, rm) {
          var parent = vnode.elm.parentNode;
          assert(vnode.elm instanceof Element);
          assert.equal(vnode.elm.children.length, 2);
          assert.equal(parent.children.length, 2);
          result.push(vnode);
          rm();
          assert.equal(parent.children.length, 1);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {remove: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(1, result.length);
      });
      it('calls `init` and `prepatch` listeners on root', function() {
          var count = 0;
          function init(vnode) {
            assert.strictEqual(vnode, vnode2);
            count += 1;
          }
          function prepatch(oldVnode, vnode) {
            assert.strictEqual(vnode, vnode1);
            count += 1;
          }
          var vnode1 = h('div', {hook: {init: init, prepatch: prepatch}});
          patch(vnode0, vnode1);
          assert.equal(1, count);
          var vnode2 = h('span', {hook: {init: init, prepatch: prepatch}});
          patch(vnode1, vnode2);
          assert.equal(2, count);
      });
      it('removes element when all remove listeners are done', function() {
        var rm1, rm2, rm3;
        var patch = snabbdom.init([
          {remove: function(_, rm) { rm1 = rm; }},
          {remove: function(_, rm) { rm2 = rm; }},
        ]);
        var vnode1 = h('div', [h('a', {hook: {remove: function(_, rm) { rm3 = rm; }}})]);
        var vnode2 = h('div', []);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.children.length, 1);
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.children.length, 1);
        rm1();
        assert.equal(elm.children.length, 1);
        rm3();
        assert.equal(elm.children.length, 1);
        rm2();
        assert.equal(elm.children.length, 0);
      });
      it('invokes remove hook on replaced root', function() {
        var result = [];
        var parent = document.createElement('div');
        var vnode0 = document.createElement('div');
        parent.appendChild(vnode0);
        function cb(vnode, rm) {
          result.push(vnode);
          rm();
        }
        var vnode1 = h('div', {hook: {remove: cb}}, [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        var vnode2 = h('span', [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(1, result.length);
      });
    });
    describe('module hooks', function() {
      it('invokes `pre` and `post` hook', function() {
        var result = [];
        var patch = snabbdom.init([
          {pre: function() { result.push('pre'); }},
          {post: function() { result.push('post'); }},
        ]);
        var vnode1 = h('div');
        patch(vnode0, vnode1);
        assert.deepEqual(result, ['pre', 'post']);
      });
      it('invokes global `destroy` hook for all removed children', function() {
        var result = [];
        function cb(vnode) { result.push(vnode); }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', {hook: {destroy: cb}}, 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result.length, 1);
      });
      it('handles text vnodes with `undefined` `data` property', function() {
        var vnode1 = h('div', [
          ' '
        ]);
        var vnode2 = h('div', []);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
      });
      it('invokes `destroy` module hook for all removed children', function() {
        var created = 0;
        var destroyed = 0;
        var patch = snabbdom.init([
          {create: function() { created++; }},
          {destroy: function() { destroyed++; }},
        ]);
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 4);
        assert.equal(destroyed, 4);
      });
      it('does not invoke `create` and `remove` module hook for text nodes', function() {
        var created = 0;
        var removed = 0;
        var patch = snabbdom.init([
          {create: function() { created++; }},
          {remove: function() { removed++; }},
        ]);
        var vnode1 = h('div', [
          h('span', 'First child'),
          '',
          h('span', 'Third child'),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 2);
        assert.equal(removed, 2);
      });
      it('does not invoke `destroy` module hook for text nodes', function() {
        var created = 0;
        var destroyed = 0;
        var patch = snabbdom.init([
          {create: function() { created++; }},
          {destroy: function() { destroyed++; }},
        ]);
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', 'Child 1'),
            h('span', ['Text 1', 'Text 2']),
          ]),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 4);
        assert.equal(destroyed, 4);
      });
    });
  });
  describe('short circuiting', function() {
    it('does not update strictly equal vnodes', function() {
      var result = [];
      function cb(vnode) { result.push(vnode); }
      var vnode1 = h('div', [
        h('span', {hook: {update: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      patch(vnode0, vnode1);
      patch(vnode1, vnode1);
      assert.equal(result.length, 0);
    });
    it('does not update strictly equal children', function() {
      var result = [];
      function cb(vnode) { result.push(vnode); }
      var vnode1 = h('div', [
        h('span', {hook: {patch: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      var vnode2 = h('div');
      vnode2.children = vnode1.children;
      patch(vnode0, vnode1);
      patch(vnode1, vnode2);
      assert.equal(result.length, 0);
    });
  });
});

},{"../h":1,"../modules/class":6,"../modules/eventlisteners":8,"../modules/props":9,"../snabbdom":18,"../tovnode":29,"assert":11,"knuth-shuffle":14}],22:[function(require,module,exports){
var assert = require('assert');
var fakeRaf = require('fake-raf');

var snabbdom = require('../snabbdom');
fakeRaf.use();
var patch = snabbdom.init([
  require('../modules/dataset').default,
]);
var h = require('../h').default;

describe('dataset', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('is set on initial element creation', function() {
    elm = patch(vnode0, h('div', {dataset: {foo: 'foo'}})).elm;
    assert.equal(elm.dataset.foo, 'foo');
  });
  it('updates dataset', function() {
    var vnode1 = h('i', {dataset: {foo: 'foo', bar: 'bar'}});
    var vnode2 = h('i', {dataset: {baz: 'baz'}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.dataset.foo, 'foo');
    assert.equal(elm.dataset.bar, 'bar');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.dataset.baz, 'baz');
    assert.equal(elm.dataset.foo, undefined);
  });
  it('can be memoized', function() {
    var cachedDataset = {foo: 'foo', bar: 'bar'};
    var vnode1 = h('i', {dataset: cachedDataset});
    var vnode2 = h('i', {dataset: cachedDataset});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.dataset.foo, 'foo');
    assert.equal(elm.dataset.bar, 'bar');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.dataset.foo, 'foo');
    assert.equal(elm.dataset.bar, 'bar');
  });
  it('handles string conversions', function() {
    var vnode1 = h('i', {dataset: {empty: '', dash: '-', dashed:'foo-bar', camel: 'fooBar', integer:0, float:0.1}});
    elm = patch(vnode0, vnode1).elm;

    assert.equal(elm.dataset.empty, '');
    assert.equal(elm.dataset.dash, '-');
    assert.equal(elm.dataset.dashed, 'foo-bar');
    assert.equal(elm.dataset.camel, 'fooBar');
    assert.equal(elm.dataset.integer, '0');
    assert.equal(elm.dataset.float, '0.1');
  });

});

fakeRaf.restore();

},{"../h":1,"../modules/dataset":7,"../snabbdom":18,"assert":11,"fake-raf":12}],23:[function(require,module,exports){
var assert = require('assert');

var snabbdom = require('../snabbdom');
var patch = snabbdom.init([
  require('../modules/eventlisteners.js').default,
]);
var h = require('../h').default;

describe('event listeners', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('attaches click event handler to element', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode = h('div', {on: {click: clicked}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode).elm;
    elm.click();
    assert.equal(1, result.length);
  });
  it('does not attach new listener', function() {
    var result = [];
    //function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: function(ev) { result.push(1); }}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode2 = h('div', {on: {click: function(ev) { result.push(2); }}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    assert.deepEqual(result, [1, 2]);
  });
  it('does calls handler for function in array', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode = h('div', {on: {click: [clicked, 1]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode).elm;
    elm.click();
    assert.deepEqual(result, [1]);
  });
  it('handles changed value in array', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: [clicked, 1]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode2 = h('div', {on: {click: [clicked, 2]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode3 = h('div', {on: {click: [clicked, 3]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    elm = patch(vnode2, vnode3).elm;
    elm.click();
    assert.deepEqual(result, [1, 2, 3]);
  });
  it('handles changed several values in array', function() {
    var result = [];
    function clicked() { result.push([].slice.call(arguments, 0, arguments.length-2)); }
    var vnode1 = h('div', {on: {click: [clicked, 1, 2, 3]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode2 = h('div', {on: {click: [clicked, 1, 2]}}, [
      h('a', 'Click my parent'),
    ]);
    var vnode3 = h('div', {on: {click: [clicked, 2, 3]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    elm = patch(vnode2, vnode3).elm;
    elm.click();
    assert.deepEqual(result, [[1, 2, 3], [1, 2], [2, 3]]);
  });
  it('detach attached click event handler to element', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: clicked}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    assert.equal(1, result.length);
    var vnode2 = h('div', {on: {}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    assert.equal(1, result.length);
  });
  it('multiple event handlers for same event on same element', function() {
    var result = [];
    function clicked(ev) { result.push(ev); }
    var vnode1 = h('div', {on: {click: [[clicked], [clicked], [clicked]]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    assert.equal(3, result.length);
    var vnode2 = h('div', {on: {click: [[clicked], [clicked]]}}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode1, vnode2).elm;
    elm.click();
    assert.equal(5, result.length);
  });
  it('access to virtual node in event handler', function() {
    var result = [];
    function clicked(ev, vnode) { result.push(this); result.push(vnode); }
    var vnode1 = h('div', {on: {click: clicked }}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    assert.equal(2, result.length);
    assert.equal(vnode1, result[0]);
    assert.equal(vnode1, result[1]);
  }),
  it('access to virtual node in event handler with argument', function() {
    var result = [];
    function clicked(arg, ev, vnode) { result.push(this); result.push(vnode); }
    var vnode1 = h('div', {on: {click: [clicked, 1] }}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    assert.equal(2, result.length);
    assert.equal(vnode1, result[0]);
    assert.equal(vnode1, result[1]);
  }),
  it('access to virtual node in event handler with arguments', function() {
    var result = [];
    function clicked(arg1, arg2, ev, vnode) { result.push(this); result.push(vnode); }
    var vnode1 = h('div', {on: {click: [clicked, 1, "2"] }}, [
      h('a', 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    assert.equal(2, result.length);
    assert.equal(vnode1, result[0]);
    assert.equal(vnode1, result[1]);
  });
  it('shared handlers in parent and child nodes', function() {
    var result = [];
    var sharedHandlers = {
      click: function(ev) { result.push(ev); }
    };
    var vnode1 = h('div', {on: sharedHandlers}, [
      h('a', {on: sharedHandlers}, 'Click my parent'),
    ]);
    elm = patch(vnode0, vnode1).elm;
    elm.click();
    assert.equal(1, result.length);
    elm.firstChild.click();
    assert.equal(3, result.length);
  });
});

},{"../h":1,"../modules/eventlisteners.js":8,"../snabbdom":18,"assert":11}],24:[function(require,module,exports){
var assert = require('assert');

var snabbdom = require('../snabbdom');
var h = require('../h').default;
var patch = snabbdom.init([
  require('../modules/attributes').default
]);

describe('svg', function () {
 var elm, vnode0;
 beforeEach(function() {
   elm = document.createElement('svg');
   vnode0 = elm;
 });

 it('removes child svg elements', function(){
   var a = h('svg', {}, [
    h('g'),
    h('g')
   ]);
   var b = h('svg', {}, [
    h('g')
   ]);
   var result = patch(patch(vnode0, a), b).elm;
   assert.equal(result.childNodes.length, 1); 
 });

 it('adds correctly xlink namespaced attribute', function(){
   var xlinkNS = 'http://www.w3.org/1999/xlink';
   var testUrl = '/test';
   var a = h('svg', {}, [
     h('use', {
       attrs: { 'xlink:href': testUrl }
     }, [])
   ]);

   var result = patch(vnode0, a).elm;
   assert.equal(result.childNodes.length, 1);
   assert.equal(result.childNodes[0].getAttribute('xlink:href'), testUrl); 
   assert.equal(result.childNodes[0].getAttributeNS(xlinkNS,'href'), testUrl);

 });

 it('adds correctly xml namespaced attribute', function(){
   var xmlNS = 'http://www.w3.org/XML/1998/namespace';
   var testAttrValue = 'und';
   var a = h('svg', { attrs: { 'xml:lang': testAttrValue } }, []);

   var result = patch(vnode0, a).elm;
   assert.equal(result.getAttributeNS(xmlNS, 'lang'), testAttrValue);
   assert.equal(result.getAttribute('xml:lang'), testAttrValue); 
 });
})
},{"../h":1,"../modules/attributes":5,"../snabbdom":18,"assert":11}],25:[function(require,module,exports){
require('./core');
require('./style');
require('./dataset');
require('./eventlisteners');
require('./attachto');
require('./thunk');
require('./attributes');
require('./htmldomapi')
},{"./attachto":19,"./attributes":20,"./core":21,"./dataset":22,"./eventlisteners":23,"./htmldomapi":24,"./style":26,"./thunk":27}],26:[function(require,module,exports){
var assert = require('assert');
var fakeRaf = require('fake-raf');

var snabbdom = require('../snabbdom');
fakeRaf.use();
var patch = snabbdom.init([
  require('../modules/style').default,
]);
var h = require('../h').default;
var toVNode = require('../tovnode').default;

describe('style', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  it('is being styled', function() {
    elm = patch(vnode0, h('div', {style: {fontSize: '12px'}})).elm;
    assert.equal(elm.style.fontSize, '12px');
  });
  it('can be memoized', function() {
    var cachedStyles = {fontSize: '14px', display: 'inline'};
    var vnode1 = h('i', {style: cachedStyles});
    var vnode2 = h('i', {style: cachedStyles});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    assert.equal(elm.style.display, 'inline');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.style.fontSize, '14px');
    assert.equal(elm.style.display, 'inline');
  });
  it('updates styles', function() {
    var vnode1 = h('i', {style: {fontSize: '14px', display: 'inline'}});
    var vnode2 = h('i', {style: {fontSize: '12px', display: 'block'}});
    var vnode3 = h('i', {style: {fontSize: '10px', display: 'block'}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    assert.equal(elm.style.display, 'inline');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.style.fontSize, '12px');
    assert.equal(elm.style.display, 'block');
    elm = patch(vnode2, vnode3).elm;
    assert.equal(elm.style.fontSize, '10px');
    assert.equal(elm.style.display, 'block');
  });
  it('explicialy removes styles', function() {
    var vnode1 = h('i', {style: {fontSize: '14px'}});
    var vnode2 = h('i', {style: {fontSize: ''}});
    var vnode3 = h('i', {style: {fontSize: '10px'}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    patch(vnode1, vnode2);
    assert.equal(elm.style.fontSize, '');
    patch(vnode2, vnode3);
    assert.equal(elm.style.fontSize, '10px');
  });
  it('implicially removes styles from element', function() {
    var vnode1 = h('div', [h('i', {style: {fontSize: '14px'}})]);
    var vnode2 = h('div', [h('i')]);
    var vnode3 = h('div', [h('i', {style: {fontSize: '10px'}})]);
    patch(vnode0, vnode1);
    assert.equal(elm.firstChild.style.fontSize, '14px');
    patch(vnode1, vnode2);
    assert.equal(elm.firstChild.style.fontSize, '');
    patch(vnode2, vnode3);
    assert.equal(elm.firstChild.style.fontSize, '10px');
  });
  it('updates css variables', function() {
    var vnode1 = h('div', {style: {'--myVar': 1}});
    var vnode2 = h('div', {style: {'--myVar': 2}});
    var vnode3 = h('div', {style: {'--myVar': 3}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.getPropertyValue('--myVar'), 1);
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.style.getPropertyValue('--myVar'), 2);
    elm = patch(vnode2, vnode3).elm;
    assert.equal(elm.style.getPropertyValue('--myVar'), 3);
  });
  it('explicialy removes css variables', function() {
    var vnode1 = h('i', {style: {'--myVar': 1}});
    var vnode2 = h('i', {style: {'--myVar': ''}});
    var vnode3 = h('i', {style: {'--myVar': 2}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.getPropertyValue('--myVar'), 1);
    patch(vnode1, vnode2);
    assert.equal(elm.style.getPropertyValue('--myVar'), '');
    patch(vnode2, vnode3);
    assert.equal(elm.style.getPropertyValue('--myVar'), 2);
  });
  it('implicially removes css variables from element', function() {
    var vnode1 = h('div', [h('i', {style: {'--myVar': 1}})]);
    var vnode2 = h('div', [h('i')]);
    var vnode3 = h('div', [h('i', {style: {'--myVar': 2}})]);
    patch(vnode0, vnode1);
    assert.equal(elm.firstChild.style.getPropertyValue('--myVar'), 1);
    patch(vnode1, vnode2);
    assert.equal(elm.firstChild.style.getPropertyValue('--myVar'), '');
    patch(vnode2, vnode3);
    assert.equal(elm.firstChild.style.getPropertyValue('--myVar'), 2);
  });
  it('updates delayed styles in next frame', function() {
    var patch = snabbdom.init([
      require('../modules/style').default,
    ]);
    var vnode1 = h('i', {style: {fontSize: '14px', delayed: {fontSize: '16px'}}});
    var vnode2 = h('i', {style: {fontSize: '18px', delayed: {fontSize: '20px'}}});
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.style.fontSize, '14px');
    fakeRaf.step();
    fakeRaf.step();
    assert.equal(elm.style.fontSize, '16px');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.style.fontSize, '18px');
    fakeRaf.step();
    fakeRaf.step();
    assert.equal(elm.style.fontSize, '20px');
  });
  describe('using toVNode()', function () {
    it('handles (ignoring) comment nodes', function() {
      var comment = document.createComment('yolo');
      var prevElm = document.createElement('div');
      prevElm.appendChild(comment);
      var nextVNode = h('div', [h('span', 'Hi')]);
      elm = patch(toVNode(prevElm), nextVNode).elm;
      assert.strictEqual(elm, prevElm);
      assert.equal(elm.tagName, 'DIV');
      assert.strictEqual(elm.childNodes.length, 1);
      assert.strictEqual(elm.childNodes[0].tagName, 'SPAN');
      assert.strictEqual(elm.childNodes[0].textContent, 'Hi');
    });
  });
});

fakeRaf.restore();

},{"../h":1,"../modules/style":10,"../snabbdom":18,"../tovnode":29,"assert":11,"fake-raf":12}],27:[function(require,module,exports){
var assert = require('assert');

var snabbdom = require('../snabbdom');
var patch = snabbdom.init([
]);
var h = require('../h').default;
var thunk = require('../thunk').default;

describe('thunk', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = vnode0 = document.createElement('div');
  });
  it('returns vnode with data and render function', function() {
    function numberInSpan(n) {
      return h('span', 'Number is ' + n);
    }
    var vnode = thunk('span', 'num', numberInSpan, [22]);
    assert.deepEqual(vnode.sel, 'span');
    assert.deepEqual(vnode.data.key, 'num');
    assert.deepEqual(vnode.data.args, [22]);
  });
  it('calls render function once on data change', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    var vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    var vnode2 = h('div', [
      thunk('span', 'num', numberInSpan, [2])
    ]);
    patch(vnode0, vnode1);
    assert.equal(called, 1);
    patch(vnode1, vnode2);
    assert.equal(called, 2);
  });
  it('does not call render function on data unchanged', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    var vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    var vnode2 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    patch(vnode0, vnode1);
    assert.equal(called, 1);
    patch(vnode1, vnode2);
    assert.equal(called, 1);
  });
  it('calls render function once on data-length change', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    var vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    var vnode2 = h('div', [
      thunk('span', 'num', numberInSpan, [1, 2])
    ]);
    patch(vnode0, vnode1);
    assert.equal(called, 1);
    patch(vnode1, vnode2);
    assert.equal(called, 2);
  });
  it('calls render function once on function change', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    function numberInSpan2(n) {
      called++;
      return h('span', {key: 'num'}, 'Number really is ' + n);
    }
    var vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    var vnode2 = h('div', [
      thunk('span', 'num', numberInSpan2, [1])
    ]);
    patch(vnode0, vnode1);
    assert.equal(called, 1);
    patch(vnode1, vnode2);
    assert.equal(called, 2);
  });
  it('renders correctly', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    var vnode1 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    var vnode2 = h('div', [
      thunk('span', 'num', numberInSpan, [1])
    ]);
    var vnode3 = h('div', [
      thunk('span', 'num', numberInSpan, [2])
    ]);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');
    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');
    elm = patch(vnode2, vnode3).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 2');
    assert.equal(called, 2);
  });
  it('supports leaving out the `key` argument', function() {
    function vnodeFn(s) {
      return h('span.number', 'Hello ' + s);
    }
    var vnode1 = thunk('span.number', vnodeFn, ['World!']);
    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.innerText, 'Hello World!');
  });
  it('renders correctly when root', function() {
    var called = 0;
    function numberInSpan(n) {
      called++;
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    var vnode1 = thunk('span', 'num', numberInSpan, [1]);
    var vnode2 = thunk('span', 'num', numberInSpan, [1]);
    var vnode3 = thunk('span', 'num', numberInSpan, [2]);

    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 1');

    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 1');

    elm = patch(vnode2, vnode3).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 2');
    assert.equal(called, 2);
  });
  it('can be replaced and removed', function() {
    function numberInSpan(n) {
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    function oddEven(n) {
      var prefix = (n % 2) === 0 ? 'Even' : 'Odd';
      return h('div', {key: oddEven}, prefix + ': ' + n);
    }
    var vnode1 = h('div', [thunk('span', 'num', numberInSpan, [1])]);
    var vnode2 = h('div', [thunk('div', 'oddEven', oddEven, [4])]);

    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'span');
    assert.equal(elm.firstChild.innerHTML, 'Number is 1');

    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.firstChild.tagName.toLowerCase(), 'div');
    assert.equal(elm.firstChild.innerHTML, 'Even: 4');
  });
  it('can be replaced and removed when root', function() {
    function numberInSpan(n) {
      return h('span', {key: 'num'}, 'Number is ' + n);
    }
    function oddEven(n) {
      var prefix = (n % 2) === 0 ? 'Even' : 'Odd';
      return h('div', {key: oddEven}, prefix + ': ' + n);
    }
    var vnode1 = thunk('span', 'num', numberInSpan, [1]);
    var vnode2 = thunk('div', 'oddEven', oddEven, [4]);

    elm = patch(vnode0, vnode1).elm;
    assert.equal(elm.tagName.toLowerCase(), 'span');
    assert.equal(elm.innerHTML, 'Number is 1');

    elm = patch(vnode1, vnode2).elm;
    assert.equal(elm.tagName.toLowerCase(), 'div');
    assert.equal(elm.innerHTML, 'Even: 4');
  });
  it('invokes destroy hook on thunks', function() {
    var called = 0;
    function destroyHook() {
      called++;
    }
    function numberInSpan(n) {
      return h('span', {key: 'num', hook: {destroy: destroyHook}}, 'Number is ' + n);
    }
    var vnode1 = h('div', [
      h('div', 'Foo'),
      thunk('span', 'num', numberInSpan, [1]),
      h('div', 'Foo')
    ]);
    var vnode2 = h('div', [
      h('div', 'Foo'),
      h('div', 'Foo')
    ]);
    patch(vnode0, vnode1);
    patch(vnode1, vnode2);
    assert.equal(called, 1);
  });
  it('invokes remove hook on thunks', function() {
    var called = 0;
    function hook() {
      called++;
    }
    function numberInSpan(n) {
      return h('span', {key: 'num', hook: {remove: hook}}, 'Number is ' + n);
    }
    var vnode1 = h('div', [
      h('div', 'Foo'),
      thunk('span', 'num', numberInSpan, [1]),
      h('div', 'Foo')
    ]);
    var vnode2 = h('div', [
      h('div', 'Foo'),
      h('div', 'Foo')
    ]);
    patch(vnode0, vnode1);
    patch(vnode1, vnode2);
    assert.equal(called, 1);
  });
});

},{"../h":1,"../snabbdom":18,"../thunk":28,"assert":11}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = require("./h");
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var i, old = oldVnode.data, cur = thunk.data;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
exports.thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
};
exports.default = exports.thunk;

},{"./h":1}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var htmldomapi_1 = require("./htmldomapi");
function toVNode(node, domApi) {
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    var text;
    if (api.isElement(node)) {
        var id = node.id ? '#' + node.id : '';
        var cn = node.getAttribute('class');
        var c = cn ? '.' + cn.split(' ').join('.') : '';
        var sel = api.tagName(node).toLowerCase() + id + c;
        var attrs = {};
        var children = [];
        var name_1;
        var i = void 0, n = void 0;
        var elmAttrs = node.attributes;
        var elmChildren = node.childNodes;
        for (i = 0, n = elmAttrs.length; i < n; i++) {
            name_1 = elmAttrs[i].nodeName;
            if (name_1 !== 'id' && name_1 !== 'class') {
                attrs[name_1] = elmAttrs[i].nodeValue;
            }
        }
        for (i = 0, n = elmChildren.length; i < n; i++) {
            children.push(toVNode(elmChildren[i]));
        }
        return vnode_1.default(sel, { attrs: attrs }, children, undefined, node);
    }
    else if (api.isText(node)) {
        text = api.getTextContent(node);
        return vnode_1.default(undefined, undefined, undefined, text, node);
    }
    else if (api.isComment(node)) {
        text = api.getTextContent(node);
        return vnode_1.default('!', {}, [], text, node);
    }
    else {
        return vnode_1.default('', {}, [], undefined, undefined);
    }
}
exports.toVNode = toVNode;
exports.default = toVNode;

},{"./htmldomapi":3,"./vnode":30}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;

},{}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8ucmVnaXN0cnkubnBtanMub3JnL2Jyb3dzZXItcGFjay82LjAuMi9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaC5qcyIsImhlbHBlcnMvYXR0YWNodG8uanMiLCJodG1sZG9tYXBpLmpzIiwiaXMuanMiLCJtb2R1bGVzL2F0dHJpYnV0ZXMuanMiLCJtb2R1bGVzL2NsYXNzLmpzIiwibW9kdWxlcy9kYXRhc2V0LmpzIiwibW9kdWxlcy9ldmVudGxpc3RlbmVycy5qcyIsIm1vZHVsZXMvcHJvcHMuanMiLCJtb2R1bGVzL3N0eWxlLmpzIiwibm9kZV9tb2R1bGVzLy5yZWdpc3RyeS5ucG1qcy5vcmcvYXNzZXJ0LzEuNC4xL25vZGVfbW9kdWxlcy9hc3NlcnQvYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzLy5yZWdpc3RyeS5ucG1qcy5vcmcvZmFrZS1yYWYvMC4wLjEvbm9kZV9tb2R1bGVzL2Zha2UtcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzLy5yZWdpc3RyeS5ucG1qcy5vcmcvaW5oZXJpdHMvMi4wLjEvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXNcXC5yZWdpc3RyeS5ucG1qcy5vcmdcXGtudXRoLXNodWZmbGVcXDEuMC4xXFxub2RlX21vZHVsZXNcXGtudXRoLXNodWZmbGVcXG5vZGVfbW9kdWxlc1xca251dGgtc2h1ZmZsZVxcaW5kZXguanMiLCJub2RlX21vZHVsZXMvLnJlZ2lzdHJ5Lm5wbWpzLm9yZy9wcm9jZXNzLzAuMTEuMTAvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy8ucmVnaXN0cnkubnBtanMub3JnL3V0aWwvMC4xMC4zL25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzXFwucmVnaXN0cnkubnBtanMub3JnXFx1dGlsXFwwLjEwLjNcXG5vZGVfbW9kdWxlc1xcdXRpbFxcbm9kZV9tb2R1bGVzXFwucmVnaXN0cnkubnBtanMub3JnXFxhc3NlcnRcXDEuNC4xXFxub2RlX21vZHVsZXNcXHV0aWxcXHV0aWwuanMiLCJzbmFiYmRvbS5qcyIsInRlc3QvYXR0YWNodG8uanMiLCJ0ZXN0L2F0dHJpYnV0ZXMuanMiLCJ0ZXN0L2NvcmUuanMiLCJ0ZXN0L2RhdGFzZXQuanMiLCJ0ZXN0L2V2ZW50bGlzdGVuZXJzLmpzIiwidGVzdC9odG1sZG9tYXBpLmpzIiwidGVzdC9pbmRleC5qcyIsInRlc3Qvc3R5bGUuanMiLCJ0ZXN0L3RodW5rLmpzIiwidGh1bmsuanMiLCJ0b3Zub2RlLmpzIiwidm5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BpQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdm5vZGVfMSA9IHJlcXVpcmUoXCIuL3Zub2RlXCIpO1xyXG52YXIgaXMgPSByZXF1aXJlKFwiLi9pc1wiKTtcclxuZnVuY3Rpb24gYWRkTlMoZGF0YSwgY2hpbGRyZW4sIHNlbCkge1xyXG4gICAgZGF0YS5ucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XHJcbiAgICBpZiAoc2VsICE9PSAnZm9yZWlnbk9iamVjdCcgJiYgY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkRGF0YSA9IGNoaWxkcmVuW2ldLmRhdGE7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZERhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYWRkTlMoY2hpbGREYXRhLCBjaGlsZHJlbltpXS5jaGlsZHJlbiwgY2hpbGRyZW5baV0uc2VsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBoKHNlbCwgYiwgYykge1xyXG4gICAgdmFyIGRhdGEgPSB7fSwgY2hpbGRyZW4sIHRleHQsIGk7XHJcbiAgICBpZiAoYyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZGF0YSA9IGI7XHJcbiAgICAgICAgaWYgKGlzLmFycmF5KGMpKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gYztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXMucHJpbWl0aXZlKGMpKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjICYmIGMuc2VsKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gW2NdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChpcy5hcnJheShiKSkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IGI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzLnByaW1pdGl2ZShiKSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gYjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYiAmJiBiLnNlbCkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IFtiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpcy5hcnJheShjaGlsZHJlbikpIHtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKGlzLnByaW1pdGl2ZShjaGlsZHJlbltpXSkpXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpXSA9IHZub2RlXzEudm5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzZWxbMF0gPT09ICdzJyAmJiBzZWxbMV0gPT09ICd2JyAmJiBzZWxbMl0gPT09ICdnJyAmJlxyXG4gICAgICAgIChzZWwubGVuZ3RoID09PSAzIHx8IHNlbFszXSA9PT0gJy4nIHx8IHNlbFszXSA9PT0gJyMnKSkge1xyXG4gICAgICAgIGFkZE5TKGRhdGEsIGNoaWxkcmVuLCBzZWwpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZub2RlXzEudm5vZGUoc2VsLCBkYXRhLCBjaGlsZHJlbiwgdGV4dCwgdW5kZWZpbmVkKTtcclxufVxyXG5leHBvcnRzLmggPSBoO1xyXG47XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGg7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gcHJlKHZub2RlLCBuZXdWbm9kZSkge1xyXG4gICAgdmFyIGF0dGFjaERhdGEgPSB2bm9kZS5kYXRhLmF0dGFjaERhdGE7XHJcbiAgICAvLyBDb3B5IGNyZWF0ZWQgcGxhY2Vob2xkZXIgYW5kIHJlYWwgZWxlbWVudCBmcm9tIG9sZCB2bm9kZVxyXG4gICAgbmV3Vm5vZGUuZGF0YS5hdHRhY2hEYXRhLnBsYWNlaG9sZGVyID0gYXR0YWNoRGF0YS5wbGFjZWhvbGRlcjtcclxuICAgIG5ld1Zub2RlLmRhdGEuYXR0YWNoRGF0YS5yZWFsID0gYXR0YWNoRGF0YS5yZWFsO1xyXG4gICAgLy8gTW91bnQgcmVhbCBlbGVtZW50IGluIHZub2RlIHNvIHRoZSBwYXRjaCBwcm9jZXNzIG9wZXJhdGVzIG9uIGl0XHJcbiAgICB2bm9kZS5lbG0gPSB2bm9kZS5kYXRhLmF0dGFjaERhdGEucmVhbDtcclxufVxyXG5mdW5jdGlvbiBwb3N0KF8sIHZub2RlKSB7XHJcbiAgICAvLyBNb3VudCBkdW1teSBwbGFjZWhvbGRlciBpbiB2bm9kZSBzbyBwb3RlbnRpYWwgcmVvcmRlcnMgdXNlIGl0XHJcbiAgICB2bm9kZS5lbG0gPSB2bm9kZS5kYXRhLmF0dGFjaERhdGEucGxhY2Vob2xkZXI7XHJcbn1cclxuZnVuY3Rpb24gZGVzdHJveSh2bm9kZSkge1xyXG4gICAgLy8gUmVtb3ZlIHBsYWNlaG9sZGVyXHJcbiAgICBpZiAodm5vZGUuZWxtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB2bm9kZS5lbG0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2bm9kZS5lbG0pO1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIHJlYWwgZWxlbWVudCBmcm9tIHdoZXJlIGl0IHdhcyBpbnNlcnRlZFxyXG4gICAgdm5vZGUuZWxtID0gdm5vZGUuZGF0YS5hdHRhY2hEYXRhLnJlYWw7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlKF8sIHZub2RlKSB7XHJcbiAgICB2YXIgcmVhbCA9IHZub2RlLmVsbSwgYXR0YWNoRGF0YSA9IHZub2RlLmRhdGEuYXR0YWNoRGF0YTtcclxuICAgIHZhciBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIC8vIFJlcGxhY2UgYWN0dWFsIGVsZW1lbnQgd2l0aCBkdW1teSBwbGFjZWhvbGRlclxyXG4gICAgLy8gU25hYmJkb20gd2lsbCB0aGVuIGluc2VydCBwbGFjZWhvbGRlciBpbnN0ZWFkXHJcbiAgICB2bm9kZS5lbG0gPSBwbGFjZWhvbGRlcjtcclxuICAgIGF0dGFjaERhdGEudGFyZ2V0LmFwcGVuZENoaWxkKHJlYWwpO1xyXG4gICAgYXR0YWNoRGF0YS5yZWFsID0gcmVhbDtcclxuICAgIGF0dGFjaERhdGEucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcclxufVxyXG5mdW5jdGlvbiBhdHRhY2hUbyh0YXJnZXQsIHZub2RlKSB7XHJcbiAgICBpZiAodm5vZGUuZGF0YSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHZub2RlLmRhdGEgPSB7fTtcclxuICAgIGlmICh2bm9kZS5kYXRhLmhvb2sgPT09IHVuZGVmaW5lZClcclxuICAgICAgICB2bm9kZS5kYXRhLmhvb2sgPSB7fTtcclxuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcclxuICAgIHZhciBob29rID0gdm5vZGUuZGF0YS5ob29rO1xyXG4gICAgZGF0YS5hdHRhY2hEYXRhID0geyB0YXJnZXQ6IHRhcmdldCwgcGxhY2Vob2xkZXI6IHVuZGVmaW5lZCwgcmVhbDogdW5kZWZpbmVkIH07XHJcbiAgICBob29rLmNyZWF0ZSA9IGNyZWF0ZTtcclxuICAgIGhvb2sucHJlcGF0Y2ggPSBwcmU7XHJcbiAgICBob29rLnBvc3RwYXRjaCA9IHBvc3Q7XHJcbiAgICBob29rLmRlc3Ryb3kgPSBkZXN0cm95O1xyXG4gICAgcmV0dXJuIHZub2RlO1xyXG59XHJcbmV4cG9ydHMuYXR0YWNoVG8gPSBhdHRhY2hUbztcclxuO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBhdHRhY2hUbztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXR0YWNodG8uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSk7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlVGV4dE5vZGUodGV4dCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbW1lbnQodGV4dCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQodGV4dCk7XHJcbn1cclxuZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHBhcmVudE5vZGUsIG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpIHtcclxuICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpO1xyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZUNoaWxkKG5vZGUsIGNoaWxkKSB7XHJcbiAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkKTtcclxufVxyXG5mdW5jdGlvbiBhcHBlbmRDaGlsZChub2RlLCBjaGlsZCkge1xyXG4gICAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbn1cclxuZnVuY3Rpb24gcGFyZW50Tm9kZShub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZS5wYXJlbnROb2RlO1xyXG59XHJcbmZ1bmN0aW9uIG5leHRTaWJsaW5nKG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlLm5leHRTaWJsaW5nO1xyXG59XHJcbmZ1bmN0aW9uIHRhZ05hbWUoZWxtKSB7XHJcbiAgICByZXR1cm4gZWxtLnRhZ05hbWU7XHJcbn1cclxuZnVuY3Rpb24gc2V0VGV4dENvbnRlbnQobm9kZSwgdGV4dCkge1xyXG4gICAgbm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0VGV4dENvbnRlbnQobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUudGV4dENvbnRlbnQ7XHJcbn1cclxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAxO1xyXG59XHJcbmZ1bmN0aW9uIGlzVGV4dChub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gMztcclxufVxyXG5mdW5jdGlvbiBpc0NvbW1lbnQobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDg7XHJcbn1cclxuZXhwb3J0cy5odG1sRG9tQXBpID0ge1xyXG4gICAgY3JlYXRlRWxlbWVudDogY3JlYXRlRWxlbWVudCxcclxuICAgIGNyZWF0ZUVsZW1lbnROUzogY3JlYXRlRWxlbWVudE5TLFxyXG4gICAgY3JlYXRlVGV4dE5vZGU6IGNyZWF0ZVRleHROb2RlLFxyXG4gICAgY3JlYXRlQ29tbWVudDogY3JlYXRlQ29tbWVudCxcclxuICAgIGluc2VydEJlZm9yZTogaW5zZXJ0QmVmb3JlLFxyXG4gICAgcmVtb3ZlQ2hpbGQ6IHJlbW92ZUNoaWxkLFxyXG4gICAgYXBwZW5kQ2hpbGQ6IGFwcGVuZENoaWxkLFxyXG4gICAgcGFyZW50Tm9kZTogcGFyZW50Tm9kZSxcclxuICAgIG5leHRTaWJsaW5nOiBuZXh0U2libGluZyxcclxuICAgIHRhZ05hbWU6IHRhZ05hbWUsXHJcbiAgICBzZXRUZXh0Q29udGVudDogc2V0VGV4dENvbnRlbnQsXHJcbiAgICBnZXRUZXh0Q29udGVudDogZ2V0VGV4dENvbnRlbnQsXHJcbiAgICBpc0VsZW1lbnQ6IGlzRWxlbWVudCxcclxuICAgIGlzVGV4dDogaXNUZXh0LFxyXG4gICAgaXNDb21tZW50OiBpc0NvbW1lbnQsXHJcbn07XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuaHRtbERvbUFwaTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHRtbGRvbWFwaS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmFycmF5ID0gQXJyYXkuaXNBcnJheTtcclxuZnVuY3Rpb24gcHJpbWl0aXZlKHMpIHtcclxuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHMgPT09ICdudW1iZXInO1xyXG59XHJcbmV4cG9ydHMucHJpbWl0aXZlID0gcHJpbWl0aXZlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgYm9vbGVhbkF0dHJzID0gW1wiYWxsb3dmdWxsc2NyZWVuXCIsIFwiYXN5bmNcIiwgXCJhdXRvZm9jdXNcIiwgXCJhdXRvcGxheVwiLCBcImNoZWNrZWRcIiwgXCJjb21wYWN0XCIsIFwiY29udHJvbHNcIiwgXCJkZWNsYXJlXCIsXHJcbiAgICBcImRlZmF1bHRcIiwgXCJkZWZhdWx0Y2hlY2tlZFwiLCBcImRlZmF1bHRtdXRlZFwiLCBcImRlZmF1bHRzZWxlY3RlZFwiLCBcImRlZmVyXCIsIFwiZGlzYWJsZWRcIixcclxuICAgIFwiZW5hYmxlZFwiLCBcImZvcm1ub3ZhbGlkYXRlXCIsIFwiaGlkZGVuXCIsIFwiaW5kZXRlcm1pbmF0ZVwiLCBcImluZXJ0XCIsIFwiaXNtYXBcIiwgXCJpdGVtc2NvcGVcIiwgXCJsb29wXCIsIFwibXVsdGlwbGVcIixcclxuICAgIFwibXV0ZWRcIiwgXCJub2hyZWZcIiwgXCJub3Jlc2l6ZVwiLCBcIm5vc2hhZGVcIiwgXCJub3ZhbGlkYXRlXCIsIFwibm93cmFwXCIsIFwib3BlblwiLCBcInBhdXNlb25leGl0XCIsIFwicmVhZG9ubHlcIixcclxuICAgIFwicmVxdWlyZWRcIiwgXCJyZXZlcnNlZFwiLCBcInNjb3BlZFwiLCBcInNlYW1sZXNzXCIsIFwic2VsZWN0ZWRcIiwgXCJzb3J0YWJsZVwiLCBcInNwZWxsY2hlY2tcIiwgXCJ0cmFuc2xhdGVcIixcclxuICAgIFwidHJ1ZXNwZWVkXCIsIFwidHlwZW11c3RtYXRjaFwiLCBcInZpc2libGVcIixcclxuICAgIC8vIEFNUCBhdHRyaWJ1dGVzXHJcbiAgICBcIuKaoVwiLCBcImFtcFwiLCBcImFtcC1ib2lsZXJwbGF0ZVwiXTtcclxudmFyIHhsaW5rTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XHJcbnZhciB4bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnO1xyXG52YXIgY29sb25DaGFyID0gNTg7XHJcbnZhciB4Q2hhciA9IDEyMDtcclxudmFyIGJvb2xlYW5BdHRyc0RpY3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG5mb3IgKHZhciBpID0gMCwgbGVuID0gYm9vbGVhbkF0dHJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICBib29sZWFuQXR0cnNEaWN0W2Jvb2xlYW5BdHRyc1tpXV0gPSB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUF0dHJzKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gICAgdmFyIGtleSwgZWxtID0gdm5vZGUuZWxtLCBvbGRBdHRycyA9IG9sZFZub2RlLmRhdGEuYXR0cnMsIGF0dHJzID0gdm5vZGUuZGF0YS5hdHRycztcclxuICAgIGlmICghb2xkQXR0cnMgJiYgIWF0dHJzKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGlmIChvbGRBdHRycyA9PT0gYXR0cnMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgb2xkQXR0cnMgPSBvbGRBdHRycyB8fCB7fTtcclxuICAgIGF0dHJzID0gYXR0cnMgfHwge307XHJcbiAgICAvLyB1cGRhdGUgbW9kaWZpZWQgYXR0cmlidXRlcywgYWRkIG5ldyBhdHRyaWJ1dGVzXHJcbiAgICBmb3IgKGtleSBpbiBhdHRycykge1xyXG4gICAgICAgIHZhciBjdXIgPSBhdHRyc1trZXldO1xyXG4gICAgICAgIHZhciBvbGQgPSBvbGRBdHRyc1trZXldO1xyXG4gICAgICAgIGlmIChvbGQgIT09IGN1cikge1xyXG4gICAgICAgICAgICBpZiAoYm9vbGVhbkF0dHJzRGljdFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLnNldEF0dHJpYnV0ZShrZXksIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5jaGFyQ29kZUF0KDApICE9PSB4Q2hhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoa2V5LCBjdXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoa2V5LmNoYXJDb2RlQXQoMykgPT09IGNvbG9uQ2hhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFzc3VtZSB4bWwgbmFtZXNwYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLnNldEF0dHJpYnV0ZU5TKHhtbE5TLCBrZXksIGN1cik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChrZXkuY2hhckNvZGVBdCg1KSA9PT0gY29sb25DaGFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzdW1lIHhsaW5rIG5hbWVzcGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIGN1cik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uc2V0QXR0cmlidXRlKGtleSwgY3VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHJlbW92ZSByZW1vdmVkIGF0dHJpYnV0ZXNcclxuICAgIC8vIHVzZSBgaW5gIG9wZXJhdG9yIHNpbmNlIHRoZSBwcmV2aW91cyBgZm9yYCBpdGVyYXRpb24gdXNlcyBpdCAoLmkuZS4gYWRkIGV2ZW4gYXR0cmlidXRlcyB3aXRoIHVuZGVmaW5lZCB2YWx1ZSlcclxuICAgIC8vIHRoZSBvdGhlciBvcHRpb24gaXMgdG8gcmVtb3ZlIGFsbCBhdHRyaWJ1dGVzIHdpdGggdmFsdWUgPT0gdW5kZWZpbmVkXHJcbiAgICBmb3IgKGtleSBpbiBvbGRBdHRycykge1xyXG4gICAgICAgIGlmICghKGtleSBpbiBhdHRycykpIHtcclxuICAgICAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLmF0dHJpYnV0ZXNNb2R1bGUgPSB7IGNyZWF0ZTogdXBkYXRlQXR0cnMsIHVwZGF0ZTogdXBkYXRlQXR0cnMgfTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5hdHRyaWJ1dGVzTW9kdWxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdHRyaWJ1dGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIHVwZGF0ZUNsYXNzKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gICAgdmFyIGN1ciwgbmFtZSwgZWxtID0gdm5vZGUuZWxtLCBvbGRDbGFzcyA9IG9sZFZub2RlLmRhdGEuY2xhc3MsIGtsYXNzID0gdm5vZGUuZGF0YS5jbGFzcztcclxuICAgIGlmICghb2xkQ2xhc3MgJiYgIWtsYXNzKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGlmIChvbGRDbGFzcyA9PT0ga2xhc3MpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgb2xkQ2xhc3MgPSBvbGRDbGFzcyB8fCB7fTtcclxuICAgIGtsYXNzID0ga2xhc3MgfHwge307XHJcbiAgICBmb3IgKG5hbWUgaW4gb2xkQ2xhc3MpIHtcclxuICAgICAgICBpZiAoIWtsYXNzW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGVsbS5jbGFzc0xpc3QucmVtb3ZlKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobmFtZSBpbiBrbGFzcykge1xyXG4gICAgICAgIGN1ciA9IGtsYXNzW25hbWVdO1xyXG4gICAgICAgIGlmIChjdXIgIT09IG9sZENsYXNzW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGVsbS5jbGFzc0xpc3RbY3VyID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuY2xhc3NNb2R1bGUgPSB7IGNyZWF0ZTogdXBkYXRlQ2xhc3MsIHVwZGF0ZTogdXBkYXRlQ2xhc3MgfTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5jbGFzc01vZHVsZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xhc3MuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIENBUFNfUkVHRVggPSAvW0EtWl0vZztcclxuZnVuY3Rpb24gdXBkYXRlRGF0YXNldChvbGRWbm9kZSwgdm5vZGUpIHtcclxuICAgIHZhciBlbG0gPSB2bm9kZS5lbG0sIG9sZERhdGFzZXQgPSBvbGRWbm9kZS5kYXRhLmRhdGFzZXQsIGRhdGFzZXQgPSB2bm9kZS5kYXRhLmRhdGFzZXQsIGtleTtcclxuICAgIGlmICghb2xkRGF0YXNldCAmJiAhZGF0YXNldClcclxuICAgICAgICByZXR1cm47XHJcbiAgICBpZiAob2xkRGF0YXNldCA9PT0gZGF0YXNldClcclxuICAgICAgICByZXR1cm47XHJcbiAgICBvbGREYXRhc2V0ID0gb2xkRGF0YXNldCB8fCB7fTtcclxuICAgIGRhdGFzZXQgPSBkYXRhc2V0IHx8IHt9O1xyXG4gICAgdmFyIGQgPSBlbG0uZGF0YXNldDtcclxuICAgIGZvciAoa2V5IGluIG9sZERhdGFzZXQpIHtcclxuICAgICAgICBpZiAoIWRhdGFzZXRba2V5XSkge1xyXG4gICAgICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGRba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleS5yZXBsYWNlKENBUFNfUkVHRVgsICctJCYnKS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAoa2V5IGluIGRhdGFzZXQpIHtcclxuICAgICAgICBpZiAob2xkRGF0YXNldFtrZXldICE9PSBkYXRhc2V0W2tleV0pIHtcclxuICAgICAgICAgICAgaWYgKGQpIHtcclxuICAgICAgICAgICAgICAgIGRba2V5XSA9IGRhdGFzZXRba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleS5yZXBsYWNlKENBUFNfUkVHRVgsICctJCYnKS50b0xvd2VyQ2FzZSgpLCBkYXRhc2V0W2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGF0YXNldE1vZHVsZSA9IHsgY3JlYXRlOiB1cGRhdGVEYXRhc2V0LCB1cGRhdGU6IHVwZGF0ZURhdGFzZXQgfTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5kYXRhc2V0TW9kdWxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhc2V0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGludm9rZUhhbmRsZXIoaGFuZGxlciwgdm5vZGUsIGV2ZW50KSB7XHJcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIC8vIGNhbGwgZnVuY3Rpb24gaGFuZGxlclxyXG4gICAgICAgIGhhbmRsZXIuY2FsbCh2bm9kZSwgZXZlbnQsIHZub2RlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBoYW5kbGVyID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgLy8gY2FsbCBoYW5kbGVyIHdpdGggYXJndW1lbnRzXHJcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyWzBdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgYXJndW1lbnQgZm9yIHBlcmZvcm1hbmNlXHJcbiAgICAgICAgICAgIGlmIChoYW5kbGVyLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlclswXS5jYWxsKHZub2RlLCBoYW5kbGVyWzFdLCBldmVudCwgdm5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBoYW5kbGVyLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh2bm9kZSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyWzBdLmFwcGx5KHZub2RlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY2FsbCBtdWx0aXBsZSBoYW5kbGVyc1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGludm9rZUhhbmRsZXIoaGFuZGxlcltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaGFuZGxlRXZlbnQoZXZlbnQsIHZub2RlKSB7XHJcbiAgICB2YXIgbmFtZSA9IGV2ZW50LnR5cGUsIG9uID0gdm5vZGUuZGF0YS5vbjtcclxuICAgIC8vIGNhbGwgZXZlbnQgaGFuZGxlcihzKSBpZiBleGlzdHNcclxuICAgIGlmIChvbiAmJiBvbltuYW1lXSkge1xyXG4gICAgICAgIGludm9rZUhhbmRsZXIob25bbmFtZV0sIHZub2RlLCBldmVudCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlTGlzdGVuZXIoKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIGhhbmRsZUV2ZW50KGV2ZW50LCBoYW5kbGVyLnZub2RlKTtcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRXZlbnRMaXN0ZW5lcnMob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgICB2YXIgb2xkT24gPSBvbGRWbm9kZS5kYXRhLm9uLCBvbGRMaXN0ZW5lciA9IG9sZFZub2RlLmxpc3RlbmVyLCBvbGRFbG0gPSBvbGRWbm9kZS5lbG0sIG9uID0gdm5vZGUgJiYgdm5vZGUuZGF0YS5vbiwgZWxtID0gKHZub2RlICYmIHZub2RlLmVsbSksIG5hbWU7XHJcbiAgICAvLyBvcHRpbWl6YXRpb24gZm9yIHJldXNlZCBpbW11dGFibGUgaGFuZGxlcnNcclxuICAgIGlmIChvbGRPbiA9PT0gb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyByZW1vdmUgZXhpc3RpbmcgbGlzdGVuZXJzIHdoaWNoIG5vIGxvbmdlciB1c2VkXHJcbiAgICBpZiAob2xkT24gJiYgb2xkTGlzdGVuZXIpIHtcclxuICAgICAgICAvLyBpZiBlbGVtZW50IGNoYW5nZWQgb3IgZGVsZXRlZCB3ZSByZW1vdmUgYWxsIGV4aXN0aW5nIGxpc3RlbmVycyB1bmNvbmRpdGlvbmFsbHlcclxuICAgICAgICBpZiAoIW9uKSB7XHJcbiAgICAgICAgICAgIGZvciAobmFtZSBpbiBvbGRPbikge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyIGlmIGVsZW1lbnQgd2FzIGNoYW5nZWQgb3IgZXhpc3RpbmcgbGlzdGVuZXJzIHJlbW92ZWRcclxuICAgICAgICAgICAgICAgIG9sZEVsbS5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIG9sZExpc3RlbmVyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobmFtZSBpbiBvbGRPbikge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyIGlmIGV4aXN0aW5nIGxpc3RlbmVyIHJlbW92ZWRcclxuICAgICAgICAgICAgICAgIGlmICghb25bbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRFbG0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBvbGRMaXN0ZW5lciwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gYWRkIG5ldyBsaXN0ZW5lcnMgd2hpY2ggaGFzIG5vdCBhbHJlYWR5IGF0dGFjaGVkXHJcbiAgICBpZiAob24pIHtcclxuICAgICAgICAvLyByZXVzZSBleGlzdGluZyBsaXN0ZW5lciBvciBjcmVhdGUgbmV3XHJcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gdm5vZGUubGlzdGVuZXIgPSBvbGRWbm9kZS5saXN0ZW5lciB8fCBjcmVhdGVMaXN0ZW5lcigpO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB2bm9kZSBmb3IgbGlzdGVuZXJcclxuICAgICAgICBsaXN0ZW5lci52bm9kZSA9IHZub2RlO1xyXG4gICAgICAgIC8vIGlmIGVsZW1lbnQgY2hhbmdlZCBvciBhZGRlZCB3ZSBhZGQgYWxsIG5lZWRlZCBsaXN0ZW5lcnMgdW5jb25kaXRpb25hbGx5XHJcbiAgICAgICAgaWYgKCFvbGRPbikge1xyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIGFkZCBsaXN0ZW5lciBpZiBlbGVtZW50IHdhcyBjaGFuZ2VkIG9yIG5ldyBsaXN0ZW5lcnMgYWRkZWRcclxuICAgICAgICAgICAgICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobmFtZSBpbiBvbikge1xyXG4gICAgICAgICAgICAgICAgLy8gYWRkIGxpc3RlbmVyIGlmIG5ldyBsaXN0ZW5lciBhZGRlZFxyXG4gICAgICAgICAgICAgICAgaWYgKCFvbGRPbltuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5ldmVudExpc3RlbmVyc01vZHVsZSA9IHtcclxuICAgIGNyZWF0ZTogdXBkYXRlRXZlbnRMaXN0ZW5lcnMsXHJcbiAgICB1cGRhdGU6IHVwZGF0ZUV2ZW50TGlzdGVuZXJzLFxyXG4gICAgZGVzdHJveTogdXBkYXRlRXZlbnRMaXN0ZW5lcnNcclxufTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5ldmVudExpc3RlbmVyc01vZHVsZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXZlbnRsaXN0ZW5lcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gdXBkYXRlUHJvcHMob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgICB2YXIga2V5LCBjdXIsIG9sZCwgZWxtID0gdm5vZGUuZWxtLCBvbGRQcm9wcyA9IG9sZFZub2RlLmRhdGEucHJvcHMsIHByb3BzID0gdm5vZGUuZGF0YS5wcm9wcztcclxuICAgIGlmICghb2xkUHJvcHMgJiYgIXByb3BzKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGlmIChvbGRQcm9wcyA9PT0gcHJvcHMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgb2xkUHJvcHMgPSBvbGRQcm9wcyB8fCB7fTtcclxuICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICBmb3IgKGtleSBpbiBvbGRQcm9wcykge1xyXG4gICAgICAgIGlmICghcHJvcHNba2V5XSkge1xyXG4gICAgICAgICAgICBkZWxldGUgZWxtW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChrZXkgaW4gcHJvcHMpIHtcclxuICAgICAgICBjdXIgPSBwcm9wc1trZXldO1xyXG4gICAgICAgIG9sZCA9IG9sZFByb3BzW2tleV07XHJcbiAgICAgICAgaWYgKG9sZCAhPT0gY3VyICYmIChrZXkgIT09ICd2YWx1ZScgfHwgZWxtW2tleV0gIT09IGN1cikpIHtcclxuICAgICAgICAgICAgZWxtW2tleV0gPSBjdXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucHJvcHNNb2R1bGUgPSB7IGNyZWF0ZTogdXBkYXRlUHJvcHMsIHVwZGF0ZTogdXBkYXRlUHJvcHMgfTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5wcm9wc01vZHVsZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJvcHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHJhZiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB8fCBzZXRUaW1lb3V0O1xyXG52YXIgbmV4dEZyYW1lID0gZnVuY3Rpb24gKGZuKSB7IHJhZihmdW5jdGlvbiAoKSB7IHJhZihmbik7IH0pOyB9O1xyXG5mdW5jdGlvbiBzZXROZXh0RnJhbWUob2JqLCBwcm9wLCB2YWwpIHtcclxuICAgIG5leHRGcmFtZShmdW5jdGlvbiAoKSB7IG9ialtwcm9wXSA9IHZhbDsgfSk7XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlU3R5bGUob2xkVm5vZGUsIHZub2RlKSB7XHJcbiAgICB2YXIgY3VyLCBuYW1lLCBlbG0gPSB2bm9kZS5lbG0sIG9sZFN0eWxlID0gb2xkVm5vZGUuZGF0YS5zdHlsZSwgc3R5bGUgPSB2bm9kZS5kYXRhLnN0eWxlO1xyXG4gICAgaWYgKCFvbGRTdHlsZSAmJiAhc3R5bGUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgaWYgKG9sZFN0eWxlID09PSBzdHlsZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBvbGRTdHlsZSA9IG9sZFN0eWxlIHx8IHt9O1xyXG4gICAgc3R5bGUgPSBzdHlsZSB8fCB7fTtcclxuICAgIHZhciBvbGRIYXNEZWwgPSAnZGVsYXllZCcgaW4gb2xkU3R5bGU7XHJcbiAgICBmb3IgKG5hbWUgaW4gb2xkU3R5bGUpIHtcclxuICAgICAgICBpZiAoIXN0eWxlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lWzBdID09PSAnLScgJiYgbmFtZVsxXSA9PT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0uc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0uc3R5bGVbbmFtZV0gPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobmFtZSBpbiBzdHlsZSkge1xyXG4gICAgICAgIGN1ciA9IHN0eWxlW25hbWVdO1xyXG4gICAgICAgIGlmIChuYW1lID09PSAnZGVsYXllZCcgJiYgc3R5bGUuZGVsYXllZCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lMiBpbiBzdHlsZS5kZWxheWVkKSB7XHJcbiAgICAgICAgICAgICAgICBjdXIgPSBzdHlsZS5kZWxheWVkW25hbWUyXTtcclxuICAgICAgICAgICAgICAgIGlmICghb2xkSGFzRGVsIHx8IGN1ciAhPT0gb2xkU3R5bGUuZGVsYXllZFtuYW1lMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXROZXh0RnJhbWUoZWxtLnN0eWxlLCBuYW1lMiwgY3VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChuYW1lICE9PSAncmVtb3ZlJyAmJiBjdXIgIT09IG9sZFN0eWxlW25hbWVdKSB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lWzBdID09PSAnLScgJiYgbmFtZVsxXSA9PT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0uc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgY3VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbS5zdHlsZVtuYW1lXSA9IGN1cjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhcHBseURlc3Ryb3lTdHlsZSh2bm9kZSkge1xyXG4gICAgdmFyIHN0eWxlLCBuYW1lLCBlbG0gPSB2bm9kZS5lbG0sIHMgPSB2bm9kZS5kYXRhLnN0eWxlO1xyXG4gICAgaWYgKCFzIHx8ICEoc3R5bGUgPSBzLmRlc3Ryb3kpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGZvciAobmFtZSBpbiBzdHlsZSkge1xyXG4gICAgICAgIGVsbS5zdHlsZVtuYW1lXSA9IHN0eWxlW25hbWVdO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGFwcGx5UmVtb3ZlU3R5bGUodm5vZGUsIHJtKSB7XHJcbiAgICB2YXIgcyA9IHZub2RlLmRhdGEuc3R5bGU7XHJcbiAgICBpZiAoIXMgfHwgIXMucmVtb3ZlKSB7XHJcbiAgICAgICAgcm0oKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgbmFtZSwgZWxtID0gdm5vZGUuZWxtLCBpID0gMCwgY29tcFN0eWxlLCBzdHlsZSA9IHMucmVtb3ZlLCBhbW91bnQgPSAwLCBhcHBsaWVkID0gW107XHJcbiAgICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcclxuICAgICAgICBhcHBsaWVkLnB1c2gobmFtZSk7XHJcbiAgICAgICAgZWxtLnN0eWxlW25hbWVdID0gc3R5bGVbbmFtZV07XHJcbiAgICB9XHJcbiAgICBjb21wU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsbSk7XHJcbiAgICB2YXIgcHJvcHMgPSBjb21wU3R5bGVbJ3RyYW5zaXRpb24tcHJvcGVydHknXS5zcGxpdCgnLCAnKTtcclxuICAgIGZvciAoOyBpIDwgcHJvcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBpZiAoYXBwbGllZC5pbmRleE9mKHByb3BzW2ldKSAhPT0gLTEpXHJcbiAgICAgICAgICAgIGFtb3VudCsrO1xyXG4gICAgfVxyXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICBpZiAoZXYudGFyZ2V0ID09PSBlbG0pXHJcbiAgICAgICAgICAgIC0tYW1vdW50O1xyXG4gICAgICAgIGlmIChhbW91bnQgPT09IDApXHJcbiAgICAgICAgICAgIHJtKCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLnN0eWxlTW9kdWxlID0ge1xyXG4gICAgY3JlYXRlOiB1cGRhdGVTdHlsZSxcclxuICAgIHVwZGF0ZTogdXBkYXRlU3R5bGUsXHJcbiAgICBkZXN0cm95OiBhcHBseURlc3Ryb3lTdHlsZSxcclxuICAgIHJlbW92ZTogYXBwbHlSZW1vdmVTdHlsZVxyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLnN0eWxlTW9kdWxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHlsZS5qcy5tYXAiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNvbXBhcmUgYW5kIGlzQnVmZmVyIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvYmxvYi82ODBlOWU1ZTQ4OGYyMmFhYzI3NTk5YTU3ZGM4NDRhNjMxNTkyOGRkL2luZGV4LmpzXG4vLyBvcmlnaW5hbCBub3RpY2U6XG5cbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIHggPSBhLmxlbmd0aDtcbiAgdmFyIHkgPSBiLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXTtcbiAgICAgIHkgPSBiW2ldO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmICh5IDwgeCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICBpZiAoZ2xvYmFsLkJ1ZmZlciAmJiB0eXBlb2YgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKGIpO1xuICB9XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpO1xufVxuXG4vLyBiYXNlZCBvbiBub2RlIGFzc2VydCwgb3JpZ2luYWwgbm90aWNlOlxuXG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZ1bmN0aW9uc0hhdmVOYW1lcyA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb28oKSB7fS5uYW1lID09PSAnZm9vJztcbn0oKSk7XG5mdW5jdGlvbiBwVG9TdHJpbmcgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG59XG5mdW5jdGlvbiBpc1ZpZXcoYXJyYnVmKSB7XG4gIGlmIChpc0J1ZmZlcihhcnJidWYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsLkFycmF5QnVmZmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyhhcnJidWYpO1xuICB9XG4gIGlmICghYXJyYnVmKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChhcnJidWYgaW5zdGFuY2VvZiBEYXRhVmlldykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChhcnJidWYuYnVmZmVyICYmIGFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbnZhciByZWdleCA9IC9cXHMqZnVuY3Rpb25cXHMrKFteXFwoXFxzXSopXFxzKi87XG4vLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2Z1bmN0aW9uLnByb3RvdHlwZS5uYW1lL2Jsb2IvYWRlZWVlYzhiZmNjNjA2OGIxODdkN2Q5ZmIzZDViYjFkM2EzMDg5OS9pbXBsZW1lbnRhdGlvbi5qc1xuZnVuY3Rpb24gZ2V0TmFtZShmdW5jKSB7XG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMpIHtcbiAgICByZXR1cm4gZnVuYy5uYW1lO1xuICB9XG4gIHZhciBzdHIgPSBmdW5jLnRvU3RyaW5nKCk7XG4gIHZhciBtYXRjaCA9IHN0ci5tYXRjaChyZWdleCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXTtcbn1cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBnZXROYW1lKHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc3BlY3Qoc29tZXRoaW5nKSB7XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgfHwgIXV0aWwuaXNGdW5jdGlvbihzb21ldGhpbmcpKSB7XG4gICAgcmV0dXJuIHV0aWwuaW5zcGVjdChzb21ldGhpbmcpO1xuICB9XG4gIHZhciByYXduYW1lID0gZ2V0TmFtZShzb21ldGhpbmcpO1xuICB2YXIgbmFtZSA9IHJhd25hbWUgPyAnOiAnICsgcmF3bmFtZSA6ICcnO1xuICByZXR1cm4gJ1tGdW5jdGlvbicgKyAgbmFtZSArICddJztcbn1cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuZXhwZWN0ZWQpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIGRlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBTdHJpY3RFcXVhbCcsIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAmJiBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gY29tcGFyZShhY3R1YWwsIGV4cGVjdGVkKSA9PT0gMDtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoKGFjdHVhbCA9PT0gbnVsbCB8fCB0eXBlb2YgYWN0dWFsICE9PSAnb2JqZWN0JykgJiZcbiAgICAgICAgICAgICAoZXhwZWN0ZWQgPT09IG51bGwgfHwgdHlwZW9mIGV4cGVjdGVkICE9PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gc3RyaWN0ID8gYWN0dWFsID09PSBleHBlY3RlZCA6IGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyBJZiBib3RoIHZhbHVlcyBhcmUgaW5zdGFuY2VzIG9mIHR5cGVkIGFycmF5cywgd3JhcCB0aGVpciB1bmRlcmx5aW5nXG4gIC8vIEFycmF5QnVmZmVycyBpbiBhIEJ1ZmZlciBlYWNoIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlXG4gIC8vIFRoaXMgb3B0aW1pemF0aW9uIHJlcXVpcmVzIHRoZSBhcnJheXMgdG8gaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGNoZWNrZWQgYnlcbiAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyAoYWthIHBUb1N0cmluZykuIE5ldmVyIHBlcmZvcm0gYmluYXJ5XG4gIC8vIGNvbXBhcmlzb25zIGZvciBGbG9hdCpBcnJheXMsIHRob3VnaCwgc2luY2UgZS5nLiArMCA9PT0gLTAgYnV0IHRoZWlyXG4gIC8vIGJpdCBwYXR0ZXJucyBhcmUgbm90IGlkZW50aWNhbC5cbiAgfSBlbHNlIGlmIChpc1ZpZXcoYWN0dWFsKSAmJiBpc1ZpZXcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgcFRvU3RyaW5nKGFjdHVhbCkgPT09IHBUb1N0cmluZyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICAhKGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSB8fFxuICAgICAgICAgICAgICAgYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSkge1xuICAgIHJldHVybiBjb21wYXJlKG5ldyBVaW50OEFycmF5KGFjdHVhbC5idWZmZXIpLFxuICAgICAgICAgICAgICAgICAgIG5ldyBVaW50OEFycmF5KGV4cGVjdGVkLmJ1ZmZlcikpID09PSAwO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAhPT0gaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG1lbW9zID0gbWVtb3MgfHwge2FjdHVhbDogW10sIGV4cGVjdGVkOiBbXX07XG5cbiAgICB2YXIgYWN0dWFsSW5kZXggPSBtZW1vcy5hY3R1YWwuaW5kZXhPZihhY3R1YWwpO1xuICAgIGlmIChhY3R1YWxJbmRleCAhPT0gLTEpIHtcbiAgICAgIGlmIChhY3R1YWxJbmRleCA9PT0gbWVtb3MuZXhwZWN0ZWQuaW5kZXhPZihleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb3MuYWN0dWFsLnB1c2goYWN0dWFsKTtcbiAgICBtZW1vcy5leHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcblxuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSB7XG4gIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKVxuICAgIHJldHVybiBhID09PSBiO1xuICBpZiAoc3RyaWN0ICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSAhPT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKTtcbiAgdmFyIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYiwgc3RyaWN0KTtcbiAgfVxuICB2YXIga2EgPSBvYmplY3RLZXlzKGEpO1xuICB2YXIga2IgPSBvYmplY3RLZXlzKGIpO1xuICB2YXIga2V5LCBpO1xuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9PSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5ub3REZWVwU3RyaWN0RXF1YWwgPSBub3REZWVwU3RyaWN0RXF1YWw7XG5mdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBTdHJpY3RFcXVhbCcsIG5vdERlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn1cblxuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSWdub3JlLiAgVGhlIGluc3RhbmNlb2YgY2hlY2sgZG9lc24ndCB3b3JrIGZvciBhcnJvdyBmdW5jdGlvbnMuXG4gIH1cblxuICBpZiAoRXJyb3IuaXNQcm90b3R5cGVPZihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKSB7XG4gIHZhciBlcnJvcjtcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBibG9jayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYmxvY2tcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIGFjdHVhbCA9IF90cnlCbG9jayhibG9jayk7XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICB2YXIgdXNlclByb3ZpZGVkTWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJztcbiAgdmFyIGlzVW53YW50ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgdXRpbC5pc0Vycm9yKGFjdHVhbCk7XG4gIHZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmICFleHBlY3RlZDtcblxuICBpZiAoKGlzVW53YW50ZWRFeGNlcHRpb24gJiZcbiAgICAgIHVzZXJQcm92aWRlZE1lc3NhZ2UgJiZcbiAgICAgIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fFxuICAgICAgaXNVbmV4cGVjdGVkRXhjZXB0aW9uKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKHRydWUsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyhmYWxzZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHRocm93IGVycjsgfTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCJjb25zb2xlLmxvZygnbG9sJyk7XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7IC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTsgLy8gTm9kZUpTXG4gIH0gZWxzZSB7IC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gIHJvb3QuZmFrZVJhZiA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbnZhciBvcmlnaW5hbDtcblxudmFyIHJlcXVlc3RlcnMgPSBbXTtcblxuZnVuY3Rpb24gZmFrZVJhZihmbikge1xuICByZXF1ZXN0ZXJzLnB1c2goZm4pO1xufVxuXG5mdW5jdGlvbiB1c2UoKSB7XG4gIG9yaWdpbmFsID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZha2VSYWY7XG59XG5cbmZ1bmN0aW9uIHJlc3RvcmUoKSB7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBvcmlnaW5hbDtcbn1cblxuZnVuY3Rpb24gc3RlcCgpIHtcbiAgdmFyIGN1ciA9IHJlcXVlc3RlcnM7XG4gIHJlcXVlc3RlcnMgPSBbXTtcbiAgY3VyLmZvckVhY2goZnVuY3Rpb24oZikgeyBmKDE2KTsgfSk7XG59XG5cbnJldHVybiB7dXNlOiB1c2UsIHJlc3RvcmU6IHJlc3RvcmUsIHN0ZXA6IHN0ZXB9O1xuXG59KSk7XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qanNoaW50IC1XMDU0ICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gIGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoXG4gICAgICAsIHRlbXBvcmFyeVZhbHVlXG4gICAgICAsIHJhbmRvbUluZGV4XG4gICAgICA7XG5cbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIGV4cG9ydHMua251dGhTaHVmZmxlID0gc2h1ZmZsZTtcbn0oJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBleHBvcnRzICYmIGV4cG9ydHMgfHwgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8IGdsb2JhbCkpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdm5vZGVfMSA9IHJlcXVpcmUoXCIuL3Zub2RlXCIpO1xyXG52YXIgaXMgPSByZXF1aXJlKFwiLi9pc1wiKTtcclxudmFyIGh0bWxkb21hcGlfMSA9IHJlcXVpcmUoXCIuL2h0bWxkb21hcGlcIik7XHJcbmZ1bmN0aW9uIGlzVW5kZWYocykgeyByZXR1cm4gcyA9PT0gdW5kZWZpbmVkOyB9XHJcbmZ1bmN0aW9uIGlzRGVmKHMpIHsgcmV0dXJuIHMgIT09IHVuZGVmaW5lZDsgfVxyXG52YXIgZW1wdHlOb2RlID0gdm5vZGVfMS5kZWZhdWx0KCcnLCB7fSwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuZnVuY3Rpb24gc2FtZVZub2RlKHZub2RlMSwgdm5vZGUyKSB7XHJcbiAgICByZXR1cm4gdm5vZGUxLmtleSA9PT0gdm5vZGUyLmtleSAmJiB2bm9kZTEuc2VsID09PSB2bm9kZTIuc2VsO1xyXG59XHJcbmZ1bmN0aW9uIGlzVm5vZGUodm5vZGUpIHtcclxuICAgIHJldHVybiB2bm9kZS5zZWwgIT09IHVuZGVmaW5lZDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVLZXlUb09sZElkeChjaGlsZHJlbiwgYmVnaW5JZHgsIGVuZElkeCkge1xyXG4gICAgdmFyIGksIG1hcCA9IHt9LCBrZXksIGNoO1xyXG4gICAgZm9yIChpID0gYmVnaW5JZHg7IGkgPD0gZW5kSWR4OyArK2kpIHtcclxuICAgICAgICBjaCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjaCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGNoLmtleTtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbWFwW2tleV0gPSBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBtYXA7XHJcbn1cclxudmFyIGhvb2tzID0gWydjcmVhdGUnLCAndXBkYXRlJywgJ3JlbW92ZScsICdkZXN0cm95JywgJ3ByZScsICdwb3N0J107XHJcbnZhciBoXzEgPSByZXF1aXJlKFwiLi9oXCIpO1xyXG5leHBvcnRzLmggPSBoXzEuaDtcclxudmFyIHRodW5rXzEgPSByZXF1aXJlKFwiLi90aHVua1wiKTtcclxuZXhwb3J0cy50aHVuayA9IHRodW5rXzEudGh1bms7XHJcbmZ1bmN0aW9uIGluaXQobW9kdWxlcywgZG9tQXBpKSB7XHJcbiAgICB2YXIgaSwgaiwgY2JzID0ge307XHJcbiAgICB2YXIgYXBpID0gZG9tQXBpICE9PSB1bmRlZmluZWQgPyBkb21BcGkgOiBodG1sZG9tYXBpXzEuZGVmYXVsdDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGNic1tob29rc1tpXV0gPSBbXTtcclxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgbW9kdWxlcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICB2YXIgaG9vayA9IG1vZHVsZXNbal1baG9va3NbaV1dO1xyXG4gICAgICAgICAgICBpZiAoaG9vayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYnNbaG9va3NbaV1dLnB1c2goaG9vayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBlbXB0eU5vZGVBdChlbG0pIHtcclxuICAgICAgICB2YXIgaWQgPSBlbG0uaWQgPyAnIycgKyBlbG0uaWQgOiAnJztcclxuICAgICAgICB2YXIgYyA9IGVsbS5jbGFzc05hbWUgPyAnLicgKyBlbG0uY2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignLicpIDogJyc7XHJcbiAgICAgICAgcmV0dXJuIHZub2RlXzEuZGVmYXVsdChhcGkudGFnTmFtZShlbG0pLnRvTG93ZXJDYXNlKCkgKyBpZCArIGMsIHt9LCBbXSwgdW5kZWZpbmVkLCBlbG0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUm1DYihjaGlsZEVsbSwgbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHJtQ2IoKSB7XHJcbiAgICAgICAgICAgIGlmICgtLWxpc3RlbmVycyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudF8xID0gYXBpLnBhcmVudE5vZGUoY2hpbGRFbG0pO1xyXG4gICAgICAgICAgICAgICAgYXBpLnJlbW92ZUNoaWxkKHBhcmVudF8xLCBjaGlsZEVsbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxtKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcclxuICAgICAgICB2YXIgaSwgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuaW5pdCkpIHtcclxuICAgICAgICAgICAgICAgIGkodm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHZub2RlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW4sIHNlbCA9IHZub2RlLnNlbDtcclxuICAgICAgICBpZiAoc2VsID09PSAnIScpIHtcclxuICAgICAgICAgICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcclxuICAgICAgICAgICAgICAgIHZub2RlLnRleHQgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2bm9kZS5lbG0gPSBhcGkuY3JlYXRlQ29tbWVudCh2bm9kZS50ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2VsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gUGFyc2Ugc2VsZWN0b3JcclxuICAgICAgICAgICAgdmFyIGhhc2hJZHggPSBzZWwuaW5kZXhPZignIycpO1xyXG4gICAgICAgICAgICB2YXIgZG90SWR4ID0gc2VsLmluZGV4T2YoJy4nLCBoYXNoSWR4KTtcclxuICAgICAgICAgICAgdmFyIGhhc2ggPSBoYXNoSWR4ID4gMCA/IGhhc2hJZHggOiBzZWwubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgZG90ID0gZG90SWR4ID4gMCA/IGRvdElkeCA6IHNlbC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciB0YWcgPSBoYXNoSWR4ICE9PSAtMSB8fCBkb3RJZHggIT09IC0xID8gc2VsLnNsaWNlKDAsIE1hdGgubWluKGhhc2gsIGRvdCkpIDogc2VsO1xyXG4gICAgICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtID0gaXNEZWYoZGF0YSkgJiYgaXNEZWYoaSA9IGRhdGEubnMpID8gYXBpLmNyZWF0ZUVsZW1lbnROUyhpLCB0YWcpXHJcbiAgICAgICAgICAgICAgICA6IGFwaS5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICAgICAgICAgIGlmIChoYXNoIDwgZG90KVxyXG4gICAgICAgICAgICAgICAgZWxtLnNldEF0dHJpYnV0ZSgnaWQnLCBzZWwuc2xpY2UoaGFzaCArIDEsIGRvdCkpO1xyXG4gICAgICAgICAgICBpZiAoZG90SWR4ID4gMClcclxuICAgICAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgc2VsLnNsaWNlKGRvdCArIDEpLnJlcGxhY2UoL1xcLi9nLCAnICcpKTtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5jcmVhdGUubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgICAgICBjYnMuY3JlYXRlW2ldKGVtcHR5Tm9kZSwgdm5vZGUpO1xyXG4gICAgICAgICAgICBpZiAoaXMuYXJyYXkoY2hpbGRyZW4pKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2ggPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2ggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuYXBwZW5kQ2hpbGQoZWxtLCBjcmVhdGVFbG0oY2gsIGluc2VydGVkVm5vZGVRdWV1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpcy5wcmltaXRpdmUodm5vZGUudGV4dCkpIHtcclxuICAgICAgICAgICAgICAgIGFwaS5hcHBlbmRDaGlsZChlbG0sIGFwaS5jcmVhdGVUZXh0Tm9kZSh2bm9kZS50ZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IHZub2RlLmRhdGEuaG9vazsgLy8gUmV1c2UgdmFyaWFibGVcclxuICAgICAgICAgICAgaWYgKGlzRGVmKGkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaS5jcmVhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgaS5jcmVhdGUoZW1wdHlOb2RlLCB2bm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaS5pbnNlcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlLnB1c2godm5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2bm9kZS5lbG0gPSBhcGkuY3JlYXRlVGV4dE5vZGUodm5vZGUudGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2bm9kZS5lbG07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBhZGRWbm9kZXMocGFyZW50RWxtLCBiZWZvcmUsIHZub2Rlcywgc3RhcnRJZHgsIGVuZElkeCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICAgICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xyXG4gICAgICAgICAgICB2YXIgY2ggPSB2bm9kZXNbc3RhcnRJZHhdO1xyXG4gICAgICAgICAgICBpZiAoY2ggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGNyZWF0ZUVsbShjaCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSwgYmVmb3JlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGludm9rZURlc3Ryb3lIb29rKHZub2RlKSB7XHJcbiAgICAgICAgdmFyIGksIGosIGRhdGEgPSB2bm9kZS5kYXRhO1xyXG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLmRlc3Ryb3kpKVxyXG4gICAgICAgICAgICAgICAgaSh2bm9kZSk7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMuZGVzdHJveS5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgICAgIGNicy5kZXN0cm95W2ldKHZub2RlKTtcclxuICAgICAgICAgICAgaWYgKHZub2RlLmNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCB2bm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICAgICAgICAgIGkgPSB2bm9kZS5jaGlsZHJlbltqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSBudWxsICYmIHR5cGVvZiBpICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIHZub2Rlcywgc3RhcnRJZHgsIGVuZElkeCkge1xyXG4gICAgICAgIGZvciAoOyBzdGFydElkeCA8PSBlbmRJZHg7ICsrc3RhcnRJZHgpIHtcclxuICAgICAgICAgICAgdmFyIGlfMSA9IHZvaWQgMCwgbGlzdGVuZXJzID0gdm9pZCAwLCBybSA9IHZvaWQgMCwgY2ggPSB2bm9kZXNbc3RhcnRJZHhdO1xyXG4gICAgICAgICAgICBpZiAoY2ggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRGVmKGNoLnNlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnZva2VEZXN0cm95SG9vayhjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzID0gY2JzLnJlbW92ZS5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHJtID0gY3JlYXRlUm1DYihjaC5lbG0sIGxpc3RlbmVycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpXzEgPSAwOyBpXzEgPCBjYnMucmVtb3ZlLmxlbmd0aDsgKytpXzEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNicy5yZW1vdmVbaV8xXShjaCwgcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZihpXzEgPSBjaC5kYXRhKSAmJiBpc0RlZihpXzEgPSBpXzEuaG9vaykgJiYgaXNEZWYoaV8xID0gaV8xLnJlbW92ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaV8xKGNoLCBybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVDaGlsZChwYXJlbnRFbG0sIGNoLmVsbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1cGRhdGVDaGlsZHJlbihwYXJlbnRFbG0sIG9sZENoLCBuZXdDaCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICAgICAgdmFyIG9sZFN0YXJ0SWR4ID0gMCwgbmV3U3RhcnRJZHggPSAwO1xyXG4gICAgICAgIHZhciBvbGRFbmRJZHggPSBvbGRDaC5sZW5ndGggLSAxO1xyXG4gICAgICAgIHZhciBvbGRTdGFydFZub2RlID0gb2xkQ2hbMF07XHJcbiAgICAgICAgdmFyIG9sZEVuZFZub2RlID0gb2xkQ2hbb2xkRW5kSWR4XTtcclxuICAgICAgICB2YXIgbmV3RW5kSWR4ID0gbmV3Q2gubGVuZ3RoIC0gMTtcclxuICAgICAgICB2YXIgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWzBdO1xyXG4gICAgICAgIHZhciBuZXdFbmRWbm9kZSA9IG5ld0NoW25ld0VuZElkeF07XHJcbiAgICAgICAgdmFyIG9sZEtleVRvSWR4O1xyXG4gICAgICAgIHZhciBpZHhJbk9sZDtcclxuICAgICAgICB2YXIgZWxtVG9Nb3ZlO1xyXG4gICAgICAgIHZhciBiZWZvcmU7XHJcbiAgICAgICAgd2hpbGUgKG9sZFN0YXJ0SWR4IDw9IG9sZEVuZElkeCAmJiBuZXdTdGFydElkeCA8PSBuZXdFbmRJZHgpIHtcclxuICAgICAgICAgICAgaWYgKG9sZFN0YXJ0Vm5vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdOyAvLyBWbm9kZSBtaWdodCBoYXZlIGJlZW4gbW92ZWQgbGVmdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9sZEVuZFZub2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld1N0YXJ0Vm5vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld0VuZFZub2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hbLS1uZXdFbmRJZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdTdGFydFZub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hWbm9kZShvbGRTdGFydFZub2RlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xyXG4gICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaFZub2RlKG9sZEVuZFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xyXG4gICAgICAgICAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoc2FtZVZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld0VuZFZub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgICAgICAgIGFwaS5pbnNlcnRCZWZvcmUocGFyZW50RWxtLCBvbGRTdGFydFZub2RlLmVsbSwgYXBpLm5leHRTaWJsaW5nKG9sZEVuZFZub2RlLmVsbSkpO1xyXG4gICAgICAgICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xyXG4gICAgICAgICAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoc2FtZVZub2RlKG9sZEVuZFZub2RlLCBuZXdTdGFydFZub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgICAgICAgIGFwaS5pbnNlcnRCZWZvcmUocGFyZW50RWxtLCBvbGRFbmRWbm9kZS5lbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xyXG4gICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEtleVRvSWR4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRLZXlUb0lkeCA9IGNyZWF0ZUtleVRvT2xkSWR4KG9sZENoLCBvbGRTdGFydElkeCwgb2xkRW5kSWR4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlkeEluT2xkID0gb2xkS2V5VG9JZHhbbmV3U3RhcnRWbm9kZS5rZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzVW5kZWYoaWR4SW5PbGQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpLCBvbGRTdGFydFZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtVG9Nb3ZlID0gb2xkQ2hbaWR4SW5PbGRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbG1Ub01vdmUuc2VsICE9PSBuZXdTdGFydFZub2RlLnNlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgY3JlYXRlRWxtKG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSksIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoVm5vZGUoZWxtVG9Nb3ZlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaFtpZHhJbk9sZF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5pbnNlcnRCZWZvcmUocGFyZW50RWxtLCBlbG1Ub01vdmUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkU3RhcnRJZHggPiBvbGRFbmRJZHgpIHtcclxuICAgICAgICAgICAgYmVmb3JlID0gbmV3Q2hbbmV3RW5kSWR4ICsgMV0gPT0gbnVsbCA/IG51bGwgOiBuZXdDaFtuZXdFbmRJZHggKyAxXS5lbG07XHJcbiAgICAgICAgICAgIGFkZFZub2RlcyhwYXJlbnRFbG0sIGJlZm9yZSwgbmV3Q2gsIG5ld1N0YXJ0SWR4LCBuZXdFbmRJZHgsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5ld1N0YXJ0SWR4ID4gbmV3RW5kSWR4KSB7XHJcbiAgICAgICAgICAgIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIG9sZENoLCBvbGRTdGFydElkeCwgb2xkRW5kSWR4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwYXRjaFZub2RlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XHJcbiAgICAgICAgdmFyIGksIGhvb2s7XHJcbiAgICAgICAgaWYgKGlzRGVmKGkgPSB2bm9kZS5kYXRhKSAmJiBpc0RlZihob29rID0gaS5ob29rKSAmJiBpc0RlZihpID0gaG9vay5wcmVwYXRjaCkpIHtcclxuICAgICAgICAgICAgaShvbGRWbm9kZSwgdm5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtID0gb2xkVm5vZGUuZWxtO1xyXG4gICAgICAgIHZhciBvbGRDaCA9IG9sZFZub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIHZhciBjaCA9IHZub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgIGlmIChvbGRWbm9kZSA9PT0gdm5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodm5vZGUuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMudXBkYXRlLmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICAgICAgY2JzLnVwZGF0ZVtpXShvbGRWbm9kZSwgdm5vZGUpO1xyXG4gICAgICAgICAgICBpID0gdm5vZGUuZGF0YS5ob29rO1xyXG4gICAgICAgICAgICBpZiAoaXNEZWYoaSkgJiYgaXNEZWYoaSA9IGkudXBkYXRlKSlcclxuICAgICAgICAgICAgICAgIGkob2xkVm5vZGUsIHZub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcclxuICAgICAgICAgICAgaWYgKGlzRGVmKG9sZENoKSAmJiBpc0RlZihjaCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRDaCAhPT0gY2gpXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4oZWxtLCBvbGRDaCwgY2gsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNEZWYoY2gpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWYob2xkVm5vZGUudGV4dCkpXHJcbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldFRleHRDb250ZW50KGVsbSwgJycpO1xyXG4gICAgICAgICAgICAgICAgYWRkVm5vZGVzKGVsbSwgbnVsbCwgY2gsIDAsIGNoLmxlbmd0aCAtIDEsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNEZWYob2xkQ2gpKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVWbm9kZXMoZWxtLCBvbGRDaCwgMCwgb2xkQ2gubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNEZWYob2xkVm5vZGUudGV4dCkpIHtcclxuICAgICAgICAgICAgICAgIGFwaS5zZXRUZXh0Q29udGVudChlbG0sICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvbGRWbm9kZS50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XHJcbiAgICAgICAgICAgIGFwaS5zZXRUZXh0Q29udGVudChlbG0sIHZub2RlLnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNEZWYoaG9vaykgJiYgaXNEZWYoaSA9IGhvb2sucG9zdHBhdGNoKSkge1xyXG4gICAgICAgICAgICBpKG9sZFZub2RlLCB2bm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHBhdGNoKG9sZFZub2RlLCB2bm9kZSkge1xyXG4gICAgICAgIHZhciBpLCBlbG0sIHBhcmVudDtcclxuICAgICAgICB2YXIgaW5zZXJ0ZWRWbm9kZVF1ZXVlID0gW107XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5wcmUubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgIGNicy5wcmVbaV0oKTtcclxuICAgICAgICBpZiAoIWlzVm5vZGUob2xkVm5vZGUpKSB7XHJcbiAgICAgICAgICAgIG9sZFZub2RlID0gZW1wdHlOb2RlQXQob2xkVm5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2FtZVZub2RlKG9sZFZub2RlLCB2bm9kZSkpIHtcclxuICAgICAgICAgICAgcGF0Y2hWbm9kZShvbGRWbm9kZSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbG0gPSBvbGRWbm9kZS5lbG07XHJcbiAgICAgICAgICAgIHBhcmVudCA9IGFwaS5wYXJlbnROb2RlKGVsbSk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUVsbSh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnQsIHZub2RlLmVsbSwgYXBpLm5leHRTaWJsaW5nKGVsbSkpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudCwgW29sZFZub2RlXSwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGluc2VydGVkVm5vZGVRdWV1ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpbnNlcnRlZFZub2RlUXVldWVbaV0uZGF0YS5ob29rLmluc2VydChpbnNlcnRlZFZub2RlUXVldWVbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnBvc3QubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgIGNicy5wb3N0W2ldKCk7XHJcbiAgICAgICAgcmV0dXJuIHZub2RlO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmluaXQgPSBpbml0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zbmFiYmRvbS5qcy5tYXAiLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG52YXIgc25hYmJkb20gPSByZXF1aXJlKCcuLi9zbmFiYmRvbScpO1xuXG52YXIgcGF0Y2ggPSBzbmFiYmRvbS5pbml0KFtdKTtcbnZhciBhdHRhY2hUbyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXR0YWNodG8nKS5kZWZhdWx0O1xudmFyIGggPSByZXF1aXJlKCcuLi9oJykuZGVmYXVsdDtcblxuZGVzY3JpYmUoJ2F0dGFjaFRvJywgZnVuY3Rpb24oKSB7XG4gIHZhciBlbG0sIHZub2RlMDtcbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2bm9kZTAgPSBlbG07XG4gIH0pO1xuICBpdCgnYWRkcyBlbGVtZW50IHRvIHRhcmdldCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbXG4gICAgICAgaCgnZGl2I3dyYXBwZXInLCBbXG4gICAgICAgICBoKCdkaXYnLCAnU29tZSBlbGVtZW50JyksXG4gICAgICAgICBhdHRhY2hUbyhlbG0sIGgoJ2RpdiNhdHRhY2hlZCcsICdUZXN0JykpLFxuICAgICAgIF0pLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDIpO1xuICB9KTtcbiAgaXQoJ3VwZGF0ZXMgZWxlbWVudCBhdCB0YXJnZXQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgaCgnZGl2I3dyYXBwZXInLCBbXG4gICAgICAgIGgoJ2RpdicsICdTb21lIGVsZW1lbnQnKSxcbiAgICAgICAgYXR0YWNoVG8oZWxtLCBoKCdkaXYjYXR0YWNoZWQnLCAnRmlyc3QgdGV4dCcpKSxcbiAgICAgIF0pLFxuICAgIF0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbXG4gICAgICBoKCdkaXYjd3JhcHBlcicsIFtcbiAgICAgICAgaCgnZGl2JywgJ1NvbWUgZWxlbWVudCcpLFxuICAgICAgICBhdHRhY2hUbyhlbG0sIGgoJ2RpdiNhdHRhY2hlZCcsICdOZXcgdGV4dCcpKSxcbiAgICAgIF0pLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlblswXS5pbm5lckhUTUwsICdGaXJzdCB0ZXh0Jyk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJ05ldyB0ZXh0Jyk7XG4gIH0pO1xuICBpdCgnZWxlbWVudCBjYW4gYmUgaW5zZXJ0ZWQgYmVmb3JlIG1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgIGgoJ2RpdiN3cmFwcGVyJywgW1xuICAgICAgICBoKCdkaXYnLCAnU29tZSBlbGVtZW50JyksXG4gICAgICAgIGF0dGFjaFRvKGVsbSwgaCgnZGl2I2F0dGFjaGVkJywgJ1RleHQnKSksXG4gICAgICBdKSxcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW1xuICAgICAgaCgnZGl2I3dyYXBwZXInLCBbXG4gICAgICAgIGgoJ2RpdicsICdTb21lIGVsZW1lbnQnKSxcbiAgICAgICAgaCgnZGl2JywgJ0EgbmV3IGVsZW1lbnQnKSxcbiAgICAgICAgYXR0YWNoVG8oZWxtLCBoKCdkaXYjYXR0YWNoZWQnLCAnVGV4dCcpKSxcbiAgICAgIF0pLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlblswXS5pbm5lckhUTUwsICdUZXh0Jyk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJ1RleHQnKTtcbiAgfSk7XG4gIGl0KCdyZW1vdmVzIGVsZW1lbnQgYXQgdGFyZ2V0JywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgIGgoJ2RpdiN3cmFwcGVyJywgW1xuICAgICAgICBoKCdkaXYnLCAnU29tZSBlbGVtZW50JyksXG4gICAgICAgIGF0dGFjaFRvKGVsbSwgaCgnZGl2I2F0dGFjaGVkJywgJ0ZpcnN0IHRleHQnKSksXG4gICAgICBdKSxcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW1xuICAgICAgaCgnZGl2I3dyYXBwZXInLCBbXG4gICAgICAgIGgoJ2RpdicsICdTb21lIGVsZW1lbnQnKSxcbiAgICAgIF0pLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlblswXS5pbm5lckhUTUwsICdGaXJzdCB0ZXh0Jyk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgMSk7XG4gIH0pO1xuICBpdCgncmVtb3ZlIGhvb2sgcmVjZWl2ZXMgcmVhbCBlbGVtZW50JywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gcm0odm5vZGUsIGNiKSB7XG4gICAgICBhc3NlcnQuZXF1YWwodm5vZGUuZWxtLnRhZ05hbWUsICdESVYnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS5lbG0uaW5uZXJIVE1MLCAnRmlyc3QgdGV4dCcpO1xuICAgICAgY2IoKTtcbiAgICB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgIGgoJ2RpdiN3cmFwcGVyJywgW1xuICAgICAgICBoKCdkaXYnLCAnU29tZSBlbGVtZW50JyksXG4gICAgICAgIGF0dGFjaFRvKGVsbSwgaCgnZGl2I2F0dGFjaGVkJywge2hvb2s6IHtyZW1vdmU6IHJtfX0sICdGaXJzdCB0ZXh0JykpLFxuICAgICAgXSksXG4gICAgXSk7XG4gICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtcbiAgICAgIGgoJ2RpdiN3cmFwcGVyJywgW1xuICAgICAgICBoKCdkaXYnLCAnU29tZSBlbGVtZW50JyksXG4gICAgICBdKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gIH0pO1xufSk7XG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbnZhciBzbmFiYmRvbSA9IHJlcXVpcmUoJy4uL3NuYWJiZG9tJyk7XG52YXIgcGF0Y2ggPSBzbmFiYmRvbS5pbml0KFtcbiAgcmVxdWlyZSgnLi4vbW9kdWxlcy9hdHRyaWJ1dGVzJykuZGVmYXVsdCxcbl0pO1xudmFyIGggPSByZXF1aXJlKCcuLi9oJykuZGVmYXVsdDtcblxuZGVzY3JpYmUoJ2F0dHJpYnV0ZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGVsbSwgdm5vZGUwO1xuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZub2RlMCA9IGVsbTtcbiAgfSk7XG4gIGl0KCdoYXZlIHRoZWlyIHByb3ZpZGVkIHZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCB7YXR0cnM6IHtocmVmOiAnL2ZvbycsIG1pbmxlbmd0aDogMSwgdmFsdWU6IHRydWV9fSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgnaHJlZicpLCAnL2ZvbycpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSwgJzEnKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgndmFsdWUnKSwgJ3RydWUnKTtcbiAgfSk7XG4gIGl0KCdjYW4gYmUgbWVtb2l6ZWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FjaGVkQXR0cnMgPSB7aHJlZjogJy9mb28nLCBtaW5sZW5ndGg6IDEsIHZhbHVlOiB0cnVlfTtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2Jywge2F0dHJzOiBjYWNoZWRBdHRyc30pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCB7YXR0cnM6IGNhY2hlZEF0dHJzfSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgnaHJlZicpLCAnL2ZvbycpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSwgJzEnKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgndmFsdWUnKSwgJ3RydWUnKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdocmVmJyksICcvZm9vJyk7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpLCAnMScpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCd2YWx1ZScpLCAndHJ1ZScpO1xuICB9KTtcbiAgaXQoJ2FyZSBub3Qgb21pdHRlZCB3aGVuIGZhbHN5IHZhbHVlcyBhcmUgcHJvdmlkZWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2Jywge2F0dHJzOiB7aHJlZjogbnVsbCwgbWlubGVuZ3RoOiAwLCB2YWx1ZTogZmFsc2V9fSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgnaHJlZicpLCAnbnVsbCcpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSwgJzAnKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgndmFsdWUnKSwgJ2ZhbHNlJyk7XG4gIH0pO1xuICBpdCgnYXJlIHNldCBjb3JyZWN0bHkgd2hlbiBuYW1lc3BhY2VkJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHthdHRyczogeyd4bGluazpocmVmJzogJyNmb28nfX0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5nZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICdocmVmJyksICcjZm9vJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIG5vdCB0b3VjaCBjbGFzcyBub3IgaWQgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxtLmlkID0gJ215SWQnO1xuICAgIGVsbS5jbGFzc05hbWUgPSAnbXlDbGFzcyc7XG4gICAgdm5vZGUwID0gZWxtO1xuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYjbXlJZC5teUNsYXNzJywge2F0dHJzOiB7fX0sIFsnSGVsbG8nXSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLnRhZ05hbWUsICdESVYnKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmlkLCAnbXlJZCcpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uY2xhc3NOYW1lLCAnbXlDbGFzcycpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0udGV4dENvbnRlbnQsICdIZWxsbycpO1xuICB9KTtcbiAgZGVzY3JpYmUoJ2Jvb2xlYW4gYXR0cmlidXRlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2lzIHByZXNlbnQgYW5kIGVtcHR5IHN0cmluZyBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdm5vZGUxID0gaCgnZGl2Jywge2F0dHJzOiB7cmVxdWlyZWQ6IHRydWUsIHJlYWRvbmx5OiAxLCBub3Jlc2l6ZTogJ3RydXRoeSd9fSk7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJyksIHRydWUpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJyksICcnKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uaGFzQXR0cmlidXRlKCdyZWFkb25seScpLCB0cnVlKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdyZWFkb25seScpLCAnJyk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmhhc0F0dHJpYnV0ZSgnbm9yZXNpemUnKSwgdHJ1ZSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgnbm9yZXNpemUnKSwgJycpO1xuICAgIH0pO1xuICAgIGl0KCdpcyBvbWl0dGVkIGlmIHRoZSB2YWx1ZSBpcyBmYWxzeScsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHthdHRyczoge3JlcXVpcmVkOiBmYWxzZSwgcmVhZG9ubHk6IDAsIG5vcmVzaXplOiBudWxsfX0pO1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpLCBudWxsKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdyZWFkb25seScpLCBudWxsKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uZ2V0QXR0cmlidXRlKCdub3Jlc2l6ZScpLCBudWxsKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdPYmplY3QucHJvdG90eXBlIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2lzIG5vdCBjb25zaWRlcmVkIGFzIGEgYm9vbGVhbiBhdHRyaWJ1dGUgYW5kIHNob3VsZG5cXCd0IGJlIG9taXR0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCB7YXR0cnM6IHtjb25zdHJ1Y3RvcjogdHJ1ZX19KTtcbiAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmdldEF0dHJpYnV0ZSgnY29uc3RydWN0b3InKSwgJ3RydWUnKTtcbiAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCB7YXR0cnM6IHtjb25zdHJ1Y3RvcjogZmFsc2V9fSk7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMikuZWxtO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5nZXRBdHRyaWJ1dGUoJ2NvbnN0cnVjdG9yJyksICdmYWxzZScpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xudmFyIHNodWZmbGUgPSByZXF1aXJlKCdrbnV0aC1zaHVmZmxlJykua251dGhTaHVmZmxlO1xuXG52YXIgc25hYmJkb20gPSByZXF1aXJlKCcuLi9zbmFiYmRvbScpO1xudmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG4gIHJlcXVpcmUoJy4uL21vZHVsZXMvY2xhc3MnKS5kZWZhdWx0LFxuICByZXF1aXJlKCcuLi9tb2R1bGVzL3Byb3BzJykuZGVmYXVsdCxcbiAgcmVxdWlyZSgnLi4vbW9kdWxlcy9ldmVudGxpc3RlbmVycycpLmRlZmF1bHQsXG5dKTtcbnZhciBoID0gcmVxdWlyZSgnLi4vaCcpLmRlZmF1bHQ7XG52YXIgdG9WTm9kZSA9IHJlcXVpcmUoJy4uL3Rvdm5vZGUnKS5kZWZhdWx0O1xuXG5mdW5jdGlvbiBwcm9wKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmpbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hcChmbiwgbGlzdCkge1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGZuKGxpc3RbaV0pO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbnZhciBpbm5lciA9IHByb3AoJ2lubmVySFRNTCcpO1xuXG5kZXNjcmliZSgnc25hYmJkb20nLCBmdW5jdGlvbigpIHtcbiAgdmFyIGVsbSwgdm5vZGUwO1xuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZub2RlMCA9IGVsbTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdoeXBlcnNjcmlwdCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdjYW4gY3JlYXRlIHZub2RlIHdpdGggcHJvcGVyIHRhZycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmVxdWFsKGgoJ2RpdicpLnNlbCwgJ2RpdicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGgoJ2EnKS5zZWwsICdhJyk7XG4gICAgfSk7XG4gICAgaXQoJ2NhbiBjcmVhdGUgdm5vZGUgd2l0aCBjaGlsZHJlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZub2RlID0gaCgnZGl2JywgW2goJ3NwYW4jaGVsbG8nKSwgaCgnYi53b3JsZCcpXSk7XG4gICAgICBhc3NlcnQuZXF1YWwodm5vZGUuc2VsLCAnZGl2Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwodm5vZGUuY2hpbGRyZW5bMF0uc2VsLCAnc3BhbiNoZWxsbycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHZub2RlLmNoaWxkcmVuWzFdLnNlbCwgJ2Iud29ybGQnKTtcbiAgICB9KTtcbiAgICBpdCgnY2FuIGNyZWF0ZSB2bm9kZSB3aXRoIG9uZSBjaGlsZCB2bm9kZScsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZub2RlID0gaCgnZGl2JywgaCgnc3BhbiNoZWxsbycpKTtcbiAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS5zZWwsICdkaXYnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS5jaGlsZHJlblswXS5zZWwsICdzcGFuI2hlbGxvJyk7XG4gICAgfSk7XG4gICAgaXQoJ2NhbiBjcmVhdGUgdm5vZGUgd2l0aCBwcm9wcyBhbmQgb25lIGNoaWxkIHZub2RlJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdm5vZGUgPSBoKCdkaXYnLCB7fSwgaCgnc3BhbiNoZWxsbycpKTtcbiAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS5zZWwsICdkaXYnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS5jaGlsZHJlblswXS5zZWwsICdzcGFuI2hlbGxvJyk7XG4gICAgfSk7XG4gICAgaXQoJ2NhbiBjcmVhdGUgdm5vZGUgd2l0aCB0ZXh0IGNvbnRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2bm9kZSA9IGgoJ2EnLCBbJ0kgYW0gYSBzdHJpbmcnXSk7XG4gICAgICBhc3NlcnQuZXF1YWwodm5vZGUuY2hpbGRyZW5bMF0udGV4dCwgJ0kgYW0gYSBzdHJpbmcnKTtcbiAgICB9KTtcbiAgICBpdCgnY2FuIGNyZWF0ZSB2bm9kZSB3aXRoIHRleHQgY29udGVudCBpbiBzdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2bm9kZSA9IGgoJ2EnLCAnSSBhbSBhIHN0cmluZycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHZub2RlLnRleHQsICdJIGFtIGEgc3RyaW5nJyk7XG4gICAgfSk7XG4gICAgaXQoJ2NhbiBjcmVhdGUgdm5vZGUgd2l0aCBwcm9wcyBhbmQgdGV4dCBjb250ZW50IGluIHN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZub2RlID0gaCgnYScsIHt9LCAnSSBhbSBhIHN0cmluZycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHZub2RlLnRleHQsICdJIGFtIGEgc3RyaW5nJyk7XG4gICAgfSk7XG4gICAgaXQoJ2NhbiBjcmVhdGUgdm5vZGUgZm9yIGNvbW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2bm9kZSA9IGgoJyEnLCAndGVzdCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHZub2RlLnNlbCwgJyEnKTtcbiAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS50ZXh0LCAndGVzdCcpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ2NyZWF0ZWQgZWxlbWVudCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdoYXMgdGFnJywgZnVuY3Rpb24oKSB7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJ2RpdicpKS5lbG07XG4gICAgICBhc3NlcnQuZXF1YWwoZWxtLnRhZ05hbWUsICdESVYnKTtcbiAgICB9KTtcbiAgICBpdCgnaGFzIGRpZmZlcmVudCB0YWcgYW5kIGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB2bm9kZTAuYXBwZW5kQ2hpbGQoZWxtKTtcbiAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuI2lkJyk7XG4gICAgICBlbG0gPSBwYXRjaChlbG0sIHZub2RlMSkuZWxtO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS50YWdOYW1lLCAnU1BBTicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5pZCwgJ2lkJyk7XG4gICAgfSk7XG4gICAgaXQoJ2hhcyBpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCBoKCdkaXYnLCBbaCgnZGl2I3VuaXF1ZScpXSkpLmVsbTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5pZCwgJ3VuaXF1ZScpO1xuICAgIH0pO1xuICAgIGl0KCdoYXMgY29ycmVjdCBuYW1lc3BhY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBTVkdOYW1lc3BhY2UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuICAgICAgdmFyIFhIVE1MTmFtZXNwYWNlID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJ2RpdicsIFtoKCdkaXYnLCB7bnM6IFNWR05hbWVzcGFjZX0pXSkpLmVsbTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5uYW1lc3BhY2VVUkksIFNWR05hbWVzcGFjZSk7XG5cbiAgICAgIC8vIHZlcmlmeSB0aGF0IHN2ZyB0YWcgYXV0b21hdGljYWxseSBnZXRzIHN2ZyBuYW1lc3BhY2VcbiAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgaCgnc3ZnJywgW1xuICAgICAgICBoKCdmb3JlaWduT2JqZWN0JywgW1xuICAgICAgICAgIGgoJ2RpdicsIFsnSSBhbSBIVE1MIGVtYmVkZGVkIGluIFNWRyddKVxuICAgICAgICBdKVxuICAgICAgXSkpLmVsbTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0ubmFtZXNwYWNlVVJJLCBTVkdOYW1lc3BhY2UpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5maXJzdENoaWxkLm5hbWVzcGFjZVVSSSwgU1ZHTmFtZXNwYWNlKTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5maXJzdENoaWxkLm5hbWVzcGFjZVVSSSwgWEhUTUxOYW1lc3BhY2UpO1xuXG4gICAgICAvLyB2ZXJpZnkgdGhhdCBzdmcgdGFnIHdpdGggZXh0cmEgc2VsZWN0b3JzIGdldHMgc3ZnIG5hbWVzcGFjZVxuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCBoKCdzdmcjc29tZS1pZCcpKS5lbG07XG4gICAgICBhc3NlcnQuZXF1YWwoZWxtLm5hbWVzcGFjZVVSSSwgU1ZHTmFtZXNwYWNlKTtcblxuICAgICAgLy8gdmVyaWZ5IHRoYXQgbm9uLXN2ZyB0YWcgYmVnaW5uaW5nIHdpdGggJ3N2ZycgZG9lcyBOT1QgZ2V0IG5hbWVzcGFjZVxuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCBoKCdzdmctY3VzdG9tLWVsJykpLmVsbTtcbiAgICAgIGFzc2VydC5ub3RFcXVhbChlbG0ubmFtZXNwYWNlVVJJLCBTVkdOYW1lc3BhY2UpO1xuICAgIH0pO1xuICAgIGl0KCdyZWNlaXZlcyBjbGFzc2VzIGluIHNlbGVjdG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJ2RpdicsIFtoKCdpLmFtLmEuY2xhc3MnKV0pKS5lbG07XG4gICAgICBhc3NlcnQoZWxtLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbScpKTtcbiAgICAgIGFzc2VydChlbG0uZmlyc3RDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoJ2EnKSk7XG4gICAgICBhc3NlcnQoZWxtLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGFzcycpKTtcbiAgICB9KTtcbiAgICBpdCgncmVjZWl2ZXMgY2xhc3NlcyBpbiBjbGFzcyBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCBoKCdpJywge2NsYXNzOiB7YW06IHRydWUsIGE6IHRydWUsIGNsYXNzOiB0cnVlLCBub3Q6IGZhbHNlfX0pKS5lbG07XG4gICAgICBhc3NlcnQoZWxtLmNsYXNzTGlzdC5jb250YWlucygnYW0nKSk7XG4gICAgICBhc3NlcnQoZWxtLmNsYXNzTGlzdC5jb250YWlucygnYScpKTtcbiAgICAgIGFzc2VydChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGFzcycpKTtcbiAgICAgIGFzc2VydCghZWxtLmNsYXNzTGlzdC5jb250YWlucygnbm90JykpO1xuICAgIH0pO1xuICAgIGl0KCdyZWNlaXZlcyBjbGFzc2VzIGluIHNlbGVjdG9yIHdoZW4gbmFtZXNwYWNlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLFxuICAgICAgICBoKCdzdmcnLCBbXG4gICAgICAgICAgaCgnZy5hbS5hLmNsYXNzLnRvbycpXG4gICAgICAgIF0pXG4gICAgICApLmVsbTtcbiAgICAgIGFzc2VydChlbG0uZmlyc3RDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoJ2FtJykpO1xuICAgICAgYXNzZXJ0KGVsbS5maXJzdENoaWxkLmNsYXNzTGlzdC5jb250YWlucygnYScpKTtcbiAgICAgIGFzc2VydChlbG0uZmlyc3RDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoJ2NsYXNzJykpO1xuICAgIH0pO1xuICAgIGl0KCdyZWNlaXZlcyBjbGFzc2VzIGluIGNsYXNzIHByb3BlcnR5IHdoZW4gbmFtZXNwYWNlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLFxuICAgICAgICBoKCdzdmcnLCBbXG4gICAgICAgICAgaCgnZycsIHtjbGFzczoge2FtOiB0cnVlLCBhOiB0cnVlLCBjbGFzczogdHJ1ZSwgbm90OiBmYWxzZSwgdG9vOiB0cnVlfX0pXG4gICAgICAgIF0pXG4gICAgICApLmVsbTtcbiAgICAgIGFzc2VydChlbG0uZmlyc3RDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoJ2FtJykpO1xuICAgICAgYXNzZXJ0KGVsbS5maXJzdENoaWxkLmNsYXNzTGlzdC5jb250YWlucygnYScpKTtcbiAgICAgIGFzc2VydChlbG0uZmlyc3RDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoJ2NsYXNzJykpO1xuICAgICAgYXNzZXJ0KCFlbG0uZmlyc3RDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdCcpKTtcbiAgICB9KTtcbiAgICBpdCgnaGFuZGxlcyBjbGFzc2VzIGZyb20gYm90aCBzZWxlY3RvciBhbmQgcHJvcGVydHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgaCgnZGl2JywgW2goJ2kuaGFzJywge2NsYXNzOiB7Y2xhc3NlczogdHJ1ZX19KV0pKS5lbG07XG4gICAgICBhc3NlcnQoZWxtLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYXMnKSk7XG4gICAgICBhc3NlcnQoZWxtLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGFzc2VzJykpO1xuICAgIH0pO1xuICAgIGl0KCdjYW4gY3JlYXRlIGVsZW1lbnRzIHdpdGggdGV4dCBjb250ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJ2RpdicsIFsnSSBhbSBhIHN0cmluZyddKSkuZWxtO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5pbm5lckhUTUwsICdJIGFtIGEgc3RyaW5nJyk7XG4gICAgfSk7XG4gICAgaXQoJ2NhbiBjcmVhdGUgZWxlbWVudHMgd2l0aCBzcGFuIGFuZCB0ZXh0IGNvbnRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgaCgnYScsIFtoKCdzcGFuJyksICdJIGFtIGEgc3RyaW5nJ10pKS5lbG07XG4gICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0udGFnTmFtZSwgJ1NQQU4nKTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1sxXS50ZXh0Q29udGVudCwgJ0kgYW0gYSBzdHJpbmcnKTtcbiAgICB9KTtcbiAgICBpdCgnY2FuIGNyZWF0ZSBlbGVtZW50cyB3aXRoIHByb3BzJywgZnVuY3Rpb24oKSB7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJ2EnLCB7cHJvcHM6IHtzcmM6ICdodHRwOi8vbG9jYWxob3N0Lyd9fSkpLmVsbTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uc3JjLCAnaHR0cDovL2xvY2FsaG9zdC8nKTtcbiAgICB9KTtcbiAgICBpdCgnY2FuIGNyZWF0ZSBhbiBlbGVtZW50IGNyZWF0ZWQgaW5zaWRlIGFuIGlmcmFtZScsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgIC8vIE9ubHkgcnVuIGlmIHNyY2RvYyBpcyBzdXBwb3J0ZWQuXG4gICAgICB2YXIgZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgIGlmICh0eXBlb2YgZnJhbWUuc3JjZG9jICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmcmFtZS5zcmNkb2MgPSBcIjxkaXY+VGhpbmcgMTwvZGl2PlwiO1xuICAgICAgICBmcmFtZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBwYXRjaChmcmFtZS5jb250ZW50RG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdkaXYnKSwgaCgnZGl2JywgJ1RoaW5nIDInKSk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGZyYW1lLmNvbnRlbnREb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2RpdicpLnRleHRDb250ZW50LCAnVGhpbmcgMicpO1xuICAgICAgICAgIGZyYW1lLnJlbW92ZSgpO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaXQoJ2lzIGEgcGF0Y2ggb2YgdGhlIHJvb3QgZWxlbWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbG1XaXRoSWRBbmRDbGFzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZWxtV2l0aElkQW5kQ2xhc3MuaWQgPSAnaWQnO1xuICAgICAgZWxtV2l0aElkQW5kQ2xhc3MuY2xhc3NOYW1lID0gJ2NsYXNzJztcbiAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYjaWQuY2xhc3MnLCBbaCgnc3BhbicsICdIaScpXSk7XG4gICAgICBlbG0gPSBwYXRjaChlbG1XaXRoSWRBbmRDbGFzcywgdm5vZGUxKS5lbG07XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLCBlbG1XaXRoSWRBbmRDbGFzcyk7XG4gICAgICBhc3NlcnQuZXF1YWwoZWxtLnRhZ05hbWUsICdESVYnKTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uaWQsICdpZCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jbGFzc05hbWUsICdjbGFzcycpO1xuICAgIH0pO1xuICAgIGl0KCdjYW4gY3JlYXRlIGNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJyEnLCAndGVzdCcpKS5lbG07XG4gICAgICBhc3NlcnQuZXF1YWwoZWxtLm5vZGVUeXBlLCBkb2N1bWVudC5DT01NRU5UX05PREUpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS50ZXh0Q29udGVudCwgJ3Rlc3QnKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdwYXRjaGluZyBhbiBlbGVtZW50JywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2NoYW5nZXMgdGhlIGVsZW1lbnRzIGNsYXNzZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2bm9kZTEgPSBoKCdpJywge2NsYXNzOiB7aTogdHJ1ZSwgYW06IHRydWUsIGhvcnNlOiB0cnVlfX0pO1xuICAgICAgdmFyIHZub2RlMiA9IGgoJ2knLCB7Y2xhc3M6IHtpOiB0cnVlLCBhbTogdHJ1ZSwgaG9yc2U6IGZhbHNlfX0pO1xuICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgIGFzc2VydChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpJykpO1xuICAgICAgYXNzZXJ0KGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FtJykpO1xuICAgICAgYXNzZXJ0KCFlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdob3JzZScpKTtcbiAgICB9KTtcbiAgICBpdCgnY2hhbmdlcyBjbGFzc2VzIGluIHNlbGVjdG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdm5vZGUxID0gaCgnaScsIHtjbGFzczoge2k6IHRydWUsIGFtOiB0cnVlLCBob3JzZTogdHJ1ZX19KTtcbiAgICAgIHZhciB2bm9kZTIgPSBoKCdpJywge2NsYXNzOiB7aTogdHJ1ZSwgYW06IHRydWUsIGhvcnNlOiBmYWxzZX19KTtcbiAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICBhc3NlcnQoZWxtLmNsYXNzTGlzdC5jb250YWlucygnaScpKTtcbiAgICAgIGFzc2VydChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhbScpKTtcbiAgICAgIGFzc2VydCghZWxtLmNsYXNzTGlzdC5jb250YWlucygnaG9yc2UnKSk7XG4gICAgfSk7XG4gICAgaXQoJ3ByZXNlcnZlcyBtZW1vaXplZCBjbGFzc2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2FjaGVkQ2xhc3MgPSB7aTogdHJ1ZSwgYW06IHRydWUsIGhvcnNlOiBmYWxzZX07XG4gICAgICB2YXIgdm5vZGUxID0gaCgnaScsIHtjbGFzczogY2FjaGVkQ2xhc3N9KTtcbiAgICAgIHZhciB2bm9kZTIgPSBoKCdpJywge2NsYXNzOiBjYWNoZWRDbGFzc30pO1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgIGFzc2VydChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpJykpO1xuICAgICAgYXNzZXJ0KGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FtJykpO1xuICAgICAgYXNzZXJ0KCFlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdob3JzZScpKTtcbiAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICBhc3NlcnQoZWxtLmNsYXNzTGlzdC5jb250YWlucygnaScpKTtcbiAgICAgIGFzc2VydChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhbScpKTtcbiAgICAgIGFzc2VydCghZWxtLmNsYXNzTGlzdC5jb250YWlucygnaG9yc2UnKSk7XG4gICAgfSk7XG4gICAgaXQoJ3JlbW92ZXMgbWlzc2luZyBjbGFzc2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdm5vZGUxID0gaCgnaScsIHtjbGFzczoge2k6IHRydWUsIGFtOiB0cnVlLCBob3JzZTogdHJ1ZX19KTtcbiAgICAgIHZhciB2bm9kZTIgPSBoKCdpJywge2NsYXNzOiB7aTogdHJ1ZSwgYW06IHRydWV9fSk7XG4gICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgYXNzZXJ0KGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2knKSk7XG4gICAgICBhc3NlcnQoZWxtLmNsYXNzTGlzdC5jb250YWlucygnYW0nKSk7XG4gICAgICBhc3NlcnQoIWVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2hvcnNlJykpO1xuICAgIH0pO1xuICAgIGl0KCdjaGFuZ2VzIGFuIGVsZW1lbnRzIHByb3BzJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdm5vZGUxID0gaCgnYScsIHtwcm9wczoge3NyYzogJ2h0dHA6Ly9vdGhlci8nfX0pO1xuICAgICAgdmFyIHZub2RlMiA9IGgoJ2EnLCB7cHJvcHM6IHtzcmM6ICdodHRwOi8vbG9jYWxob3N0Lyd9fSk7XG4gICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5zcmMsICdodHRwOi8vbG9jYWxob3N0LycpO1xuICAgIH0pO1xuICAgIGl0KCdwcmVzZXJ2ZXMgbWVtb2l6ZWQgcHJvcHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjYWNoZWRQcm9wcyA9IHtzcmM6ICdodHRwOi8vb3RoZXIvJ307XG4gICAgICB2YXIgdm5vZGUxID0gaCgnYScsIHtwcm9wczogY2FjaGVkUHJvcHN9KTtcbiAgICAgIHZhciB2bm9kZTIgPSBoKCdhJywge3Byb3BzOiBjYWNoZWRQcm9wc30pO1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uc3JjLCAnaHR0cDovL290aGVyLycpO1xuICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uc3JjLCAnaHR0cDovL290aGVyLycpO1xuICAgIH0pO1xuICAgIGl0KCdyZW1vdmVzIGFuIGVsZW1lbnRzIHByb3BzJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdm5vZGUxID0gaCgnYScsIHtwcm9wczoge3NyYzogJ2h0dHA6Ly9vdGhlci8nfX0pO1xuICAgICAgdmFyIHZub2RlMiA9IGgoJ2EnKTtcbiAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0uc3JjLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCd1c2luZyB0b1ZOb2RlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpdCgnY2FuIHJlbW92ZSBwcmV2aW91cyBjaGlsZHJlbiBvZiB0aGUgcm9vdCBlbGVtZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBoMi50ZXh0Q29udGVudCA9ICdIZWxsbydcbiAgICAgICAgdmFyIHByZXZFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcHJldkVsbS5pZCA9ICdpZCc7XG4gICAgICAgIHByZXZFbG0uY2xhc3NOYW1lID0gJ2NsYXNzJztcbiAgICAgICAgcHJldkVsbS5hcHBlbmRDaGlsZChoMik7XG4gICAgICAgIHZhciBuZXh0Vk5vZGUgPSBoKCdkaXYjaWQuY2xhc3MnLCBbaCgnc3BhbicsICdIaScpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHRvVk5vZGUocHJldkVsbSksIG5leHRWTm9kZSkuZWxtO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLCBwcmV2RWxtKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS50YWdOYW1lLCAnRElWJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uaWQsICdpZCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNsYXNzTmFtZSwgJ2NsYXNzJyk7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uY2hpbGROb2Rlcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0udGFnTmFtZSwgJ1NQQU4nKTtcbiAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50LCAnSGknKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2NhbiByZW1vdmUgc29tZSBjaGlsZHJlbiBvZiB0aGUgcm9vdCBlbGVtZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICBoMi50ZXh0Q29udGVudCA9ICdIZWxsbydcbiAgICAgICAgdmFyIHByZXZFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcHJldkVsbS5pZCA9ICdpZCc7XG4gICAgICAgIHByZXZFbG0uY2xhc3NOYW1lID0gJ2NsYXNzJztcbiAgICAgICAgdmFyIHRleHQgPSBuZXcgVGV4dCgnRm9vYmFyJyk7XG4gICAgICAgIHRleHQudGVzdFByb3BlcnR5ID0gZnVuY3Rpb24gKCkge307IC8vIGVuc3VyZXMgd2UgZG9udCByZWNyZWF0ZSB0aGUgVGV4dCBOb2RlXG4gICAgICAgIHByZXZFbG0uYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIHByZXZFbG0uYXBwZW5kQ2hpbGQoaDIpO1xuICAgICAgICB2YXIgbmV4dFZOb2RlID0gaCgnZGl2I2lkLmNsYXNzJywgWydGb29iYXInXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHRvVk5vZGUocHJldkVsbSksIG5leHRWTm9kZSkuZWxtO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLCBwcmV2RWxtKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS50YWdOYW1lLCAnRElWJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uaWQsICdpZCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNsYXNzTmFtZSwgJ2NsYXNzJyk7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uY2hpbGROb2Rlcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0ubm9kZVR5cGUsIDMpO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0ud2hvbGVUZXh0LCAnRm9vYmFyJyk7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2YgZWxtLmNoaWxkTm9kZXNbMF0udGVzdFByb3BlcnR5LCAnZnVuY3Rpb24nKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2NhbiByZW1vdmUgdGV4dCBlbGVtZW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGgyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgICAgaDIudGV4dENvbnRlbnQgPSAnSGVsbG8nXG4gICAgICAgIHZhciBwcmV2RWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHByZXZFbG0uaWQgPSAnaWQnO1xuICAgICAgICBwcmV2RWxtLmNsYXNzTmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIHZhciB0ZXh0ID0gbmV3IFRleHQoJ0Zvb2JhcicpO1xuICAgICAgICBwcmV2RWxtLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICBwcmV2RWxtLmFwcGVuZENoaWxkKGgyKTtcbiAgICAgICAgdmFyIG5leHRWTm9kZSA9IGgoJ2RpdiNpZC5jbGFzcycsIFtoKCdoMicsICdIZWxsbycpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHRvVk5vZGUocHJldkVsbSksIG5leHRWTm9kZSkuZWxtO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLCBwcmV2RWxtKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS50YWdOYW1lLCAnRElWJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uaWQsICdpZCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNsYXNzTmFtZSwgJ2NsYXNzJyk7XG4gICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uY2hpbGROb2Rlcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0ubm9kZVR5cGUsIDEpO1xuICAgICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0udGV4dENvbnRlbnQsICdIZWxsbycpO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICBkZXNjcmliZSgndXBkYXRpbmcgY2hpbGRyZW4gd2l0aCBrZXlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBmdW5jdGlvbiBzcGFuTnVtKG4pIHtcbiAgICAgICAgaWYgKG4gPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBoKCdzcGFuJywge30sIG4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBoKCdzcGFuJywge2tleTogbn0sIG4udG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRlc2NyaWJlKCdhZGRpdGlvbiBvZiBlbGVtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnYXBwZW5kcyBlbGVtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzFdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMSwgMiwgM10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAxKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAzKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzMnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdwcmVwZW5kcyBlbGVtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMSwgMiwgMywgNCwgNV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAyKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzEnLCAnMicsICczJywgJzQnLCAnNSddKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdhZGQgZWxlbWVudHMgaW4gdGhlIG1pZGRsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMSwgMiwgMywgNCwgNV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgNCk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWycxJywgJzInLCAnMycsICc0JywgJzUnXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnYWRkIGVsZW1lbnRzIGF0IGJlZ2luIGFuZCBlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdm5vZGUxID0gaCgnc3BhbicsIFsyLCAzLCA0XS5tYXAoc3Bhbk51bSkpO1xuICAgICAgICAgIHZhciB2bm9kZTIgPSBoKCdzcGFuJywgWzEsIDIsIDMsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgMyk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWycxJywgJzInLCAnMycsICc0JywgJzUnXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnYWRkcyBjaGlsZHJlbiB0byBwYXJlbnQgd2l0aCBubyBjaGlsZHJlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywge2tleTogJ3NwYW4nfSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCB7a2V5OiAnc3Bhbid9LCBbMSwgMiwgM10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAwKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzEnLCAnMicsICczJ10pO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3JlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gcGFyZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCB7a2V5OiAnc3Bhbid9LCBbMSwgMiwgM10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICB2YXIgdm5vZGUyID0gaCgnc3BhbicsIHtrZXk6ICdzcGFuJ30pO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnMScsICcyJywgJzMnXSk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgMCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgndXBkYXRlIG9uZSBjaGlsZCB3aXRoIHNhbWUga2V5IGJ1dCBkaWZmZXJlbnQgc2VsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCB7a2V5OiAnc3Bhbid9LCBbMSwgMiwgM10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICB2YXIgdm5vZGUyID0gaCgnc3BhbicsIHtrZXk6ICdzcGFuJ30sIFtzcGFuTnVtKDEpLCBoKCdpJywge2tleTogMn0sICcyJyksIHNwYW5OdW0oMyldKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzEnLCAnMicsICczJ10pO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnMScsICcyJywgJzMnXSk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDMpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW5bMV0udGFnTmFtZSwgJ0knKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdyZW1vdmFsIG9mIGVsZW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCdyZW1vdmVzIGVsZW1lbnRzIGZyb20gdGhlIGJlZ2lubmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDMsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMywgNCwgNV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA1KTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzMnLCAnNCcsICc1J10pO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3JlbW92ZXMgZWxlbWVudHMgZnJvbSB0aGUgZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCBbMSwgMiwgMywgNCwgNV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICB2YXIgdm5vZGUyID0gaCgnc3BhbicsIFsxLCAyLCAzXS5tYXAoc3Bhbk51bSkpO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDUpO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDMpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MLCAnMScpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW5bMV0uaW5uZXJIVE1MLCAnMicpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW5bMl0uaW5uZXJIVE1MLCAnMycpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3JlbW92ZXMgZWxlbWVudHMgZnJvbSB0aGUgbWlkZGxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCBbMSwgMiwgMywgNCwgNV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICB2YXIgdm5vZGUyID0gaCgnc3BhbicsIFsxLCAyLCA0LCA1XS5tYXAoc3Bhbk51bSkpO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDUpO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDQpO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzQnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzNdLmlubmVySFRNTCwgJzUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdlbGVtZW50IHJlb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ21vdmVzIGVsZW1lbnQgZm9yd2FyZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDMsIDRdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMiwgMywgMSwgNF0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzMnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzNdLmlubmVySFRNTCwgJzQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdtb3ZlcyBlbGVtZW50IHRvIGVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDNdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMiwgMywgMV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAzKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAzKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzMnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdtb3ZlcyBlbGVtZW50IGJhY2t3YXJkcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDMsIDRdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbMSwgNCwgMiwgM10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzQnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzNdLmlubmVySFRNTCwgJzMnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzd2FwcyBmaXJzdCBhbmQgbGFzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDMsIDRdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbNCwgMiwgMywgMV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA0KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzQnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzMnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzNdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdjb21iaW5hdGlvbnMgb2YgYWRkaXRpb25zLCByZW1vdmFscyBhbmQgcmVvcmRlcmluZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ21vdmUgdG8gbGVmdCBhbmQgcmVwbGFjZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDIsIDMsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbNCwgMSwgMiwgMywgNl0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA1KTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCA1KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzBdLmlubmVySFRNTCwgJzQnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzFdLmlubmVySFRNTCwgJzEnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzJdLmlubmVySFRNTCwgJzInKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzNdLmlubmVySFRNTCwgJzMnKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuWzRdLmlubmVySFRNTCwgJzYnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdtb3ZlcyB0byBsZWZ0IGFuZCBsZWF2ZXMgaG9sZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgWzEsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbNCwgNl0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAzKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzQnLCAnNiddKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdoYW5kbGVzIG1vdmVkIGFuZCBzZXQgdG8gdW5kZWZpbmVkIGVsZW1lbnQgZW5kaW5nIGF0IHRoZSBlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdm5vZGUxID0gaCgnc3BhbicsIFsyLCA0LCA1XS5tYXAoc3Bhbk51bSkpO1xuICAgICAgICAgIHZhciB2bm9kZTIgPSBoKCdzcGFuJywgWzQsIDUsIDNdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgMyk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgMyk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlblswXS5pbm5lckhUTUwsICc0Jyk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlblsxXS5pbm5lckhUTUwsICc1Jyk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlblsyXS5pbm5lckhUTUwsICczJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnbW92ZXMgYSBrZXkgaW4gbm9uLWtleWVkIG5vZGVzIHdpdGggYSBzaXplIHVwJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCBbMSwgJ2EnLCAnYicsICdjJ10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICB2YXIgdm5vZGUyID0gaCgnc3BhbicsIFsnZCcsICdhJywgJ2InLCAnYycsIDEsICdlJ10ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlcy5sZW5ndGgsIDQpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0udGV4dENvbnRlbnQsICcxYWJjJyk7XG4gICAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkTm9kZXMubGVuZ3RoLCA2KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLnRleHRDb250ZW50LCAnZGFiYzFlJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBpdCgncmV2ZXJzZXMgZWxlbWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCBbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbOCwgNywgNiwgNSwgNCwgMywgMiwgMV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDgpO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWyc4JywgJzcnLCAnNicsICc1JywgJzQnLCAnMycsICcyJywgJzEnXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzb21ldGhpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ3NwYW4nLCBbMCwgMSwgMiwgMywgNCwgNV0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ3NwYW4nLCBbNCwgMywgMiwgMSwgNSwgMF0ubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDYpO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWyc0JywgJzMnLCAnMicsICcxJywgJzUnLCAnMCddKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2hhbmRsZXMgcmFuZG9tIHNodWZmbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuLCBpLCBhcnIgPSBbXSwgb3BhY2l0aWVzID0gW10sIGVsbXMgPSAxNCwgc2FtcGxlcyA9IDU7XG4gICAgICAgIGZ1bmN0aW9uIHNwYW5OdW1XaXRoT3BhY2l0eShuLCBvKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ3NwYW4nLCB7a2V5OiBuLCBzdHlsZToge29wYWNpdHk6IG99fSwgbi50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKG4gPSAwOyBuIDwgZWxtczsgKytuKSB7IGFycltuXSA9IG47IH1cbiAgICAgICAgZm9yIChuID0gMDsgbiA8IHNhbXBsZXM7ICsrbikge1xuICAgICAgICAgIHZhciB2bm9kZTEgPSBoKCdzcGFuJywgYXJyLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgICByZXR1cm4gc3Bhbk51bVdpdGhPcGFjaXR5KG4sICcxJyk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHZhciBzaHVmQXJyID0gc2h1ZmZsZShhcnIuc2xpY2UoMCkpO1xuICAgICAgICAgIHZhciBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaChlbG0sIHZub2RlMSkuZWxtO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBlbG1zOyArK2kpIHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW5baV0uaW5uZXJIVE1MLCBpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgb3BhY2l0aWVzW2ldID0gTWF0aC5yYW5kb20oKS50b0ZpeGVkKDUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2bm9kZTIgPSBoKCdzcGFuJywgYXJyLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgICByZXR1cm4gc3Bhbk51bVdpdGhPcGFjaXR5KHNodWZBcnJbbl0sIG9wYWNpdGllc1tuXSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGVsbXM7ICsraSkge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbltpXS5pbm5lckhUTUwsIHNodWZBcnJbaV0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwob3BhY2l0aWVzW2ldLmluZGV4T2YoZWxtLmNoaWxkcmVuW2ldLnN0eWxlLm9wYWNpdHkpLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ3N1cHBvcnRzIG51bGwvdW5kZWZpbmVkIGNoaWxkcmVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdpJywgWzAsIDEsIDIsIDMsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdpJywgW251bGwsIDIsIHVuZGVmaW5lZCwgbnVsbCwgMSwgMCwgbnVsbCwgNSwgNCwgbnVsbCwgMywgdW5kZWZpbmVkXS5tYXAoc3Bhbk51bSkpO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgNik7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzInLCAnMScsICcwJywgJzUnLCAnNCcsICczJ10pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc3VwcG9ydHMgYWxsIG51bGwvdW5kZWZpbmVkIGNoaWxkcmVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdpJywgWzAsIDEsIDIsIDMsIDQsIDVdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdpJywgW251bGwsIG51bGwsIHVuZGVmaW5lZCwgbnVsbCwgbnVsbCwgdW5kZWZpbmVkXSk7XG4gICAgICAgIHZhciB2bm9kZTMgPSBoKCdpJywgWzUsIDQsIDMsIDIsIDEsIDBdLm1hcChzcGFuTnVtKSk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZHJlbi5sZW5ndGgsIDApO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTIsIHZub2RlMykuZWxtO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWyc1JywgJzQnLCAnMycsICcyJywgJzEnLCAnMCddKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2hhbmRsZXMgcmFuZG9tIHNodWZmbGVzIHdpdGggbnVsbC91bmRlZmluZWQgY2hpbGRyZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIGosIHIsIGxlbiwgYXJyLCBtYXhBcnJMZW4gPSAxNSwgc2FtcGxlcyA9IDUsIHZub2RlMSA9IHZub2RlMCwgdm5vZGUyO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2FtcGxlczsgKytpLCB2bm9kZTEgPSB2bm9kZTIpIHtcbiAgICAgICAgICBsZW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXhBcnJMZW4pO1xuICAgICAgICAgIGFyciA9IFtdO1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgaWYgKChyID0gTWF0aC5yYW5kb20oKSkgPCAwLjUpIGFycltqXSA9IFN0cmluZyhqKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHIgPCAwLjc1KSBhcnJbal0gPSBudWxsO1xuICAgICAgICAgICAgZWxzZSBhcnJbal0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNodWZmbGUoYXJyKTtcbiAgICAgICAgICB2bm9kZTIgPSBoKCdkaXYnLCBhcnIubWFwKHNwYW5OdW0pKTtcbiAgICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBhcnIuZmlsdGVyKGZ1bmN0aW9uKHgpIHtyZXR1cm4geCAhPSBudWxsO30pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3VwZGF0aW5nIGNoaWxkcmVuIHdpdGhvdXQga2V5cycsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ2FwcGVuZHMgZWxlbWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtoKCdzcGFuJywgJ0hlbGxvJyldKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtoKCdzcGFuJywgJ0hlbGxvJyksIGgoJ3NwYW4nLCAnV29ybGQnKV0pO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWydIZWxsbyddKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnSGVsbG8nLCAnV29ybGQnXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdoYW5kbGVzIHVubW92ZWQgdGV4dCBub2RlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgWydUZXh0JywgaCgnc3BhbicsICdTcGFuJyldKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFsnVGV4dCcsIGgoJ3NwYW4nLCAnU3BhbicpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ1RleHQnKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50LCAnVGV4dCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaGFuZGxlcyBjaGFuZ2luZyB0ZXh0IGNoaWxkcmVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbJ1RleHQnLCBoKCdzcGFuJywgJ1NwYW4nKV0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgWydUZXh0MicsIGgoJ3NwYW4nLCAnU3BhbicpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ1RleHQnKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50LCAnVGV4dDInKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2hhbmRsZXMgdW5tb3ZlZCBjb21tZW50IG5vZGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbaCgnIScsICdUZXh0JyksIGgoJ3NwYW4nLCAnU3BhbicpXSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbaCgnIScsICdUZXh0JyksIGgoJ3NwYW4nLCAnU3BhbicpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ1RleHQnKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50LCAnVGV4dCcpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaGFuZGxlcyBjaGFuZ2luZyBjb21tZW50IHRleHQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtoKCchJywgJ1RleHQnKSwgaCgnc3BhbicsICdTcGFuJyldKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtoKCchJywgJ1RleHQyJyksIGgoJ3NwYW4nLCAnU3BhbicpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ1RleHQnKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50LCAnVGV4dDInKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2hhbmRsZXMgY2hhbmdpbmcgZW1wdHkgY29tbWVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW2goJyEnKSwgaCgnc3BhbicsICdTcGFuJyldKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtoKCchJywgJ1Rlc3QnKSwgaCgnc3BhbicsICdTcGFuJyldKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50LCAnJyk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ1Rlc3QnKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3ByZXBlbmRzIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtoKCdzcGFuJywgJ1dvcmxkJyldKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtoKCdzcGFuJywgJ0hlbGxvJyksIGgoJ3NwYW4nLCAnV29ybGQnKV0pO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWydXb3JsZCddKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnSGVsbG8nLCAnV29ybGQnXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdwcmVwZW5kcyBlbGVtZW50IG9mIGRpZmZlcmVudCB0YWcgdHlwZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW2goJ3NwYW4nLCAnV29ybGQnKV0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW2goJ2RpdicsICdIZWxsbycpLCBoKCdzcGFuJywgJ1dvcmxkJyldKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnV29ybGQnXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKHByb3AoJ3RhZ05hbWUnKSwgZWxtLmNoaWxkcmVuKSwgWydESVYnLCAnU1BBTiddKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnSGVsbG8nLCAnV29ybGQnXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdyZW1vdmVzIGVsZW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbaCgnc3BhbicsICdPbmUnKSwgaCgnc3BhbicsICdUd28nKSwgaCgnc3BhbicsICdUaHJlZScpXSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbaCgnc3BhbicsICdPbmUnKSwgaCgnc3BhbicsICdUaHJlZScpXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJ09uZScsICdUd28nLCAnVGhyZWUnXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJ09uZScsICdUaHJlZSddKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3JlbW92ZXMgYSBzaW5nbGUgdGV4dCBub2RlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCAnT25lJyk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnKTtcbiAgICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLnRleHRDb250ZW50LCAnT25lJyk7XG4gICAgICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS50ZXh0Q29udGVudCwgJycpO1xuICAgICAgfSk7XG4gICAgICBpdCgncmVtb3ZlcyBhIHNpbmdsZSB0ZXh0IG5vZGUgd2hlbiBjaGlsZHJlbiBhcmUgdXBkYXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgJ09uZScpO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgWyBoKCdkaXYnLCAnVHdvJyksIGgoJ3NwYW4nLCAnVGhyZWUnKSBdKTtcbiAgICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLnRleHRDb250ZW50LCAnT25lJyk7XG4gICAgICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAocHJvcCgndGV4dENvbnRlbnQnKSwgZWxtLmNoaWxkTm9kZXMpLCBbJ1R3bycsICdUaHJlZSddKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3JlbW92ZXMgYSB0ZXh0IG5vZGUgYW1vbmcgb3RoZXIgZWxlbWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFsgJ09uZScsIGgoJ3NwYW4nLCAnVHdvJykgXSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbIGgoJ2RpdicsICdUaHJlZScpXSk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAocHJvcCgndGV4dENvbnRlbnQnKSwgZWxtLmNoaWxkTm9kZXMpLCBbJ09uZScsICdUd28nXSk7XG4gICAgICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGVsbS5jaGlsZE5vZGVzLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50YWdOYW1lLCAnRElWJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ1RocmVlJyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdyZW9yZGVycyBlbGVtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW2goJ3NwYW4nLCAnT25lJyksIGgoJ2RpdicsICdUd28nKSwgaCgnYicsICdUaHJlZScpXSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbaCgnYicsICdUaHJlZScpLCBoKCdzcGFuJywgJ09uZScpLCBoKCdkaXYnLCAnVHdvJyldKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnT25lJywgJ1R3bycsICdUaHJlZSddKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAocHJvcCgndGFnTmFtZScpLCBlbG0uY2hpbGRyZW4pLCBbJ0InLCAnU1BBTicsICdESVYnXSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJ1RocmVlJywgJ09uZScsICdUd28nXSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzdXBwb3J0cyBudWxsL3VuZGVmaW5lZCBjaGlsZHJlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnaScsIFtudWxsLCBoKCdpJywgJzEnKSwgaCgnaScsICcyJyksIG51bGxdKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2knLCBbaCgnaScsICcyJyksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBoKCdpJywgJzEnKSwgdW5kZWZpbmVkXSk7XG4gICAgICAgIHZhciB2bm9kZTMgPSBoKCdpJywgW251bGwsIGgoJ2knLCAnMScpLCB1bmRlZmluZWQsIG51bGwsIGgoJ2knLCAnMicpLCB1bmRlZmluZWQsIG51bGxdKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnMScsICcyJ10pO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcChpbm5lciwgZWxtLmNoaWxkcmVuKSwgWycyJywgJzEnXSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMiwgdm5vZGUzKS5lbG07XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFwKGlubmVyLCBlbG0uY2hpbGRyZW4pLCBbJzEnLCAnMiddKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3N1cHBvcnRzIGFsbCBudWxsL3VuZGVmaW5lZCBjaGlsZHJlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnaScsIFtoKCdpJywgJzEnKSwgaCgnaScsICcyJyldKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2knLCBbbnVsbCwgdW5kZWZpbmVkXSk7XG4gICAgICAgIHZhciB2bm9kZTMgPSBoKCdpJywgW2goJ2knLCAnMicpLCBoKCdpJywgJzEnKV0pO1xuICAgICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAwKTtcbiAgICAgICAgZWxtID0gcGF0Y2godm5vZGUyLCB2bm9kZTMpLmVsbTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXAoaW5uZXIsIGVsbS5jaGlsZHJlbiksIFsnMicsICcxJ10pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnaG9va3MnLCBmdW5jdGlvbigpIHtcbiAgICBkZXNjcmliZSgnZWxlbWVudCBob29rcycsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ2NhbGxzIGBjcmVhdGVgIGxpc3RlbmVyIGJlZm9yZSBpbnNlcnRlZCBpbnRvIHBhcmVudCBidXQgYWZ0ZXIgY2hpbGRyZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBjYihlbXB0eSwgdm5vZGUpIHtcbiAgICAgICAgICBhc3NlcnQodm5vZGUuZWxtIGluc3RhbmNlb2YgRWxlbWVudCk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHZub2RlLmVsbS5jaGlsZHJlbi5sZW5ndGgsIDIpO1xuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh2bm9kZS5lbG0ucGFyZW50Tm9kZSwgbnVsbCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godm5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbXG4gICAgICAgICAgaCgnc3BhbicsICdGaXJzdCBzaWJsaW5nJyksXG4gICAgICAgICAgaCgnZGl2Jywge2hvb2s6IHtjcmVhdGU6IGNifX0sIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMScpLFxuICAgICAgICAgICAgaCgnc3BhbicsICdDaGlsZCAyJyksXG4gICAgICAgICAgXSksXG4gICAgICAgICAgaCgnc3BhbicsICdDYW5cXCd0IHRvdWNoIG1lJyksXG4gICAgICAgIF0pO1xuICAgICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbCgxLCByZXN1bHQubGVuZ3RoKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2NhbGxzIGBpbnNlcnRgIGxpc3RlbmVyIGFmdGVyIGJvdGggcGFyZW50cywgc2libGluZ3MgYW5kIGNoaWxkcmVuIGhhdmUgYmVlbiBpbnNlcnRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZ1bmN0aW9uIGNiKHZub2RlKSB7XG4gICAgICAgICAgYXNzZXJ0KHZub2RlLmVsbSBpbnN0YW5jZW9mIEVsZW1lbnQpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbCh2bm9kZS5lbG0uY2hpbGRyZW4ubGVuZ3RoLCAyKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwodm5vZGUuZWxtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoLCAzKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2bm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgICAgICBoKCdzcGFuJywgJ0ZpcnN0IHNpYmxpbmcnKSxcbiAgICAgICAgICBoKCdkaXYnLCB7aG9vazoge2luc2VydDogY2J9fSwgW1xuICAgICAgICAgICAgaCgnc3BhbicsICdDaGlsZCAxJyksXG4gICAgICAgICAgICBoKCdzcGFuJywgJ0NoaWxkIDInKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBoKCdzcGFuJywgJ0NhbiB0b3VjaCBtZScpLFxuICAgICAgICBdKTtcbiAgICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoMSwgcmVzdWx0Lmxlbmd0aCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdjYWxscyBgcHJlcGF0Y2hgIGxpc3RlbmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gY2Iob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKG9sZFZub2RlLCB2bm9kZTEuY2hpbGRyZW5bMV0pO1xuICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh2bm9kZSwgdm5vZGUyLmNoaWxkcmVuWzFdKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2bm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgICAgICBoKCdzcGFuJywgJ0ZpcnN0IHNpYmxpbmcnKSxcbiAgICAgICAgICBoKCdkaXYnLCB7aG9vazoge3ByZXBhdGNoOiBjYn19LCBbXG4gICAgICAgICAgICBoKCdzcGFuJywgJ0NoaWxkIDEnKSxcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMicpLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtcbiAgICAgICAgICBoKCdzcGFuJywgJ0ZpcnN0IHNpYmxpbmcnKSxcbiAgICAgICAgICBoKCdkaXYnLCB7aG9vazoge3ByZXBhdGNoOiBjYn19LCBbXG4gICAgICAgICAgICBoKCdzcGFuJywgJ0NoaWxkIDEnKSxcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMicpLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdKTtcbiAgICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQubGVuZ3RoLCAxKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2NhbGxzIGBwb3N0cGF0Y2hgIGFmdGVyIGBwcmVwYXRjaGAgbGlzdGVuZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHByZSA9IFtdLCBwb3N0ID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHByZUNiKG9sZFZub2RlLCB2bm9kZSkge1xuICAgICAgICAgIHByZS5wdXNoKHByZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9zdENiKG9sZFZub2RlLCB2bm9kZSkge1xuICAgICAgICAgIGFzc2VydC5lcXVhbChwcmUubGVuZ3RoLCBwb3N0Lmxlbmd0aCArIDEpO1xuICAgICAgICAgIHBvc3QucHVzaChwb3N0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3Qgc2libGluZycpLFxuICAgICAgICAgIGgoJ2RpdicsIHtob29rOiB7cHJlcGF0Y2g6IHByZUNiLCBwb3N0cGF0Y2g6IHBvc3RDYn19LCBbXG4gICAgICAgICAgICBoKCdzcGFuJywgJ0NoaWxkIDEnKSxcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMicpLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtcbiAgICAgICAgICBoKCdzcGFuJywgJ0ZpcnN0IHNpYmxpbmcnKSxcbiAgICAgICAgICBoKCdkaXYnLCB7aG9vazoge3ByZXBhdGNoOiBwcmVDYiwgcG9zdHBhdGNoOiBwb3N0Q2J9fSwgW1xuICAgICAgICAgICAgaCgnc3BhbicsICdDaGlsZCAxJyksXG4gICAgICAgICAgICBoKCdzcGFuJywgJ0NoaWxkIDInKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgICBhc3NlcnQuZXF1YWwocHJlLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChwb3N0Lmxlbmd0aCwgMSk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdjYWxscyBgdXBkYXRlYCBsaXN0ZW5lcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzdWx0MSA9IFtdO1xuICAgICAgICB2YXIgcmVzdWx0MiA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBjYihyZXN1bHQsIG9sZFZub2RlLCB2bm9kZSkge1xuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2cob2xkVm5vZGUpO1xuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdLCBvbGRWbm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKHZub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3Qgc2libGluZycpLFxuICAgICAgICAgIGgoJ2RpdicsIHtob29rOiB7dXBkYXRlOiBjYi5iaW5kKG51bGwsIHJlc3VsdDEpfX0sIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMScpLFxuICAgICAgICAgICAgaCgnc3BhbicsIHtob29rOiB7dXBkYXRlOiBjYi5iaW5kKG51bGwsIHJlc3VsdDIpfX0sICdDaGlsZCAyJyksXG4gICAgICAgICAgXSksXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3Qgc2libGluZycpLFxuICAgICAgICAgIGgoJ2RpdicsIHtob29rOiB7dXBkYXRlOiBjYi5iaW5kKG51bGwsIHJlc3VsdDEpfX0sIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMScpLFxuICAgICAgICAgICAgaCgnc3BhbicsIHtob29rOiB7dXBkYXRlOiBjYi5iaW5kKG51bGwsIHJlc3VsdDIpfX0sICdDaGlsZCAyJyksXG4gICAgICAgICAgXSksXG4gICAgICAgIF0pO1xuICAgICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdDEubGVuZ3RoLCAxKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdDIubGVuZ3RoLCAxKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2NhbGxzIGByZW1vdmVgIGxpc3RlbmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gY2Iodm5vZGUsIHJtKSB7XG4gICAgICAgICAgdmFyIHBhcmVudCA9IHZub2RlLmVsbS5wYXJlbnROb2RlO1xuICAgICAgICAgIGFzc2VydCh2bm9kZS5lbG0gaW5zdGFuY2VvZiBFbGVtZW50KTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwodm5vZGUuZWxtLmNoaWxkcmVuLmxlbmd0aCwgMik7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHBhcmVudC5jaGlsZHJlbi5sZW5ndGgsIDIpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZub2RlKTtcbiAgICAgICAgICBybSgpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoLCAxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3Qgc2libGluZycpLFxuICAgICAgICAgIGgoJ2RpdicsIHtob29rOiB7cmVtb3ZlOiBjYn19LCBbXG4gICAgICAgICAgICBoKCdzcGFuJywgJ0NoaWxkIDEnKSxcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMicpLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtcbiAgICAgICAgICBoKCdzcGFuJywgJ0ZpcnN0IHNpYmxpbmcnKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoMSwgcmVzdWx0Lmxlbmd0aCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdjYWxscyBgaW5pdGAgYW5kIGBwcmVwYXRjaGAgbGlzdGVuZXJzIG9uIHJvb3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgIGZ1bmN0aW9uIGluaXQodm5vZGUpIHtcbiAgICAgICAgICAgIGFzc2VydC5zdHJpY3RFcXVhbCh2bm9kZSwgdm5vZGUyKTtcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZ1bmN0aW9uIHByZXBhdGNoKG9sZFZub2RlLCB2bm9kZSkge1xuICAgICAgICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKHZub2RlLCB2bm9kZTEpO1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtob29rOiB7aW5pdDogaW5pdCwgcHJlcGF0Y2g6IHByZXBhdGNofX0pO1xuICAgICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoMSwgY291bnQpO1xuICAgICAgICAgIHZhciB2bm9kZTIgPSBoKCdzcGFuJywge2hvb2s6IHtpbml0OiBpbml0LCBwcmVwYXRjaDogcHJlcGF0Y2h9fSk7XG4gICAgICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbCgyLCBjb3VudCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdyZW1vdmVzIGVsZW1lbnQgd2hlbiBhbGwgcmVtb3ZlIGxpc3RlbmVycyBhcmUgZG9uZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcm0xLCBybTIsIHJtMztcbiAgICAgICAgdmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG4gICAgICAgICAge3JlbW92ZTogZnVuY3Rpb24oXywgcm0pIHsgcm0xID0gcm07IH19LFxuICAgICAgICAgIHtyZW1vdmU6IGZ1bmN0aW9uKF8sIHJtKSB7IHJtMiA9IHJtOyB9fSxcbiAgICAgICAgXSk7XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbaCgnYScsIHtob29rOiB7cmVtb3ZlOiBmdW5jdGlvbihfLCBybSkgeyBybTMgPSBybTsgfX19KV0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW10pO1xuICAgICAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgICAgICBhc3NlcnQuZXF1YWwoZWxtLmNoaWxkcmVuLmxlbmd0aCwgMSk7XG4gICAgICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAxKTtcbiAgICAgICAgcm0xKCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAxKTtcbiAgICAgICAgcm0zKCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAxKTtcbiAgICAgICAgcm0yKCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChlbG0uY2hpbGRyZW4ubGVuZ3RoLCAwKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2ludm9rZXMgcmVtb3ZlIGhvb2sgb24gcmVwbGFjZWQgcm9vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyIHZub2RlMCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm5vZGUwKTtcbiAgICAgICAgZnVuY3Rpb24gY2Iodm5vZGUsIHJtKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godm5vZGUpO1xuICAgICAgICAgIHJtKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtob29rOiB7cmVtb3ZlOiBjYn19LCBbXG4gICAgICAgICAgaCgnYicsICdDaGlsZCAxJyksXG4gICAgICAgICAgaCgnaScsICdDaGlsZCAyJyksXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnc3BhbicsIFtcbiAgICAgICAgICBoKCdiJywgJ0NoaWxkIDEnKSxcbiAgICAgICAgICBoKCdpJywgJ0NoaWxkIDInKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoMSwgcmVzdWx0Lmxlbmd0aCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnbW9kdWxlIGhvb2tzJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnaW52b2tlcyBgcHJlYCBhbmQgYHBvc3RgIGhvb2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgcGF0Y2ggPSBzbmFiYmRvbS5pbml0KFtcbiAgICAgICAgICB7cHJlOiBmdW5jdGlvbigpIHsgcmVzdWx0LnB1c2goJ3ByZScpOyB9fSxcbiAgICAgICAgICB7cG9zdDogZnVuY3Rpb24oKSB7IHJlc3VsdC5wdXNoKCdwb3N0Jyk7IH19LFxuICAgICAgICBdKTtcbiAgICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicpO1xuICAgICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0LCBbJ3ByZScsICdwb3N0J10pO1xuICAgICAgfSk7XG4gICAgICBpdCgnaW52b2tlcyBnbG9iYWwgYGRlc3Ryb3lgIGhvb2sgZm9yIGFsbCByZW1vdmVkIGNoaWxkcmVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gY2Iodm5vZGUpIHsgcmVzdWx0LnB1c2godm5vZGUpOyB9XG4gICAgICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbXG4gICAgICAgICAgaCgnc3BhbicsICdGaXJzdCBzaWJsaW5nJyksXG4gICAgICAgICAgaCgnZGl2JywgW1xuICAgICAgICAgICAgaCgnc3BhbicsIHtob29rOiB7ZGVzdHJveTogY2J9fSwgJ0NoaWxkIDEnKSxcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMicpLFxuICAgICAgICAgIF0pLFxuICAgICAgICBdKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicpO1xuICAgICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdC5sZW5ndGgsIDEpO1xuICAgICAgfSk7XG4gICAgICBpdCgnaGFuZGxlcyB0ZXh0IHZub2RlcyB3aXRoIGB1bmRlZmluZWRgIGBkYXRhYCBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgICcgJ1xuICAgICAgICBdKTtcbiAgICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtdKTtcbiAgICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgICB9KTtcbiAgICAgIGl0KCdpbnZva2VzIGBkZXN0cm95YCBtb2R1bGUgaG9vayBmb3IgYWxsIHJlbW92ZWQgY2hpbGRyZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNyZWF0ZWQgPSAwO1xuICAgICAgICB2YXIgZGVzdHJveWVkID0gMDtcbiAgICAgICAgdmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG4gICAgICAgICAge2NyZWF0ZTogZnVuY3Rpb24oKSB7IGNyZWF0ZWQrKzsgfX0sXG4gICAgICAgICAge2Rlc3Ryb3k6IGZ1bmN0aW9uKCkgeyBkZXN0cm95ZWQrKzsgfX0sXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3Qgc2libGluZycpLFxuICAgICAgICAgIGgoJ2RpdicsIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMScpLFxuICAgICAgICAgICAgaCgnc3BhbicsICdDaGlsZCAyJyksXG4gICAgICAgICAgXSksXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2Jyk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoY3JlYXRlZCwgNCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChkZXN0cm95ZWQsIDQpO1xuICAgICAgfSk7XG4gICAgICBpdCgnZG9lcyBub3QgaW52b2tlIGBjcmVhdGVgIGFuZCBgcmVtb3ZlYCBtb2R1bGUgaG9vayBmb3IgdGV4dCBub2RlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3JlYXRlZCA9IDA7XG4gICAgICAgIHZhciByZW1vdmVkID0gMDtcbiAgICAgICAgdmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG4gICAgICAgICAge2NyZWF0ZTogZnVuY3Rpb24oKSB7IGNyZWF0ZWQrKzsgfX0sXG4gICAgICAgICAge3JlbW92ZTogZnVuY3Rpb24oKSB7IHJlbW92ZWQrKzsgfX0sXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3QgY2hpbGQnKSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBoKCdzcGFuJywgJ1RoaXJkIGNoaWxkJyksXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUyID0gaCgnZGl2Jyk7XG4gICAgICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoY3JlYXRlZCwgMik7XG4gICAgICAgIGFzc2VydC5lcXVhbChyZW1vdmVkLCAyKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ2RvZXMgbm90IGludm9rZSBgZGVzdHJveWAgbW9kdWxlIGhvb2sgZm9yIHRleHQgbm9kZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNyZWF0ZWQgPSAwO1xuICAgICAgICB2YXIgZGVzdHJveWVkID0gMDtcbiAgICAgICAgdmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG4gICAgICAgICAge2NyZWF0ZTogZnVuY3Rpb24oKSB7IGNyZWF0ZWQrKzsgfX0sXG4gICAgICAgICAge2Rlc3Ryb3k6IGZ1bmN0aW9uKCkgeyBkZXN0cm95ZWQrKzsgfX0sXG4gICAgICAgIF0pO1xuICAgICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICAgIGgoJ3NwYW4nLCAnRmlyc3Qgc2libGluZycpLFxuICAgICAgICAgIGgoJ2RpdicsIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCAnQ2hpbGQgMScpLFxuICAgICAgICAgICAgaCgnc3BhbicsIFsnVGV4dCAxJywgJ1RleHQgMiddKSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnKTtcbiAgICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgICAgIGFzc2VydC5lcXVhbChjcmVhdGVkLCA0KTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGRlc3Ryb3llZCwgNCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdzaG9ydCBjaXJjdWl0aW5nJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2RvZXMgbm90IHVwZGF0ZSBzdHJpY3RseSBlcXVhbCB2bm9kZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIGZ1bmN0aW9uIGNiKHZub2RlKSB7IHJlc3VsdC5wdXNoKHZub2RlKTsgfVxuICAgICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgICAgaCgnc3BhbicsIHtob29rOiB7dXBkYXRlOiBjYn19LCAnSGVsbG8nKSxcbiAgICAgICAgaCgnc3BhbicsICd0aGVyZScpLFxuICAgICAgXSk7XG4gICAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgICBwYXRjaCh2bm9kZTEsIHZub2RlMSk7XG4gICAgICBhc3NlcnQuZXF1YWwocmVzdWx0Lmxlbmd0aCwgMCk7XG4gICAgfSk7XG4gICAgaXQoJ2RvZXMgbm90IHVwZGF0ZSBzdHJpY3RseSBlcXVhbCBjaGlsZHJlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgZnVuY3Rpb24gY2Iodm5vZGUpIHsgcmVzdWx0LnB1c2godm5vZGUpOyB9XG4gICAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgICBoKCdzcGFuJywge2hvb2s6IHtwYXRjaDogY2J9fSwgJ0hlbGxvJyksXG4gICAgICAgIGgoJ3NwYW4nLCAndGhlcmUnKSxcbiAgICAgIF0pO1xuICAgICAgdmFyIHZub2RlMiA9IGgoJ2RpdicpO1xuICAgICAgdm5vZGUyLmNoaWxkcmVuID0gdm5vZGUxLmNoaWxkcmVuO1xuICAgICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdC5sZW5ndGgsIDApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xudmFyIGZha2VSYWYgPSByZXF1aXJlKCdmYWtlLXJhZicpO1xuXG52YXIgc25hYmJkb20gPSByZXF1aXJlKCcuLi9zbmFiYmRvbScpO1xuZmFrZVJhZi51c2UoKTtcbnZhciBwYXRjaCA9IHNuYWJiZG9tLmluaXQoW1xuICByZXF1aXJlKCcuLi9tb2R1bGVzL2RhdGFzZXQnKS5kZWZhdWx0LFxuXSk7XG52YXIgaCA9IHJlcXVpcmUoJy4uL2gnKS5kZWZhdWx0O1xuXG5kZXNjcmliZSgnZGF0YXNldCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgZWxtLCB2bm9kZTA7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdm5vZGUwID0gZWxtO1xuICB9KTtcbiAgaXQoJ2lzIHNldCBvbiBpbml0aWFsIGVsZW1lbnQgY3JlYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIGgoJ2RpdicsIHtkYXRhc2V0OiB7Zm9vOiAnZm9vJ319KSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5mb28sICdmb28nKTtcbiAgfSk7XG4gIGl0KCd1cGRhdGVzIGRhdGFzZXQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnaScsIHtkYXRhc2V0OiB7Zm9vOiAnZm9vJywgYmFyOiAnYmFyJ319KTtcbiAgICB2YXIgdm5vZGUyID0gaCgnaScsIHtkYXRhc2V0OiB7YmF6OiAnYmF6J319KTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5mb28sICdmb28nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmRhdGFzZXQuYmFyLCAnYmFyJyk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmRhdGFzZXQuYmF6LCAnYmF6Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5kYXRhc2V0LmZvbywgdW5kZWZpbmVkKTtcbiAgfSk7XG4gIGl0KCdjYW4gYmUgbWVtb2l6ZWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FjaGVkRGF0YXNldCA9IHtmb286ICdmb28nLCBiYXI6ICdiYXInfTtcbiAgICB2YXIgdm5vZGUxID0gaCgnaScsIHtkYXRhc2V0OiBjYWNoZWREYXRhc2V0fSk7XG4gICAgdmFyIHZub2RlMiA9IGgoJ2knLCB7ZGF0YXNldDogY2FjaGVkRGF0YXNldH0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5kYXRhc2V0LmZvbywgJ2ZvbycpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5iYXIsICdiYXInKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5mb28sICdmb28nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmRhdGFzZXQuYmFyLCAnYmFyJyk7XG4gIH0pO1xuICBpdCgnaGFuZGxlcyBzdHJpbmcgY29udmVyc2lvbnMnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnaScsIHtkYXRhc2V0OiB7ZW1wdHk6ICcnLCBkYXNoOiAnLScsIGRhc2hlZDonZm9vLWJhcicsIGNhbWVsOiAnZm9vQmFyJywgaW50ZWdlcjowLCBmbG9hdDowLjF9fSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcblxuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5lbXB0eSwgJycpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5kYXNoLCAnLScpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZGF0YXNldC5kYXNoZWQsICdmb28tYmFyJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5kYXRhc2V0LmNhbWVsLCAnZm9vQmFyJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5kYXRhc2V0LmludGVnZXIsICcwJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5kYXRhc2V0LmZsb2F0LCAnMC4xJyk7XG4gIH0pO1xuXG59KTtcblxuZmFrZVJhZi5yZXN0b3JlKCk7XG4iLCJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbnZhciBzbmFiYmRvbSA9IHJlcXVpcmUoJy4uL3NuYWJiZG9tJyk7XG52YXIgcGF0Y2ggPSBzbmFiYmRvbS5pbml0KFtcbiAgcmVxdWlyZSgnLi4vbW9kdWxlcy9ldmVudGxpc3RlbmVycy5qcycpLmRlZmF1bHQsXG5dKTtcbnZhciBoID0gcmVxdWlyZSgnLi4vaCcpLmRlZmF1bHQ7XG5cbmRlc2NyaWJlKCdldmVudCBsaXN0ZW5lcnMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGVsbSwgdm5vZGUwO1xuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZub2RlMCA9IGVsbTtcbiAgfSk7XG4gIGl0KCdhdHRhY2hlcyBjbGljayBldmVudCBoYW5kbGVyIHRvIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZnVuY3Rpb24gY2xpY2tlZChldikgeyByZXN1bHQucHVzaChldik7IH1cbiAgICB2YXIgdm5vZGUgPSBoKCdkaXYnLCB7b246IHtjbGljazogY2xpY2tlZH19LCBbXG4gICAgICBoKCdhJywgJ0NsaWNrIG15IHBhcmVudCcpLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUpLmVsbTtcbiAgICBlbG0uY2xpY2soKTtcbiAgICBhc3NlcnQuZXF1YWwoMSwgcmVzdWx0Lmxlbmd0aCk7XG4gIH0pO1xuICBpdCgnZG9lcyBub3QgYXR0YWNoIG5ldyBsaXN0ZW5lcicsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAvL2Z1bmN0aW9uIGNsaWNrZWQoZXYpIHsgcmVzdWx0LnB1c2goZXYpOyB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBmdW5jdGlvbihldikgeyByZXN1bHQucHVzaCgxKTsgfX19LCBbXG4gICAgICBoKCdhJywgJ0NsaWNrIG15IHBhcmVudCcpLFxuICAgIF0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCB7b246IHtjbGljazogZnVuY3Rpb24oZXYpIHsgcmVzdWx0LnB1c2goMik7IH19fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgZWxtLmNsaWNrKCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQsIFsxLCAyXSk7XG4gIH0pO1xuICBpdCgnZG9lcyBjYWxscyBoYW5kbGVyIGZvciBmdW5jdGlvbiBpbiBhcnJheScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmdW5jdGlvbiBjbGlja2VkKGV2KSB7IHJlc3VsdC5wdXNoKGV2KTsgfVxuICAgIHZhciB2bm9kZSA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBbY2xpY2tlZCwgMV19fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlKS5lbG07XG4gICAgZWxtLmNsaWNrKCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQsIFsxXSk7XG4gIH0pO1xuICBpdCgnaGFuZGxlcyBjaGFuZ2VkIHZhbHVlIGluIGFycmF5JywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZ1bmN0aW9uIGNsaWNrZWQoZXYpIHsgcmVzdWx0LnB1c2goZXYpOyB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBbY2xpY2tlZCwgMV19fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2Jywge29uOiB7Y2xpY2s6IFtjbGlja2VkLCAyXX19LCBbXG4gICAgICBoKCdhJywgJ0NsaWNrIG15IHBhcmVudCcpLFxuICAgIF0pO1xuICAgIHZhciB2bm9kZTMgPSBoKCdkaXYnLCB7b246IHtjbGljazogW2NsaWNrZWQsIDNdfX0sIFtcbiAgICAgIGgoJ2EnLCAnQ2xpY2sgbXkgcGFyZW50JyksXG4gICAgXSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBlbG0uY2xpY2soKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMiwgdm5vZGUzKS5lbG07XG4gICAgZWxtLmNsaWNrKCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQsIFsxLCAyLCAzXSk7XG4gIH0pO1xuICBpdCgnaGFuZGxlcyBjaGFuZ2VkIHNldmVyYWwgdmFsdWVzIGluIGFycmF5JywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZ1bmN0aW9uIGNsaWNrZWQoKSB7IHJlc3VsdC5wdXNoKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwLCBhcmd1bWVudHMubGVuZ3RoLTIpKTsgfVxuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCB7b246IHtjbGljazogW2NsaWNrZWQsIDEsIDIsIDNdfX0sIFtcbiAgICAgIGgoJ2EnLCAnQ2xpY2sgbXkgcGFyZW50JyksXG4gICAgXSk7XG4gICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBbY2xpY2tlZCwgMSwgMl19fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUzID0gaCgnZGl2Jywge29uOiB7Y2xpY2s6IFtjbGlja2VkLCAyLCAzXX19LCBbXG4gICAgICBoKCdhJywgJ0NsaWNrIG15IHBhcmVudCcpLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgZWxtLmNsaWNrKCk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBlbG0uY2xpY2soKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTIsIHZub2RlMykuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocmVzdWx0LCBbWzEsIDIsIDNdLCBbMSwgMl0sIFsyLCAzXV0pO1xuICB9KTtcbiAgaXQoJ2RldGFjaCBhdHRhY2hlZCBjbGljayBldmVudCBoYW5kbGVyIHRvIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZnVuY3Rpb24gY2xpY2tlZChldikgeyByZXN1bHQucHVzaChldik7IH1cbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2Jywge29uOiB7Y2xpY2s6IGNsaWNrZWR9fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGFzc2VydC5lcXVhbCgxLCByZXN1bHQubGVuZ3RoKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2Jywge29uOiB7fX0sIFtcbiAgICAgIGgoJ2EnLCAnQ2xpY2sgbXkgcGFyZW50JyksXG4gICAgXSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBlbG0uY2xpY2soKTtcbiAgICBhc3NlcnQuZXF1YWwoMSwgcmVzdWx0Lmxlbmd0aCk7XG4gIH0pO1xuICBpdCgnbXVsdGlwbGUgZXZlbnQgaGFuZGxlcnMgZm9yIHNhbWUgZXZlbnQgb24gc2FtZSBlbGVtZW50JywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZ1bmN0aW9uIGNsaWNrZWQoZXYpIHsgcmVzdWx0LnB1c2goZXYpOyB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBbW2NsaWNrZWRdLCBbY2xpY2tlZF0sIFtjbGlja2VkXV19fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGFzc2VydC5lcXVhbCgzLCByZXN1bHQubGVuZ3RoKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2Jywge29uOiB7Y2xpY2s6IFtbY2xpY2tlZF0sIFtjbGlja2VkXV19fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGFzc2VydC5lcXVhbCg1LCByZXN1bHQubGVuZ3RoKTtcbiAgfSk7XG4gIGl0KCdhY2Nlc3MgdG8gdmlydHVhbCBub2RlIGluIGV2ZW50IGhhbmRsZXInLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZnVuY3Rpb24gY2xpY2tlZChldiwgdm5vZGUpIHsgcmVzdWx0LnB1c2godGhpcyk7IHJlc3VsdC5wdXNoKHZub2RlKTsgfVxuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCB7b246IHtjbGljazogY2xpY2tlZCB9fSwgW1xuICAgICAgaCgnYScsICdDbGljayBteSBwYXJlbnQnKSxcbiAgICBdKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGVsbS5jbGljaygpO1xuICAgIGFzc2VydC5lcXVhbCgyLCByZXN1bHQubGVuZ3RoKTtcbiAgICBhc3NlcnQuZXF1YWwodm5vZGUxLCByZXN1bHRbMF0pO1xuICAgIGFzc2VydC5lcXVhbCh2bm9kZTEsIHJlc3VsdFsxXSk7XG4gIH0pLFxuICBpdCgnYWNjZXNzIHRvIHZpcnR1YWwgbm9kZSBpbiBldmVudCBoYW5kbGVyIHdpdGggYXJndW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZnVuY3Rpb24gY2xpY2tlZChhcmcsIGV2LCB2bm9kZSkgeyByZXN1bHQucHVzaCh0aGlzKTsgcmVzdWx0LnB1c2godm5vZGUpOyB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBbY2xpY2tlZCwgMV0gfX0sIFtcbiAgICAgIGgoJ2EnLCAnQ2xpY2sgbXkgcGFyZW50JyksXG4gICAgXSk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBlbG0uY2xpY2soKTtcbiAgICBhc3NlcnQuZXF1YWwoMiwgcmVzdWx0Lmxlbmd0aCk7XG4gICAgYXNzZXJ0LmVxdWFsKHZub2RlMSwgcmVzdWx0WzBdKTtcbiAgICBhc3NlcnQuZXF1YWwodm5vZGUxLCByZXN1bHRbMV0pO1xuICB9KSxcbiAgaXQoJ2FjY2VzcyB0byB2aXJ0dWFsIG5vZGUgaW4gZXZlbnQgaGFuZGxlciB3aXRoIGFyZ3VtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmdW5jdGlvbiBjbGlja2VkKGFyZzEsIGFyZzIsIGV2LCB2bm9kZSkgeyByZXN1bHQucHVzaCh0aGlzKTsgcmVzdWx0LnB1c2godm5vZGUpOyB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIHtvbjoge2NsaWNrOiBbY2xpY2tlZCwgMSwgXCIyXCJdIH19LCBbXG4gICAgICBoKCdhJywgJ0NsaWNrIG15IHBhcmVudCcpLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgZWxtLmNsaWNrKCk7XG4gICAgYXNzZXJ0LmVxdWFsKDIsIHJlc3VsdC5sZW5ndGgpO1xuICAgIGFzc2VydC5lcXVhbCh2bm9kZTEsIHJlc3VsdFswXSk7XG4gICAgYXNzZXJ0LmVxdWFsKHZub2RlMSwgcmVzdWx0WzFdKTtcbiAgfSk7XG4gIGl0KCdzaGFyZWQgaGFuZGxlcnMgaW4gcGFyZW50IGFuZCBjaGlsZCBub2RlcycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2hhcmVkSGFuZGxlcnMgPSB7XG4gICAgICBjbGljazogZnVuY3Rpb24oZXYpIHsgcmVzdWx0LnB1c2goZXYpOyB9XG4gICAgfTtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2Jywge29uOiBzaGFyZWRIYW5kbGVyc30sIFtcbiAgICAgIGgoJ2EnLCB7b246IHNoYXJlZEhhbmRsZXJzfSwgJ0NsaWNrIG15IHBhcmVudCcpLFxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgZWxtLmNsaWNrKCk7XG4gICAgYXNzZXJ0LmVxdWFsKDEsIHJlc3VsdC5sZW5ndGgpO1xuICAgIGVsbS5maXJzdENoaWxkLmNsaWNrKCk7XG4gICAgYXNzZXJ0LmVxdWFsKDMsIHJlc3VsdC5sZW5ndGgpO1xuICB9KTtcbn0pO1xuIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xyXG5cclxudmFyIHNuYWJiZG9tID0gcmVxdWlyZSgnLi4vc25hYmJkb20nKTtcclxudmFyIGggPSByZXF1aXJlKCcuLi9oJykuZGVmYXVsdDtcclxudmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXHJcbiAgcmVxdWlyZSgnLi4vbW9kdWxlcy9hdHRyaWJ1dGVzJykuZGVmYXVsdFxyXG5dKTtcclxuXHJcbmRlc2NyaWJlKCdzdmcnLCBmdW5jdGlvbiAoKSB7XHJcbiB2YXIgZWxtLCB2bm9kZTA7XHJcbiBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdmcnKTtcclxuICAgdm5vZGUwID0gZWxtO1xyXG4gfSk7XHJcblxyXG4gaXQoJ3JlbW92ZXMgY2hpbGQgc3ZnIGVsZW1lbnRzJywgZnVuY3Rpb24oKXtcclxuICAgdmFyIGEgPSBoKCdzdmcnLCB7fSwgW1xyXG4gICAgaCgnZycpLFxyXG4gICAgaCgnZycpXHJcbiAgIF0pO1xyXG4gICB2YXIgYiA9IGgoJ3N2ZycsIHt9LCBbXHJcbiAgICBoKCdnJylcclxuICAgXSk7XHJcbiAgIHZhciByZXN1bHQgPSBwYXRjaChwYXRjaCh2bm9kZTAsIGEpLCBiKS5lbG07XHJcbiAgIGFzc2VydC5lcXVhbChyZXN1bHQuY2hpbGROb2Rlcy5sZW5ndGgsIDEpOyBcclxuIH0pO1xyXG5cclxuIGl0KCdhZGRzIGNvcnJlY3RseSB4bGluayBuYW1lc3BhY2VkIGF0dHJpYnV0ZScsIGZ1bmN0aW9uKCl7XHJcbiAgIHZhciB4bGlua05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xyXG4gICB2YXIgdGVzdFVybCA9ICcvdGVzdCc7XHJcbiAgIHZhciBhID0gaCgnc3ZnJywge30sIFtcclxuICAgICBoKCd1c2UnLCB7XHJcbiAgICAgICBhdHRyczogeyAneGxpbms6aHJlZic6IHRlc3RVcmwgfVxyXG4gICAgIH0sIFtdKVxyXG4gICBdKTtcclxuXHJcbiAgIHZhciByZXN1bHQgPSBwYXRjaCh2bm9kZTAsIGEpLmVsbTtcclxuICAgYXNzZXJ0LmVxdWFsKHJlc3VsdC5jaGlsZE5vZGVzLmxlbmd0aCwgMSk7XHJcbiAgIGFzc2VydC5lcXVhbChyZXN1bHQuY2hpbGROb2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKSwgdGVzdFVybCk7IFxyXG4gICBhc3NlcnQuZXF1YWwocmVzdWx0LmNoaWxkTm9kZXNbMF0uZ2V0QXR0cmlidXRlTlMoeGxpbmtOUywnaHJlZicpLCB0ZXN0VXJsKTtcclxuXHJcbiB9KTtcclxuXHJcbiBpdCgnYWRkcyBjb3JyZWN0bHkgeG1sIG5hbWVzcGFjZWQgYXR0cmlidXRlJywgZnVuY3Rpb24oKXtcclxuICAgdmFyIHhtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XHJcbiAgIHZhciB0ZXN0QXR0clZhbHVlID0gJ3VuZCc7XHJcbiAgIHZhciBhID0gaCgnc3ZnJywgeyBhdHRyczogeyAneG1sOmxhbmcnOiB0ZXN0QXR0clZhbHVlIH0gfSwgW10pO1xyXG5cclxuICAgdmFyIHJlc3VsdCA9IHBhdGNoKHZub2RlMCwgYSkuZWxtO1xyXG4gICBhc3NlcnQuZXF1YWwocmVzdWx0LmdldEF0dHJpYnV0ZU5TKHhtbE5TLCAnbGFuZycpLCB0ZXN0QXR0clZhbHVlKTtcclxuICAgYXNzZXJ0LmVxdWFsKHJlc3VsdC5nZXRBdHRyaWJ1dGUoJ3htbDpsYW5nJyksIHRlc3RBdHRyVmFsdWUpOyBcclxuIH0pO1xyXG59KSIsInJlcXVpcmUoJy4vY29yZScpO1xucmVxdWlyZSgnLi9zdHlsZScpO1xucmVxdWlyZSgnLi9kYXRhc2V0Jyk7XG5yZXF1aXJlKCcuL2V2ZW50bGlzdGVuZXJzJyk7XG5yZXF1aXJlKCcuL2F0dGFjaHRvJyk7XG5yZXF1aXJlKCcuL3RodW5rJyk7XG5yZXF1aXJlKCcuL2F0dHJpYnV0ZXMnKTtcbnJlcXVpcmUoJy4vaHRtbGRvbWFwaScpIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xudmFyIGZha2VSYWYgPSByZXF1aXJlKCdmYWtlLXJhZicpO1xuXG52YXIgc25hYmJkb20gPSByZXF1aXJlKCcuLi9zbmFiYmRvbScpO1xuZmFrZVJhZi51c2UoKTtcbnZhciBwYXRjaCA9IHNuYWJiZG9tLmluaXQoW1xuICByZXF1aXJlKCcuLi9tb2R1bGVzL3N0eWxlJykuZGVmYXVsdCxcbl0pO1xudmFyIGggPSByZXF1aXJlKCcuLi9oJykuZGVmYXVsdDtcbnZhciB0b1ZOb2RlID0gcmVxdWlyZSgnLi4vdG92bm9kZScpLmRlZmF1bHQ7XG5cbmRlc2NyaWJlKCdzdHlsZScsIGZ1bmN0aW9uKCkge1xuICB2YXIgZWxtLCB2bm9kZTA7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdm5vZGUwID0gZWxtO1xuICB9KTtcbiAgaXQoJ2lzIGJlaW5nIHN0eWxlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgaCgnZGl2Jywge3N0eWxlOiB7Zm9udFNpemU6ICcxMnB4J319KSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZm9udFNpemUsICcxMnB4Jyk7XG4gIH0pO1xuICBpdCgnY2FuIGJlIG1lbW9pemVkJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhY2hlZFN0eWxlcyA9IHtmb250U2l6ZTogJzE0cHgnLCBkaXNwbGF5OiAnaW5saW5lJ307XG4gICAgdmFyIHZub2RlMSA9IGgoJ2knLCB7c3R5bGU6IGNhY2hlZFN0eWxlc30pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdpJywge3N0eWxlOiBjYWNoZWRTdHlsZXN9KTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZm9udFNpemUsICcxNHB4Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5kaXNwbGF5LCAnaW5saW5lJyk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLnN0eWxlLmZvbnRTaXplLCAnMTRweCcpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZGlzcGxheSwgJ2lubGluZScpO1xuICB9KTtcbiAgaXQoJ3VwZGF0ZXMgc3R5bGVzJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZub2RlMSA9IGgoJ2knLCB7c3R5bGU6IHtmb250U2l6ZTogJzE0cHgnLCBkaXNwbGF5OiAnaW5saW5lJ319KTtcbiAgICB2YXIgdm5vZGUyID0gaCgnaScsIHtzdHlsZToge2ZvbnRTaXplOiAnMTJweCcsIGRpc3BsYXk6ICdibG9jayd9fSk7XG4gICAgdmFyIHZub2RlMyA9IGgoJ2knLCB7c3R5bGU6IHtmb250U2l6ZTogJzEwcHgnLCBkaXNwbGF5OiAnYmxvY2snfX0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5mb250U2l6ZSwgJzE0cHgnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLnN0eWxlLmRpc3BsYXksICdpbmxpbmUnKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZm9udFNpemUsICcxMnB4Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5kaXNwbGF5LCAnYmxvY2snKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTIsIHZub2RlMykuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZm9udFNpemUsICcxMHB4Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5kaXNwbGF5LCAnYmxvY2snKTtcbiAgfSk7XG4gIGl0KCdleHBsaWNpYWx5IHJlbW92ZXMgc3R5bGVzJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZub2RlMSA9IGgoJ2knLCB7c3R5bGU6IHtmb250U2l6ZTogJzE0cHgnfX0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdpJywge3N0eWxlOiB7Zm9udFNpemU6ICcnfX0pO1xuICAgIHZhciB2bm9kZTMgPSBoKCdpJywge3N0eWxlOiB7Zm9udFNpemU6ICcxMHB4J319KTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZm9udFNpemUsICcxNHB4Jyk7XG4gICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZm9udFNpemUsICcnKTtcbiAgICBwYXRjaCh2bm9kZTIsIHZub2RlMyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5mb250U2l6ZSwgJzEwcHgnKTtcbiAgfSk7XG4gIGl0KCdpbXBsaWNpYWxseSByZW1vdmVzIHN0eWxlcyBmcm9tIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW2goJ2knLCB7c3R5bGU6IHtmb250U2l6ZTogJzE0cHgnfX0pXSk7XG4gICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtoKCdpJyldKTtcbiAgICB2YXIgdm5vZGUzID0gaCgnZGl2JywgW2goJ2knLCB7c3R5bGU6IHtmb250U2l6ZTogJzEwcHgnfX0pXSk7XG4gICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5zdHlsZS5mb250U2l6ZSwgJzE0cHgnKTtcbiAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5maXJzdENoaWxkLnN0eWxlLmZvbnRTaXplLCAnJyk7XG4gICAgcGF0Y2godm5vZGUyLCB2bm9kZTMpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5zdHlsZS5mb250U2l6ZSwgJzEwcHgnKTtcbiAgfSk7XG4gIGl0KCd1cGRhdGVzIGNzcyB2YXJpYWJsZXMnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2Jywge3N0eWxlOiB7Jy0tbXlWYXInOiAxfX0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCB7c3R5bGU6IHsnLS1teVZhcic6IDJ9fSk7XG4gICAgdmFyIHZub2RlMyA9IGgoJ2RpdicsIHtzdHlsZTogeyctLW15VmFyJzogM319KTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teVZhcicpLCAxKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teVZhcicpLCAyKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTIsIHZub2RlMykuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teVZhcicpLCAzKTtcbiAgfSk7XG4gIGl0KCdleHBsaWNpYWx5IHJlbW92ZXMgY3NzIHZhcmlhYmxlcycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2bm9kZTEgPSBoKCdpJywge3N0eWxlOiB7Jy0tbXlWYXInOiAxfX0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdpJywge3N0eWxlOiB7Jy0tbXlWYXInOiAnJ319KTtcbiAgICB2YXIgdm5vZGUzID0gaCgnaScsIHtzdHlsZTogeyctLW15VmFyJzogMn19KTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teVZhcicpLCAxKTtcbiAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLW15VmFyJyksICcnKTtcbiAgICBwYXRjaCh2bm9kZTIsIHZub2RlMyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLW15VmFyJyksIDIpO1xuICB9KTtcbiAgaXQoJ2ltcGxpY2lhbGx5IHJlbW92ZXMgY3NzIHZhcmlhYmxlcyBmcm9tIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW2goJ2knLCB7c3R5bGU6IHsnLS1teVZhcic6IDF9fSldKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW2goJ2knKV0pO1xuICAgIHZhciB2bm9kZTMgPSBoKCdkaXYnLCBbaCgnaScsIHtzdHlsZTogeyctLW15VmFyJzogMn19KV0pO1xuICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmZpcnN0Q2hpbGQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teVZhcicpLCAxKTtcbiAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5maXJzdENoaWxkLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tbXlWYXInKSwgJycpO1xuICAgIHBhdGNoKHZub2RlMiwgdm5vZGUzKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmZpcnN0Q2hpbGQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teVZhcicpLCAyKTtcbiAgfSk7XG4gIGl0KCd1cGRhdGVzIGRlbGF5ZWQgc3R5bGVzIGluIG5leHQgZnJhbWUnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0Y2ggPSBzbmFiYmRvbS5pbml0KFtcbiAgICAgIHJlcXVpcmUoJy4uL21vZHVsZXMvc3R5bGUnKS5kZWZhdWx0LFxuICAgIF0pO1xuICAgIHZhciB2bm9kZTEgPSBoKCdpJywge3N0eWxlOiB7Zm9udFNpemU6ICcxNHB4JywgZGVsYXllZDoge2ZvbnRTaXplOiAnMTZweCd9fX0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdpJywge3N0eWxlOiB7Zm9udFNpemU6ICcxOHB4JywgZGVsYXllZDoge2ZvbnRTaXplOiAnMjBweCd9fX0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5mb250U2l6ZSwgJzE0cHgnKTtcbiAgICBmYWtlUmFmLnN0ZXAoKTtcbiAgICBmYWtlUmFmLnN0ZXAoKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLnN0eWxlLmZvbnRTaXplLCAnMTZweCcpO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5zdHlsZS5mb250U2l6ZSwgJzE4cHgnKTtcbiAgICBmYWtlUmFmLnN0ZXAoKTtcbiAgICBmYWtlUmFmLnN0ZXAoKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLnN0eWxlLmZvbnRTaXplLCAnMjBweCcpO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3VzaW5nIHRvVk5vZGUoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnaGFuZGxlcyAoaWdub3JpbmcpIGNvbW1lbnQgbm9kZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21tZW50ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgneW9sbycpO1xuICAgICAgdmFyIHByZXZFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZFbG0uYXBwZW5kQ2hpbGQoY29tbWVudCk7XG4gICAgICB2YXIgbmV4dFZOb2RlID0gaCgnZGl2JywgW2goJ3NwYW4nLCAnSGknKV0pO1xuICAgICAgZWxtID0gcGF0Y2godG9WTm9kZShwcmV2RWxtKSwgbmV4dFZOb2RlKS5lbG07XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLCBwcmV2RWxtKTtcbiAgICAgIGFzc2VydC5lcXVhbChlbG0udGFnTmFtZSwgJ0RJVicpO1xuICAgICAgYXNzZXJ0LnN0cmljdEVxdWFsKGVsbS5jaGlsZE5vZGVzLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuc3RyaWN0RXF1YWwoZWxtLmNoaWxkTm9kZXNbMF0udGFnTmFtZSwgJ1NQQU4nKTtcbiAgICAgIGFzc2VydC5zdHJpY3RFcXVhbChlbG0uY2hpbGROb2Rlc1swXS50ZXh0Q29udGVudCwgJ0hpJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZha2VSYWYucmVzdG9yZSgpO1xuIiwidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG52YXIgc25hYmJkb20gPSByZXF1aXJlKCcuLi9zbmFiYmRvbScpO1xudmFyIHBhdGNoID0gc25hYmJkb20uaW5pdChbXG5dKTtcbnZhciBoID0gcmVxdWlyZSgnLi4vaCcpLmRlZmF1bHQ7XG52YXIgdGh1bmsgPSByZXF1aXJlKCcuLi90aHVuaycpLmRlZmF1bHQ7XG5cbmRlc2NyaWJlKCd0aHVuaycsIGZ1bmN0aW9uKCkge1xuICB2YXIgZWxtLCB2bm9kZTA7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZWxtID0gdm5vZGUwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIH0pO1xuICBpdCgncmV0dXJucyB2bm9kZSB3aXRoIGRhdGEgYW5kIHJlbmRlciBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIG51bWJlckluU3BhbihuKSB7XG4gICAgICByZXR1cm4gaCgnc3BhbicsICdOdW1iZXIgaXMgJyArIG4pO1xuICAgIH1cbiAgICB2YXIgdm5vZGUgPSB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsyMl0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwodm5vZGUuc2VsLCAnc3BhbicpO1xuICAgIGFzc2VydC5kZWVwRXF1YWwodm5vZGUuZGF0YS5rZXksICdudW0nKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHZub2RlLmRhdGEuYXJncywgWzIyXSk7XG4gIH0pO1xuICBpdCgnY2FsbHMgcmVuZGVyIGZ1bmN0aW9uIG9uY2Ugb24gZGF0YSBjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbGVkID0gMDtcbiAgICBmdW5jdGlvbiBudW1iZXJJblNwYW4obikge1xuICAgICAgY2FsbGVkKys7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtrZXk6ICdudW0nfSwgJ051bWJlciBpcyAnICsgbik7XG4gICAgfVxuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbXG4gICAgICB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxXSlcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW1xuICAgICAgdGh1bmsoJ3NwYW4nLCAnbnVtJywgbnVtYmVySW5TcGFuLCBbMl0pXG4gICAgXSk7XG4gICAgcGF0Y2godm5vZGUwLCB2bm9kZTEpO1xuICAgIGFzc2VydC5lcXVhbChjYWxsZWQsIDEpO1xuICAgIHBhdGNoKHZub2RlMSwgdm5vZGUyKTtcbiAgICBhc3NlcnQuZXF1YWwoY2FsbGVkLCAyKTtcbiAgfSk7XG4gIGl0KCdkb2VzIG5vdCBjYWxsIHJlbmRlciBmdW5jdGlvbiBvbiBkYXRhIHVuY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYWxsZWQgPSAwO1xuICAgIGZ1bmN0aW9uIG51bWJlckluU3BhbihuKSB7XG4gICAgICBjYWxsZWQrKztcbiAgICAgIHJldHVybiBoKCdzcGFuJywge2tleTogJ251bSd9LCAnTnVtYmVyIGlzICcgKyBuKTtcbiAgICB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgIHRodW5rKCdzcGFuJywgJ251bScsIG51bWJlckluU3BhbiwgWzFdKVxuICAgIF0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbXG4gICAgICB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxXSlcbiAgICBdKTtcbiAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgYXNzZXJ0LmVxdWFsKGNhbGxlZCwgMSk7XG4gICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgIGFzc2VydC5lcXVhbChjYWxsZWQsIDEpO1xuICB9KTtcbiAgaXQoJ2NhbGxzIHJlbmRlciBmdW5jdGlvbiBvbmNlIG9uIGRhdGEtbGVuZ3RoIGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYWxsZWQgPSAwO1xuICAgIGZ1bmN0aW9uIG51bWJlckluU3BhbihuKSB7XG4gICAgICBjYWxsZWQrKztcbiAgICAgIHJldHVybiBoKCdzcGFuJywge2tleTogJ251bSd9LCAnTnVtYmVyIGlzICcgKyBuKTtcbiAgICB9XG4gICAgdmFyIHZub2RlMSA9IGgoJ2RpdicsIFtcbiAgICAgIHRodW5rKCdzcGFuJywgJ251bScsIG51bWJlckluU3BhbiwgWzFdKVxuICAgIF0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbXG4gICAgICB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxLCAyXSlcbiAgICBdKTtcbiAgICBwYXRjaCh2bm9kZTAsIHZub2RlMSk7XG4gICAgYXNzZXJ0LmVxdWFsKGNhbGxlZCwgMSk7XG4gICAgcGF0Y2godm5vZGUxLCB2bm9kZTIpO1xuICAgIGFzc2VydC5lcXVhbChjYWxsZWQsIDIpO1xuICB9KTtcbiAgaXQoJ2NhbGxzIHJlbmRlciBmdW5jdGlvbiBvbmNlIG9uIGZ1bmN0aW9uIGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYWxsZWQgPSAwO1xuICAgIGZ1bmN0aW9uIG51bWJlckluU3BhbihuKSB7XG4gICAgICBjYWxsZWQrKztcbiAgICAgIHJldHVybiBoKCdzcGFuJywge2tleTogJ251bSd9LCAnTnVtYmVyIGlzICcgKyBuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbnVtYmVySW5TcGFuMihuKSB7XG4gICAgICBjYWxsZWQrKztcbiAgICAgIHJldHVybiBoKCdzcGFuJywge2tleTogJ251bSd9LCAnTnVtYmVyIHJlYWxseSBpcyAnICsgbik7XG4gICAgfVxuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbXG4gICAgICB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxXSlcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW1xuICAgICAgdGh1bmsoJ3NwYW4nLCAnbnVtJywgbnVtYmVySW5TcGFuMiwgWzFdKVxuICAgIF0pO1xuICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICBhc3NlcnQuZXF1YWwoY2FsbGVkLCAxKTtcbiAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgYXNzZXJ0LmVxdWFsKGNhbGxlZCwgMik7XG4gIH0pO1xuICBpdCgncmVuZGVycyBjb3JyZWN0bHknLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbGVkID0gMDtcbiAgICBmdW5jdGlvbiBudW1iZXJJblNwYW4obikge1xuICAgICAgY2FsbGVkKys7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtrZXk6ICdudW0nfSwgJ051bWJlciBpcyAnICsgbik7XG4gICAgfVxuICAgIHZhciB2bm9kZTEgPSBoKCdkaXYnLCBbXG4gICAgICB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxXSlcbiAgICBdKTtcbiAgICB2YXIgdm5vZGUyID0gaCgnZGl2JywgW1xuICAgICAgdGh1bmsoJ3NwYW4nLCAnbnVtJywgbnVtYmVySW5TcGFuLCBbMV0pXG4gICAgXSk7XG4gICAgdmFyIHZub2RlMyA9IGgoJ2RpdicsIFtcbiAgICAgIHRodW5rKCdzcGFuJywgJ251bScsIG51bWJlckluU3BhbiwgWzJdKVxuICAgIF0pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5maXJzdENoaWxkLnRhZ05hbWUudG9Mb3dlckNhc2UoKSwgJ3NwYW4nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmZpcnN0Q2hpbGQuaW5uZXJIVE1MLCAnTnVtYmVyIGlzIDEnKTtcbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCksICdzcGFuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5maXJzdENoaWxkLmlubmVySFRNTCwgJ051bWJlciBpcyAxJyk7XG4gICAgZWxtID0gcGF0Y2godm5vZGUyLCB2bm9kZTMpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmZpcnN0Q2hpbGQudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCAnc3BhbicpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5pbm5lckhUTUwsICdOdW1iZXIgaXMgMicpO1xuICAgIGFzc2VydC5lcXVhbChjYWxsZWQsIDIpO1xuICB9KTtcbiAgaXQoJ3N1cHBvcnRzIGxlYXZpbmcgb3V0IHRoZSBga2V5YCBhcmd1bWVudCcsIGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIHZub2RlRm4ocykge1xuICAgICAgcmV0dXJuIGgoJ3NwYW4ubnVtYmVyJywgJ0hlbGxvICcgKyBzKTtcbiAgICB9XG4gICAgdmFyIHZub2RlMSA9IHRodW5rKCdzcGFuLm51bWJlcicsIHZub2RlRm4sIFsnV29ybGQhJ10pO1xuICAgIGVsbSA9IHBhdGNoKHZub2RlMCwgdm5vZGUxKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5pbm5lclRleHQsICdIZWxsbyBXb3JsZCEnKTtcbiAgfSk7XG4gIGl0KCdyZW5kZXJzIGNvcnJlY3RseSB3aGVuIHJvb3QnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbGVkID0gMDtcbiAgICBmdW5jdGlvbiBudW1iZXJJblNwYW4obikge1xuICAgICAgY2FsbGVkKys7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtrZXk6ICdudW0nfSwgJ051bWJlciBpcyAnICsgbik7XG4gICAgfVxuICAgIHZhciB2bm9kZTEgPSB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxXSk7XG4gICAgdmFyIHZub2RlMiA9IHRodW5rKCdzcGFuJywgJ251bScsIG51bWJlckluU3BhbiwgWzFdKTtcbiAgICB2YXIgdm5vZGUzID0gdGh1bmsoJ3NwYW4nLCAnbnVtJywgbnVtYmVySW5TcGFuLCBbMl0pO1xuXG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSwgJ3NwYW4nKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmlubmVySFRNTCwgJ051bWJlciBpcyAxJyk7XG5cbiAgICBlbG0gPSBwYXRjaCh2bm9kZTEsIHZub2RlMikuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLCAnc3BhbicpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uaW5uZXJIVE1MLCAnTnVtYmVyIGlzIDEnKTtcblxuICAgIGVsbSA9IHBhdGNoKHZub2RlMiwgdm5vZGUzKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS50YWdOYW1lLnRvTG93ZXJDYXNlKCksICdzcGFuJyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5pbm5lckhUTUwsICdOdW1iZXIgaXMgMicpO1xuICAgIGFzc2VydC5lcXVhbChjYWxsZWQsIDIpO1xuICB9KTtcbiAgaXQoJ2NhbiBiZSByZXBsYWNlZCBhbmQgcmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIG51bWJlckluU3BhbihuKSB7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtrZXk6ICdudW0nfSwgJ051bWJlciBpcyAnICsgbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9kZEV2ZW4obikge1xuICAgICAgdmFyIHByZWZpeCA9IChuICUgMikgPT09IDAgPyAnRXZlbicgOiAnT2RkJztcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7a2V5OiBvZGRFdmVufSwgcHJlZml4ICsgJzogJyArIG4pO1xuICAgIH1cbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW3RodW5rKCdzcGFuJywgJ251bScsIG51bWJlckluU3BhbiwgWzFdKV0pO1xuICAgIHZhciB2bm9kZTIgPSBoKCdkaXYnLCBbdGh1bmsoJ2RpdicsICdvZGRFdmVuJywgb2RkRXZlbiwgWzRdKV0pO1xuXG4gICAgZWxtID0gcGF0Y2godm5vZGUwLCB2bm9kZTEpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmZpcnN0Q2hpbGQudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCAnc3BhbicpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uZmlyc3RDaGlsZC5pbm5lckhUTUwsICdOdW1iZXIgaXMgMScpO1xuXG4gICAgZWxtID0gcGF0Y2godm5vZGUxLCB2bm9kZTIpLmVsbTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmZpcnN0Q2hpbGQudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCAnZGl2Jyk7XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS5maXJzdENoaWxkLmlubmVySFRNTCwgJ0V2ZW46IDQnKTtcbiAgfSk7XG4gIGl0KCdjYW4gYmUgcmVwbGFjZWQgYW5kIHJlbW92ZWQgd2hlbiByb290JywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gbnVtYmVySW5TcGFuKG4pIHtcbiAgICAgIHJldHVybiBoKCdzcGFuJywge2tleTogJ251bSd9LCAnTnVtYmVyIGlzICcgKyBuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb2RkRXZlbihuKSB7XG4gICAgICB2YXIgcHJlZml4ID0gKG4gJSAyKSA9PT0gMCA/ICdFdmVuJyA6ICdPZGQnO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtrZXk6IG9kZEV2ZW59LCBwcmVmaXggKyAnOiAnICsgbik7XG4gICAgfVxuICAgIHZhciB2bm9kZTEgPSB0aHVuaygnc3BhbicsICdudW0nLCBudW1iZXJJblNwYW4sIFsxXSk7XG4gICAgdmFyIHZub2RlMiA9IHRodW5rKCdkaXYnLCAnb2RkRXZlbicsIG9kZEV2ZW4sIFs0XSk7XG5cbiAgICBlbG0gPSBwYXRjaCh2bm9kZTAsIHZub2RlMSkuZWxtO1xuICAgIGFzc2VydC5lcXVhbChlbG0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLCAnc3BhbicpO1xuICAgIGFzc2VydC5lcXVhbChlbG0uaW5uZXJIVE1MLCAnTnVtYmVyIGlzIDEnKTtcblxuICAgIGVsbSA9IHBhdGNoKHZub2RlMSwgdm5vZGUyKS5lbG07XG4gICAgYXNzZXJ0LmVxdWFsKGVsbS50YWdOYW1lLnRvTG93ZXJDYXNlKCksICdkaXYnKTtcbiAgICBhc3NlcnQuZXF1YWwoZWxtLmlubmVySFRNTCwgJ0V2ZW46IDQnKTtcbiAgfSk7XG4gIGl0KCdpbnZva2VzIGRlc3Ryb3kgaG9vayBvbiB0aHVua3MnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbGVkID0gMDtcbiAgICBmdW5jdGlvbiBkZXN0cm95SG9vaygpIHtcbiAgICAgIGNhbGxlZCsrO1xuICAgIH1cbiAgICBmdW5jdGlvbiBudW1iZXJJblNwYW4obikge1xuICAgICAgcmV0dXJuIGgoJ3NwYW4nLCB7a2V5OiAnbnVtJywgaG9vazoge2Rlc3Ryb3k6IGRlc3Ryb3lIb29rfX0sICdOdW1iZXIgaXMgJyArIG4pO1xuICAgIH1cbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgaCgnZGl2JywgJ0ZvbycpLFxuICAgICAgdGh1bmsoJ3NwYW4nLCAnbnVtJywgbnVtYmVySW5TcGFuLCBbMV0pLFxuICAgICAgaCgnZGl2JywgJ0ZvbycpXG4gICAgXSk7XG4gICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtcbiAgICAgIGgoJ2RpdicsICdGb28nKSxcbiAgICAgIGgoJ2RpdicsICdGb28nKVxuICAgIF0pO1xuICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgYXNzZXJ0LmVxdWFsKGNhbGxlZCwgMSk7XG4gIH0pO1xuICBpdCgnaW52b2tlcyByZW1vdmUgaG9vayBvbiB0aHVua3MnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FsbGVkID0gMDtcbiAgICBmdW5jdGlvbiBob29rKCkge1xuICAgICAgY2FsbGVkKys7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG51bWJlckluU3BhbihuKSB7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtrZXk6ICdudW0nLCBob29rOiB7cmVtb3ZlOiBob29rfX0sICdOdW1iZXIgaXMgJyArIG4pO1xuICAgIH1cbiAgICB2YXIgdm5vZGUxID0gaCgnZGl2JywgW1xuICAgICAgaCgnZGl2JywgJ0ZvbycpLFxuICAgICAgdGh1bmsoJ3NwYW4nLCAnbnVtJywgbnVtYmVySW5TcGFuLCBbMV0pLFxuICAgICAgaCgnZGl2JywgJ0ZvbycpXG4gICAgXSk7XG4gICAgdmFyIHZub2RlMiA9IGgoJ2RpdicsIFtcbiAgICAgIGgoJ2RpdicsICdGb28nKSxcbiAgICAgIGgoJ2RpdicsICdGb28nKVxuICAgIF0pO1xuICAgIHBhdGNoKHZub2RlMCwgdm5vZGUxKTtcbiAgICBwYXRjaCh2bm9kZTEsIHZub2RlMik7XG4gICAgYXNzZXJ0LmVxdWFsKGNhbGxlZCwgMSk7XG4gIH0pO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaF8xID0gcmVxdWlyZShcIi4vaFwiKTtcclxuZnVuY3Rpb24gY29weVRvVGh1bmsodm5vZGUsIHRodW5rKSB7XHJcbiAgICB0aHVuay5lbG0gPSB2bm9kZS5lbG07XHJcbiAgICB2bm9kZS5kYXRhLmZuID0gdGh1bmsuZGF0YS5mbjtcclxuICAgIHZub2RlLmRhdGEuYXJncyA9IHRodW5rLmRhdGEuYXJncztcclxuICAgIHRodW5rLmRhdGEgPSB2bm9kZS5kYXRhO1xyXG4gICAgdGh1bmsuY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcclxuICAgIHRodW5rLnRleHQgPSB2bm9kZS50ZXh0O1xyXG4gICAgdGh1bmsuZWxtID0gdm5vZGUuZWxtO1xyXG59XHJcbmZ1bmN0aW9uIGluaXQodGh1bmspIHtcclxuICAgIHZhciBjdXIgPSB0aHVuay5kYXRhO1xyXG4gICAgdmFyIHZub2RlID0gY3VyLmZuLmFwcGx5KHVuZGVmaW5lZCwgY3VyLmFyZ3MpO1xyXG4gICAgY29weVRvVGh1bmsodm5vZGUsIHRodW5rKTtcclxufVxyXG5mdW5jdGlvbiBwcmVwYXRjaChvbGRWbm9kZSwgdGh1bmspIHtcclxuICAgIHZhciBpLCBvbGQgPSBvbGRWbm9kZS5kYXRhLCBjdXIgPSB0aHVuay5kYXRhO1xyXG4gICAgdmFyIG9sZEFyZ3MgPSBvbGQuYXJncywgYXJncyA9IGN1ci5hcmdzO1xyXG4gICAgaWYgKG9sZC5mbiAhPT0gY3VyLmZuIHx8IG9sZEFyZ3MubGVuZ3RoICE9PSBhcmdzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvcHlUb1RodW5rKGN1ci5mbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpLCB0aHVuayk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBpZiAob2xkQXJnc1tpXSAhPT0gYXJnc1tpXSkge1xyXG4gICAgICAgICAgICBjb3B5VG9UaHVuayhjdXIuZm4uYXBwbHkodW5kZWZpbmVkLCBhcmdzKSwgdGh1bmspO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29weVRvVGh1bmsob2xkVm5vZGUsIHRodW5rKTtcclxufVxyXG5leHBvcnRzLnRodW5rID0gZnVuY3Rpb24gdGh1bmsoc2VsLCBrZXksIGZuLCBhcmdzKSB7XHJcbiAgICBpZiAoYXJncyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYXJncyA9IGZuO1xyXG4gICAgICAgIGZuID0ga2V5O1xyXG4gICAgICAgIGtleSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHJldHVybiBoXzEuaChzZWwsIHtcclxuICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICBob29rOiB7IGluaXQ6IGluaXQsIHByZXBhdGNoOiBwcmVwYXRjaCB9LFxyXG4gICAgICAgIGZuOiBmbixcclxuICAgICAgICBhcmdzOiBhcmdzXHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy50aHVuaztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1bmsuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHZub2RlXzEgPSByZXF1aXJlKFwiLi92bm9kZVwiKTtcclxudmFyIGh0bWxkb21hcGlfMSA9IHJlcXVpcmUoXCIuL2h0bWxkb21hcGlcIik7XHJcbmZ1bmN0aW9uIHRvVk5vZGUobm9kZSwgZG9tQXBpKSB7XHJcbiAgICB2YXIgYXBpID0gZG9tQXBpICE9PSB1bmRlZmluZWQgPyBkb21BcGkgOiBodG1sZG9tYXBpXzEuZGVmYXVsdDtcclxuICAgIHZhciB0ZXh0O1xyXG4gICAgaWYgKGFwaS5pc0VsZW1lbnQobm9kZSkpIHtcclxuICAgICAgICB2YXIgaWQgPSBub2RlLmlkID8gJyMnICsgbm9kZS5pZCA6ICcnO1xyXG4gICAgICAgIHZhciBjbiA9IG5vZGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xyXG4gICAgICAgIHZhciBjID0gY24gPyAnLicgKyBjbi5zcGxpdCgnICcpLmpvaW4oJy4nKSA6ICcnO1xyXG4gICAgICAgIHZhciBzZWwgPSBhcGkudGFnTmFtZShub2RlKS50b0xvd2VyQ2FzZSgpICsgaWQgKyBjO1xyXG4gICAgICAgIHZhciBhdHRycyA9IHt9O1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHZhciBuYW1lXzE7XHJcbiAgICAgICAgdmFyIGkgPSB2b2lkIDAsIG4gPSB2b2lkIDA7XHJcbiAgICAgICAgdmFyIGVsbUF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIHZhciBlbG1DaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcclxuICAgICAgICBmb3IgKGkgPSAwLCBuID0gZWxtQXR0cnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5hbWVfMSA9IGVsbUF0dHJzW2ldLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICBpZiAobmFtZV8xICE9PSAnaWQnICYmIG5hbWVfMSAhPT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgICAgICAgYXR0cnNbbmFtZV8xXSA9IGVsbUF0dHJzW2ldLm5vZGVWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGkgPSAwLCBuID0gZWxtQ2hpbGRyZW4ubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godG9WTm9kZShlbG1DaGlsZHJlbltpXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdm5vZGVfMS5kZWZhdWx0KHNlbCwgeyBhdHRyczogYXR0cnMgfSwgY2hpbGRyZW4sIHVuZGVmaW5lZCwgbm9kZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhcGkuaXNUZXh0KG5vZGUpKSB7XHJcbiAgICAgICAgdGV4dCA9IGFwaS5nZXRUZXh0Q29udGVudChub2RlKTtcclxuICAgICAgICByZXR1cm4gdm5vZGVfMS5kZWZhdWx0KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRleHQsIG5vZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXBpLmlzQ29tbWVudChub2RlKSkge1xyXG4gICAgICAgIHRleHQgPSBhcGkuZ2V0VGV4dENvbnRlbnQobm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHZub2RlXzEuZGVmYXVsdCgnIScsIHt9LCBbXSwgdGV4dCwgbm9kZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdm5vZGVfMS5kZWZhdWx0KCcnLCB7fSwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnRvVk5vZGUgPSB0b1ZOb2RlO1xyXG5leHBvcnRzLmRlZmF1bHQgPSB0b1ZOb2RlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10b3Zub2RlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIHZub2RlKHNlbCwgZGF0YSwgY2hpbGRyZW4sIHRleHQsIGVsbSkge1xyXG4gICAgdmFyIGtleSA9IGRhdGEgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGRhdGEua2V5O1xyXG4gICAgcmV0dXJuIHsgc2VsOiBzZWwsIGRhdGE6IGRhdGEsIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICB0ZXh0OiB0ZXh0LCBlbG06IGVsbSwga2V5OiBrZXkgfTtcclxufVxyXG5leHBvcnRzLnZub2RlID0gdm5vZGU7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHZub2RlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD12bm9kZS5qcy5tYXAiXX0=
