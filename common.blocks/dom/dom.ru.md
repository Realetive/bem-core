# dom

Блок предоставляет объект с набором методов для работы с DOM-деревом.

## Обзор

### Свойства и методы объекта

| Имя | Тип возвращаемого значения | Описание |
| -------- | --- | -------- |
| <a href="#fields-contains">contains</a>(<br>`ctx {Node}`,<br>`node {Node}`) | `Boolean` | Проверяет, содержит ли DOM-узел другой узел (включая сам узел). |
| <a href="#fields-getFocused">getFocused</a>() | `Node` | Служит для получения DOM-узла в фокусе. |
| <a href="#fields-containsFocus">containsFocus</a>(<br>`domNode {Node}`) | `Boolean` | Проверяет, содержится ли фокус в DOM-узле или его потомках. |
| <a href="#fields-isFocusable">isFocusable</a>(<br>`domNode {Node}`) | `Boolean` | Проверяет, может ли фокус быть установлен на DOM-узел. |
| <a href="#fields-isEditable">isEditable</a>(<br>`domNode {Node}`) | `Boolean` | Проверяет, возможен ли в DOM-узле ввод текста. |

### Публичные технологии блока

Блок реализован в технологиях:

* `js`

## Описание

<a name="fields"></a>

<a name="fields-contains"></a>

#### Метод `contains`

Метод проверяет, содержит ли DOM-узел `ctx` узел `node`. Узел содержит сам себя.

**Принимаемые аргументы:**

* `ctx {Node}` – DOM-узел, внутри которого выполняется поиск. Обязательный аргумент.
* `node {Node}` – DOM-узел, который ищется. Обязательный аргумент.

**Возвращаемое значение:** `Boolean`. Если узел найден — `true`.

Пример:

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

#### Метод `getFocused`

Служит для получения ссылки на DOM-узел в фокусе.

Не принимает аргументов.

**Возвращаемое значение:** `Node` – DOM-узел в фокусе.

Пример:

```js
import dom from 'bem:dom';

dom.getFocused(); // ссылка на узел в фокусе

```

<a name="fields-containsFocus"></a>

#### Метод `containsFocus`

Метод проверяет, находится ли фокус на переданном DOM-узле или одном из его потомков.

**Принимаемые аргументы:**

* `domNode {Node}` – DOM-узел для проверки. Обязательный аргумент.

**Возвращаемое значение:** `Boolean`. Если узел в фокусе — `true`.

Пример:

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

#### Метод `isFocusable`

Метод проверяет, может ли браузер пользователя установить фокус на переданный DOM-узел.

**Принимаемые аргументы:**

* `domNode {Node}` – DOM-узел для проверки. Обязательный аргумент.

**Возвращаемое значение:** `Boolean`. Если фокус может быть установлен на узел — `true`.

Пример:

```js
import dom from 'bem:dom';

/*
<div class="menu">
  <a class="menu__item" href="/">Ссылка 1</a>
</div>
*/

dom.isFocusable(document.querySelector('.menu__item')); // true

/*
<div class="menu">
  <span class="menu__item menu__item_current">Ссылка 1</span>
</div>
*/

dom.isFocusable(document.querySelector('.menu__item')); // false

```

<a name="fields-isEditable"></a>

#### Метод `isEditable`

Метод проверяет, возможен ли ввод текста в переданном DOM-узле. Иначе говоря, метод позволяет проверить, является ли узел полем ввода, текстовым полем и так далее.

**Принимаемые аргументы:**

* `domNode {Node}` – DOM-узел для проверки. Обязательный аргумент.

**Возвращаемое значение:** `Boolean`. Если ввод текста возможен — `true`.

Пример:

```js
import dom from 'bem:dom';

dom.isEditable(document.querySelector('input, textarea')); // true

```
