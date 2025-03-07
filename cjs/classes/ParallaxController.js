"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _helpers = require("../helpers");

var _View = require("./View");

var _Scroll = require("./Scroll");

var _Element = require("./Element");

var _constants = require("../constants");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * -------------------------------------------------------
 * Parallax Controller
 * -------------------------------------------------------
 *
 * The global controller for setting up window scroll/resize
 * listeners, managing and caching parallax element positions,
 * determining which elements are inside the viewport based on
 * scroll position, and then updating parallax element styles
 * based on x/y offsets and current scroll position.
 *
 */
function ParallaxController(_ref) {
  var _ref$scrollAxis = _ref.scrollAxis,
      scrollAxis = _ref$scrollAxis === void 0 ? _constants.VERTICAL : _ref$scrollAxis,
      scrollContainer = _ref.scrollContainer,
      onUpdate = _ref.onUpdate;
  // All parallax elements to be updated
  var elements = [];
  var hasScrollContainer = !!scrollContainer;
  var viewEl = scrollContainer || window; // Scroll and View

  var x = hasScrollContainer ? viewEl.scrollLeft : window.pageXOffset;
  var y = hasScrollContainer ? viewEl.scrollTop : window.pageYOffset;
  var scroll = new _Scroll.Scroll(x, y);
  var view = new _View.View({
    width: 0,
    height: 0,
    scrollContainer: scrollContainer
  }); // Ticking

  var ticking = false; // Passive support

  var supportsPassive = (0, _utils.testForPassiveScroll)();

  function _addListeners(el) {
    el.addEventListener('scroll', _handleScroll, supportsPassive ? {
      passive: true
    } : false);
    window.addEventListener('resize', _handleResize, false);
  }

  function _removeListeners(el) {
    el.removeEventListener('scroll', _handleScroll, supportsPassive ? {
      passive: true
    } : false);
    window.removeEventListener('resize', _handleResize, false);
  }

  _addListeners(viewEl);

  _setViewSize();
  /**
   * Window scroll handler sets scroll position
   * and then calls '_updateAllElements()'.
   */


  function _handleScroll() {
    // Save current scroll
    // Supports IE 9 and up.
    var nx = hasScrollContainer ? viewEl.scrollLeft : window.pageXOffset;
    var ny = hasScrollContainer ? viewEl.scrollTop : window.pageYOffset;
    scroll.setScroll(nx, ny); // Only called if the last animation request has been
    // completed and there are parallax elements to update

    if (!ticking && elements.length > 0) {
      ticking = true;
      window.requestAnimationFrame(_updateAllElements);
    }
  }
  /**
   * Window resize handler. Sets the new window inner height
   * then updates parallax element attributes and positions.
   */


  function _handleResize() {
    _setViewSize();

    _updateAllElements({
      updateCache: true
    });
  }
  /**
   * Update element positions.
   * Determines if the element is in view based on the cached
   * attributes, if so set the elements parallax styles.
   */


  function _updateAllElements() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        updateCache = _ref2.updateCache;

    elements = elements.map(function (element) {
      if (updateCache) {
        element.setCachedAttributes(view, scroll);
      }

      var newElm = _updateElementPosition(element);

      return newElm;
    });
    onUpdate(elements); // reset ticking so more animations can be called

    ticking = false;
  }
  /**
   * Update element positions.
   * Determines if the element is in view based on the cached
   * attributes, if so set the elements parallax styles.
   */


  function _updateElementPosition(element) {
    if (element.props.disabled) return;
    return element.updatePosition(view, scroll);
  }
  /**
   * Cache the window height.
   */


  function _setViewSize() {
    if (hasScrollContainer) {
      var _width = viewEl.offsetWidth;
      var _height = viewEl.offsetHeight;
      return view.setSize(_width, _height);
    }

    var html = document.documentElement;
    var width = window.innerWidth || html.clientWidth;
    var height = window.innerHeight || html.clientHeight;
    return view.setSize(width, height);
  }
  /**
   * -------------------------------------------------------
   * Public methods
   * -------------------------------------------------------
   */

  /**
   * Gets the parallax elements in the controller
   * @return {array} parallax elements
   */


  this.getElements = function () {
    return elements;
  };
  /**
   * Creates a new parallax element object with new id
   * and options to store in the 'elements' array.
   * @param {object} options
   * @return {object} element
   */


  this.createElement = function (options) {
    var newElement = new _Element.Element(_objectSpread({}, options, {
      scrollAxis: scrollAxis
    }));
    newElement.setCachedAttributes(view, scroll);
    elements = [].concat(_toConsumableArray(elements), [newElement]);

    _updateElementPosition(newElement);

    return newElement;
  };
  /**
   * Remove an element by id
   * @param {object} element
   */


  this.removeElementById = function (id) {
    if (!elements) return;
    elements = elements.filter(function (el) {
      return el.id !== id;
    });
  };
  /**
   * Updates an existing parallax element object with new options.
   * @param {object} element
   * @param {object} options
   */


  this.updateElementPropsById = function (id, props) {
    elements = elements.map(function (el) {
      if (el.id === id) {
        return el.updateProps(props);
      }

      return el;
    });
    this.update();
  };
  /**
   * Remove element styles.
   * @param {object} element
   */


  this.resetElementStyles = function (element) {
    (0, _helpers.resetStyles)(element);
  };
  /**
   * Updates all parallax element attributes and positions.
   */


  this.update = function () {
    _setViewSize();

    _updateAllElements({
      updateCache: true
    });
  };

  this.updateScrollContainer = function (el) {
    // remove existing listeners with current el first
    _removeListeners(viewEl);

    viewEl = el;
    hasScrollContainer = !!el;
    view = new _View.View({
      width: 0,
      height: 0,
      scrollContainer: el
    });

    _setViewSize();

    _addListeners(viewEl);

    _updateAllElements({
      updateCache: true
    });
  };
  /**
   * Removes listeners, reset all styles then nullifies the global ParallaxController.
   */


  this.destroy = function () {
    _removeListeners(viewEl);

    elements.forEach(function (element) {
      return (0, _helpers.resetStyles)(element);
    });
    elements = undefined;
  };
}
/**
 * Static method to instantiate the ParallaxController.
 * @returns {Object} ParallaxController
 */


ParallaxController.init = function (options) {
  var hasWindow = typeof window !== 'undefined';

  if (!hasWindow) {
    throw new Error('Looks like ParallaxController.init() was called on the server. This method must be called on the client.');
  }

  return new ParallaxController(options);
};

var _default = ParallaxController;
exports.default = _default;