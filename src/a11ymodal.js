/**
 * Create a new A11yModal instance.
 *
 * @class  A11yModal
 * @param  {HTMLElement} trigger  - Element to initialise A11yModal
 * @param  {Object} options       - Options to customize A11yModal instance
 * @return {Object}               - Public init(), destroy(), open(), and close()
 */
function A11yModal(trigger, options) {

  /**
   * Default options used in A11yModal.
   */
  const defaults = {
    modalOpenClass: null,
    modalCloseClass: null,
    modalLabeledBy: null,
    modalDescribedBy: null,
  };

  /**
   * Collect elements.
   */
  const BUTTON = trigger;
  const MODAL_ID = BUTTON.getAttribute('data-a11ymodal-toggle');
  const MODAL = document.getElementById(MODAL_ID);
  const MODAL_OVERLAY = MODAL.querySelector('[data-a11ymodal-overlay]');
  const MODAL_CONTENT = MODAL.querySelector('[data-a11ymodal-modal]');
  const MODAL_CLOSE = _queryToArray('[data-a11ymodal-close]', MODAL);
  const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
  const ELEMENTS = _queryToArray(FOCUSABLE_ELEMENTS.join(','), MODAL_CONTENT);
  const ELEMENTS_LENGTH = ELEMENTS.length;
  let currentFocusedIndex = 0;
  let focusable = ELEMENTS[currentFocusedIndex];
  let isModalActive = null;
  let focusedBeforeOpen = null;

  /**
   * Combined defaults and user options.
   */
  let settings;

  /**
   * If options object passed to A11yModal
   * Combine options with defaults.
   */
  if (options && typeof options == 'object') {
    settings = {...defaults, ...options};
  } else {
    settings = {...defaults};
  }

  /**
   * Initialize A11yModal.
   *
   * @method
   */
  function init() {
    _addARIA();
    _addEvents();
  }
  init();

  /**
   * Remove all added ARIA attributes and events.
   *
   * @method
   */
  function destroy() {
    close();
    _removeARIA();
    _removeEvents();
  }

  /**
   * Open A11yModal drawer.
   *
   * @method
   */
  function open() {
    if (isModalActive) return;
    if (settings.modalCloseClass) MODAL.classList.remove(settings.modalCloseClass);
    if (settings.modalOpenClass) MODAL.classList.add(settings.modalOpenClass);

    MODAL.removeAttribute('aria-hidden');

    focusedBeforeOpen = document.activeElement;
    isModalActive = true;
    currentFocusedIndex = 0;
    focusable = ELEMENTS[currentFocusedIndex];

    if (focusable) focusable.focus();
  }

  /**
   * Close A11yModal drawer.
   *
   * @method
   */
  function close() {
    if (!isModalActive) return;
    if (settings.modalOpenClass) MODAL.classList.remove(settings.modalOpenClass);
    if (settings.modalCloseClass) MODAL.classList.add(settings.modalCloseClass);
    if (focusedBeforeOpen) focusedBeforeOpen.focus();

    MODAL.setAttribute('aria-hidden', 'true');

    isModalActive = false;
  }

  /**
   * Convert a NodeList selection into an array.
   *
   * Take a NodeList and convert it to an array
   * to expose useful array methods and properties.
   *
   * @param  {HTMLElement} el             - NodeList to convert to array
   * @param  {HTMLElement} ctx = document - Context to query for element
   * @return {Array}                      - Array of nodes
   */
  function _queryToArray(el, ctx = document) {
    return [].slice.call(ctx.querySelectorAll(el));
  }

  /**
   * Add ARIA and accessibility attributes.
   *
   * @func
   */
  function _addARIA() {
    if (settings.modalLabeledBy) MODAL_CONTENT.setAttribute('aria-labelledby', settings.modalLabeledBy);
    if (settings.modalDescribedBy) MODAL_CONTENT.setAttribute('aria-describedby', settings.modalDescribedBy);
    if (settings.modalCloseClass) MODAL.classList.add(settings.modalCloseClass);

    MODAL.setAttribute('aria-hidden', 'true');
    MODAL_OVERLAY.setAttribute('tabindex', '-1');
    MODAL_CONTENT.setAttribute('role', 'dialog');
  }

  /**
   * Remove ARIA and accessibility attributes.
   *
   * @func
   */
  function _removeARIA() {
    if (settings.modalCloseClass) MODAL.classList.remove(settings.modalCloseClass);
    if (settings.modalOpenClass) MODAL.classList.remove(settings.modalOpenClass);
    if (settings.modalLabeledBy) MODAL_CONTENT.removeAttribute('aria-labelledby');
    if (settings.modalDescribedBy) MODAL_CONTENT.removeAttribute('aria-describedby');

    MODAL.removeAttribute('aria-hidden');
    MODAL_OVERLAY.removeAttribute('tabindex');
    MODAL_CONTENT.removeAttribute('role');
  }

  /**
   * Trap focus within modal.
   *
   * @func
   */
  function _trapTabKey(event) {
    // Focus on element
    function _focusElement() {
      focusable = ELEMENTS[currentFocusedIndex];

      if (focusable) focusable.focus();
    };

    // Check index of element and move to previous element
    function _focusPrevious() {
      currentFocusedIndex--;

      if (currentFocusedIndex < 0) currentFocusedIndex = ELEMENTS_LENGTH - 1;

      _focusElement();

      return false;
    };

    // Check index of element and move to next element
    function _focusNext() {
      currentFocusedIndex++;

      if (currentFocusedIndex >= ELEMENTS_LENGTH) currentFocusedIndex = 0;

      _focusElement();

      return false;
    };

    // If the `Shift` key is being pressed while tabbing,
    // move the focused element to the previous element
    if (event.shiftKey) {
      event.preventDefault();
      _focusPrevious();
    }
    // If the `Shift` key is not being pressed while tabbing
    // move the focused element to the next element
    else if (!event.shiftKey) {
      event.preventDefault();
      _focusNext();
    }
  }

  /**
   * Keyboard navigation callback.
   *
   * @func
   * @param {Event} event - Get current target of event
   */
  function _bindKeyPress(event) {
    // Close modal when pressing `Esc` key
    if (event.which === 27 && isModalActive) close();

    // Trap `Tab` and `Shift-Tab` key within modal
    if (event.which === 9 && isModalActive) _trapTabKey(event);
  }

  /**
   * Add events to A11yModal instance.
   *
   * @func
   */
  function _addEvents() {
    BUTTON.addEventListener('click', open, false);
    MODAL_CLOSE.forEach((item) => item.addEventListener('click', close, false));
    document.addEventListener('keydown', _bindKeyPress, false);
  }

  /**
   * Remove events to A11yModal instance.
   *
   * @func
   */
  function _removeEvents() {
    BUTTON.removeEventListener('click', open, false);
    MODAL_CLOSE.forEach((item) => item.removeEventListener('click', close, false));
    document.removeEventListener('keydown', _bindKeyPress, false);
  }

  /**
   * Expose A11yModal public methods.
   */
  return {
    init,
    destroy,
    open,
    close
  }
}

/**
 * Export A11yModal component.
 */
if (typeof define === 'function' && define.amd) {
  define(function () { return A11yModal; });
} else if (typeof exports !== 'undefined') {
  // Support Node.js specific `module.exports` (which can be a function)
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = A11yModal;
  }
  // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
  exports.A11yModal = A11yModal;
}

export default A11yModal;
