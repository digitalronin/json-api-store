(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Store = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Array.prototype.find - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
// For all details and docs: https://github.com/paulmillr/array.prototype.find
// Fixes and tests supplied by Duncan Hall <http://duncanhall.net> 
(function(globals){
  if (Array.prototype.find) return;

  var find = function(predicate) {
    var list = Object(this);
    var length = list.length < 0 ? 0 : list.length >>> 0; // ES.ToUint32;
    if (length === 0) return undefined;
    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
      throw new TypeError('Array#find: predicate must be a function');
    }
    var thisArg = arguments[1];
    for (var i = 0, value; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) return value;
    }
    return undefined;
  };

  if (Object.defineProperty) {
    try {
      Object.defineProperty(Array.prototype, 'find', {
        value: find, configurable: true, enumerable: false, writable: true
      });
    } catch(e) {}
  }

  if (!Array.prototype.find) {
    Array.prototype.find = find;
  }
})(this);

},{}],2:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();require("array.prototype.find");var Store=function(){function e(){_classCallCheck(this,e),this._collectionListeners={added:{},updated:{},removed:{}},this._data={},this._resourceListeners={added:{},updated:{},removed:{}},this._types={}}return _createClass(e,null,[{key:"attr",value:function(t,n){return t&&"object"==typeof t?e.attr(null,t):{type:"attr","default":n&&n["default"],deserialize:function(e,n){return e.attributes&&e.attributes[t||n]}}}},{key:"hasOne",value:function(t,n){return t&&"object"==typeof t?e.hasOne(null,t):{type:"has-one",inverse:n&&n.inverse,deserialize:function(e,n){if(t=t||n,e.relationships&&e.relationships[t]){if(null===e.relationships[t].data)return null;if(e.relationships[t].data)return this.find(e.relationships[t].data.type,e.relationships[t].data.id)}}}}},{key:"hasMany",value:function(t,n){return t&&"object"==typeof t?e.hasMany(null,t):{type:"has-many","default":[],inverse:n&&n.inverse,deserialize:function(e,n){var r=this;if(t=t||n,e.relationships&&e.relationships[t]){if(null===e.relationships[t].data)return[];if(e.relationships[t].data)return e.relationships[t].data.map(function(e){return r.find(e.type,e.id)})}}}}}]),_createClass(e,[{key:"add",value:function(e){var t=this;if(!e)throw new TypeError("You must provide data to add");if(!e.type||!e.id)throw new TypeError("The data must have a type and id");!function(){var n=t._data[e.type]&&t._data[e.type][e.id]?"updated":"added",r=t.find(e.type,e.id),i=t._types[e.type];Object.keys(i).forEach(function(n){"_"!==n[0]&&t._addField(e,r,i,n)}),t._resourceListeners[n][e.type]&&t._resourceListeners[n][e.type][e.id]&&t._resourceListeners[n][e.type][e.id].forEach(function(e){return e[0].call(e[1],r)}),t._collectionListeners[n][e.type]&&t._collectionListeners[n][e.type].forEach(function(e){return e[0].call(e[1],r)})}()}},{key:"define",value:function(e,t){var n=this;e=e.constructor===Array?e:[e],t._names=e,e.forEach(function(e){if(n._types[e])throw new Error("The type '"+e+"' has already been defined.");n._types[e]=t})}},{key:"find",value:function(e,t){var n=this;if(!e)throw new TypeError("You must provide a type");var r=function(){var r=n._types[e];if(r)return n._data[e]||!function(){var e={};r._names.forEach(function(t){return n._data[t]=e})}(),t?(n._data[e][t]||(n._data[e][t]={_dependents:[],type:e,id:t},Object.keys(r).forEach(function(i){"_"!==i[0]&&(n._data[e][t][i]=r[i]["default"])})),{v:n._data[e][t]}):{v:Object.keys(n._data[e]).map(function(t){return n._data[e][t]})};throw new TypeError("Unknown type '"+e+"'")}();return"object"==typeof r?r.v:void 0}},{key:"off",value:function(e,t,n,r){var i=this;if(!this._resourceListeners[e]||!this._collectionListeners[e])throw new Error("Unknown event '"+e+"'");if(!this._types[t])throw new Error("Unknown type '"+t+"'");n&&"[object Function]"==={}.toString.call(n)?this.off.call(this,e,t,null,n,r):this._types[t]._names.forEach(function(t){n?i._resourceListeners[e][t]&&i._resourceListeners[e][t][n]&&(i._resourceListeners[e][t][n]=i._resourceListeners[e][t][n].filter(function(e){return e[0]!==r})):i._collectionListeners[e][t]&&(i._collectionListeners[e][t]=i._collectionListeners[e][t].filter(function(e){return e[0]!==r}))})}},{key:"on",value:function(e,t,n,r,i){var s=this;if(!this._resourceListeners[e]||!this._collectionListeners[e])throw new Error("Unknown event '"+e+"'");if(!this._types[t])throw new Error("Unknown type '"+t+"'");n&&"[object Function]"==={}.toString.call(n)?this.on.call(this,e,t,null,n,r):this._types[t]._names.forEach(function(t){n?(s._resourceListeners[e][t]=s._resourceListeners[e][t]||{},s._resourceListeners[e][t][n]=s._resourceListeners[e][t][n]||[],s._resourceListeners[e][t][n].find(function(e){return e[0]===r})||s._resourceListeners[e][t][n].push([r,i])):(s._collectionListeners[e][t]=s._collectionListeners[e][t]||[],s._collectionListeners[e][t].find(function(e){return e[0]===r})||s._collectionListeners[e][t].push([r,i]))})}},{key:"push",value:function(e){var t=this;e.data.constructor===Array?e.data.forEach(function(e){return t.add(e)}):this.add(e.data),e.included&&e.included.forEach(function(e){return t.add(e)})}},{key:"remove",value:function(e,t){var n=this;if(!e)throw new TypeError("You must provide a type to remove");if(!this._types[e])throw new TypeError("Unknown type '"+e+"'");t?!function(){var r=n._data[e][t];r&&(n._remove(r),n._resourceListeners.removed[e]&&n._resourceListeners.removed[e][t]&&n._resourceListeners.removed[e][t].forEach(function(e){return e[0].call(e[1],r)}),n._collectionListeners.removed[e]&&n._collectionListeners.removed[e].forEach(function(e){return e[0].call(e[1],r)}))}():Object.keys(this._data[e]).forEach(function(t){return n.remove(e,t)})}},{key:"_addField",value:function(e,t,n,r){var i=this,s=n[r],o=s.deserialize.call(this,e,r);"undefined"!=typeof o&&("has-one"===s.type?(t[r]&&this._removeInverseRelationship(t,r,t[r],s),o&&this._addInverseRelationship(t,r,o,s)):"has-many"===s.type&&(t[r].forEach(function(e){-1!==t[r].indexOf(e)&&i._removeInverseRelationship(t,r,e,s)}),o.forEach(function(e){i._addInverseRelationship(t,r,e,s)})),t[r]=o)}},{key:"_addInverseRelationship",value:function(e,t,n,r){var i=this._types[n.type],s=this._types[e.type];if(i){var o=[r.inverse].concat(s._names).find(function(e){return i[e]}),a=i&&i[o];if(n._dependents.push({type:e.type,id:e.id,fieldName:t}),a){if("has-one"===a.type)e._dependents.push({type:n.type,id:n.id,fieldName:o}),n[o]=e;else if("has-many"===a.type)e._dependents.push({type:n.type,id:n.id,fieldName:o}),-1===n[o].indexOf(e)&&n[o].push(e);else if("attr"===a.type)throw new Error("The the inverse relationship for '"+t+"' is an attribute ('"+o+"')")}else if(r.inverse)throw new Error("The the inverse relationship for '"+t+"' is missing ('"+r.inverse+"')")}}},{key:"_remove",value:function(e){var t=this;e._dependents.forEach(function(n){var r=t._data[n.type][n.id];switch(t._types[n.type][n.fieldName].type){case"has-one":r[n.fieldName]=null;break;case"has-many":var i=r[n.fieldName].indexOf(e);-1!==i&&r[n.fieldName].splice(i,1)}r._dependents=r._dependents.filter(function(t){return!(t.type===e.type&&t.id===e.id)})}),delete this._data[e.type][e.id]}},{key:"_removeInverseRelationship",value:function(e,t,n,r){var i=this._types[n.type],s=r.inverse||e.type,o=i&&i[s];if(n._dependents=n._dependents.filter(function(n){return!(n.type===e.type&&n.id===e.id&&n.fieldName===t)}),o){if("has-one"===o.type)e._dependents=e._dependents.filter(function(e){return!(e.type===n.type&&e.id===n.id&&e.fieldName===s)}),n[s]=null;else if("has-many"===o.type)e._dependents=e._dependents.filter(function(e){return!(e.type===n.type&&e.id===n.id&&e.fieldName===s)}),n[s]=n[s].filter(function(t){return t!==e});else if("attr"===o.type)throw new Error("The the inverse relationship for '"+t+"' is an attribute ('"+s+"')")}else if(r.inverse)throw new Error("The the inverse relationship for '"+t+"' is missing ('"+r.inverse+"')")}}]),e}();exports["default"]=Store,module.exports=exports["default"];

},{"array.prototype.find":1}]},{},[2])(2)
});