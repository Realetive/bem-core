# dom

This block provides an object with a set of methods for working with the DOM tree.

## Overview

### Object properties and methods

| Name | Return type | Description |
| -------- | --- | -------- |
| <a href="#fields-contains">contains</a>(<br>`ctx {Node}`,<br>`node {Node}`) | `Boolean` | Checks whether a DOM node contains another node (inclusive). |
| <a href="#fields-getFocused">getFocused</a>() | `Node` | Gets the DOM node that is in focus. |
| <a href="#fields-containsFocus">containsFocus</a>(<br>`domNode {Node}`) | `Boolean` | Checks whether a DOM node or its descendants contain the focus. |
| <a href="#fields-isFocusable">isFocusable</a>(<br>`domNode {Node}`) | `Boolean` | Checks whether the focus can be set on a DOM node. |
| <a href="#fields-isEditable">isEditable</a>(<br>`domNode {Node}`) | `Boolean` | Checks whether text can be entered in a DOM node. |

### Public block technologies

The block is implemented in:

* `js`

## Description

<a name="fields"></a>

<a name="fields-contains"></a>

#### `contains` method

Use this method to check whether a `ctx` DOM node contains `node`. A node contains itself.

**Accepted arguments:**

* `ctx {Node}` – The DOM node to search inside. Required argument.
* `node {Node}` – The DOM node to search for. Required argument.

**Return value:** `Boolean`. If found, then `true`.

Example:

```js
import dom from 'bem:dom';

/*
<div class="block1">
  <div class="block2"></div>
</div>
*/

dom.contains(document.querySelector('.block1'), document.querySelector('.block2'));  // true

```

<a name="fields-getFocused"></a>

#### `getFocused` method

Gets a reference to the DOM node that is in focus.

Doesn't accept arguments.

**Return value:** `Node` – The DOM node in focus.

Example:

```js
import dom from 'bem:dom';

dom.getFocused(); // a reference to the node in focus

```

<a name="fields-containsFocus"></a>

#### `containsFocus` method

This method checks whether the focus is on the DOM node passed in the argument or one of its descendants.

**Accepted arguments:**

* `domNode {Node}` – The DOM node to check. Required argument.

**Return value:** `Boolean`. If this node is in focus, then `true`.

Example:

```js
import dom from 'bem:dom';

/*
<div class="block1">
  <input class="block1__control">
</div>
*/

document.querySelector('.block1__control').focus();
dom.containsFocus(document.querySelector('.block1'));  // true

```

<a name="fields-isFocusable"></a>

#### `isFocusable` method

This method checks whether the user's browser can set the focus on the DOM node passed in the argument.

**Accepted arguments:**

* `domNode {Node}` – The DOM node to check. Required argument.

**Return value:** `Boolean`. If the focus can be set on this node, then `true`.

Example:

```js
import dom from 'bem:dom';

/*
<div class="menu">
  <a class="menu__item" href="/">Link 1</a>
</div>
*/

dom.isFocusable(document.querySelector('.menu__item')); // true

/*
<div class="menu">
  <span class="menu__item menu__item_current">Link 1</span>
</div>
*/

dom.isFocusable(document.querySelector('.menu__item')); // false

```

<a name="fields-isEditable"></a>

#### `isEditable` method

This method checks whether text can be entered in the DOM node passed in the argument. In other words, you can use this method to check whether the node is an input field, text field, and so on.

**Accepted arguments:**

* `domNode {Node}` – The DOM node to check. Required argument.

**Return value:** `Boolean`. If text can be entered in the DOM node, then `true`.

Example:

```js
import dom from 'bem:dom';

dom.isEditable(document.querySelector('input, textarea')); // true

```
