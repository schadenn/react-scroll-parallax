"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Element = void 0;

var _index = require("../utils/index");

var _index2 = require("../helpers/index");

var _constants = require("../constants");

var _Bounds = _interopRequireDefault(require("./Bounds"));

var _Rect = _interopRequireDefault(require("./Rect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Element =
/*#__PURE__*/
function () {
  function Element(options) {
    _classCallCheck(this, Element);

    this.elInner = options.elInner;
    this.elOuter = options.elOuter;
    this.props = options.props;
    this.scrollAxis = options.scrollAxis;
    this.id = options.id;
    this.offsets = (0, _index2.getOffsets)(this.props);
    this.isInView = null;
    this.percent = 0;
    this.updatePosition = options.scrollAxis === _constants.VERTICAL ? this._updatePositionVertical : this._updatePositionHorizontal;
  }

  _createClass(Element, [{
    key: "updateProps",
    value: function updateProps(nextProps) {
      this.props = _objectSpread({}, this.props, {}, nextProps);
      this.offsets = (0, _index2.getOffsets)(nextProps);
      return this;
    }
  }, {
    key: "setCachedAttributes",
    value: function setCachedAttributes(view, scroll) {
      this.rect = new _Rect.default(this.elOuter, view, scroll);
      this.bounds = new _Bounds.default(this.rect, this.offsets, view);
      return this;
    }
  }, {
    key: "_updatePositionHorizontal",
    value: function _updatePositionHorizontal(view, scroll) {
      this.isInView = (0, _index2.isElementInView)(this.bounds.left, this.bounds.right, view.width, scroll.x);
      if (!this.isInView) return this;
      this.percent = (0, _index2.percentMoved)(this.rect.left, this.rect.originTotalDistX, view.width, scroll.x);
      var parallaxStyles = (0, _index2.getParallaxStyles)(this.elInner, this.offsets, this.percent);
      return _objectSpread({}, this, {
        parallaxStyles: parallaxStyles
      });
    }
  }, {
    key: "_updatePositionVertical",
    value: function _updatePositionVertical(view, scroll) {
      this.isInView = (0, _index2.isElementInView)(this.bounds.top, this.bounds.bottom, view.height, scroll.y);
      if (!this.isInView) return this;
      this.percent = (0, _index2.percentMoved)(this.rect.top, this.rect.originTotalDistY, view.height, scroll.y);
      var parallaxStyles = (0, _index2.getParallaxStyles)(this.elInner, this.offsets, this.percent);
      return _objectSpread({}, this, {
        parallaxStyles: parallaxStyles
      });
    }
  }]);

  return Element;
}();

exports.Element = Element;