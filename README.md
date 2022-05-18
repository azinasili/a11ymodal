# A11yModal

Hello test2

A fully accessible and customizable modal front-end component. Apply it a single modal or all of your modals the page. A11yModal allows you to use whatever markup you like, you can apply your own classes and everything will just work.

[DEMO](https://codepen.io/azinasili/pen/VbaeBY?editors=1010)

## Installation
With [NPM](https://www.npmjs.com/package/a11ymodal):

```bash
npm install a11ymodal --save
```

With [Bower](https://bower.io/):

```bash
bower install a11ymodal --save
```

Or include A11yModal directly:

```html
<script src="/path/to/a11ymodal.js"></script>
```

A11yModal is written using [ES2015 modules](http://2ality.com/2014/09/es6-modules-final.html). To import A11yModal into an ES2015 application:

```javascript
import A11yModal from 'a11ymodal';
```


## Usage
A11yModal does require a small amount of markup to function, a trigger element, a containing element for the modal, a container for the modal content. The overlay element is optional but is provided in the example.

A11yModal is a BYOCSS (Bring Your Own CSS) package. You may add whatever classes or styles that suit your needs as none are provided.

```html
<!-- Trigger element to open modal  -->
<button data-a11ymodal-toggle="modal01">Open modal</button>

<!-- Modal markup, all options are shown  -->
<div id="modal01">
  <div data-a11ymodal-modal>
    Add modal content here
    <button data-a11ymodal-close>Close modal</button>
  </div>
  <div data-a11ymodal-overlay data-a11ymodal-close></div>
</div>
```
**Note:** *Elements to use, source ordering, and other markup is completely customizable.*

**Note:** *Close button within modal is optional.*

**Note:** *Adding `data-a11ymodal-close` to the overlay is optional. Adding the attribute will close the modal when the overlay is clicked.*

Select trigger element to initalise A11yModal on.

```javascript
const modalTrigger = document.querySelector('button');
```

Apply A11yModal to selected element (all options with default values are shown).

```javascript
const modal = new A11yModal(modalTrigger, {
  modalOpenClass: null,
  modalCloseClass: null,
  modalLabeledBy: null,
  modalDescribedBy: null,
});
```

A11yModal will handle all ARIA roles/attributes and focus management, transforming the original HTML into the following:

```html
<!-- Trigger element to open modal  -->
<button data-a11ymodal-toggle="modal01">Open modal</button>

<!-- Modal markup, all options are shown  -->
<div id="modal01" aria-hidden="true">
  <div data-a11ymodal-modal role="dialog">
    Add modal content here
    <button data-a11ymodal-close>Close modal</button>
  </div>
  <div data-a11ymodal-overlay data-a11ymodal-close tabindex="-1"></div>
</div>
```


### Configuration options
#### modalOpenClass
**Type:** `String` **Default:** `null`

**Usage:** Add class to modal container when opened.

#### modalCloseClass
**Type:** `String` **Default:** `null`

**Usage:** Add class to modal container when closed.

#### modalLabeledBy
**Type:** `String` **Default:** `null`

**Usage:** Pass the `id` of an element (usually a heading) to label the modal. Used for accessibility.

#### modalDescribedBy
**Type:** `String` **Default:** `null`

**Usage:** Pass the `id` of an element (usually a paragraph) to describe the modal. Used for accessibility.


### Methods
#### init()
**Usage:** Creates new instance of A11yModal, adds event listeners and adds ARIA attributes.

#### destroy()
**Usage:** Kills the instance of A11yModal, removes all event listerners and reverts `HTML` back to intial state.

#### open()
**Usage:** Open modal associated to trigger.

#### close()
**Usage:** Close modal associated to trigger.


## License
MIT License
