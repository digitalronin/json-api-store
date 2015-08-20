(function(global,factory){if(typeof define === 'function' && define.amd){define('Store',['exports','module'],factory);}else if(typeof exports !== 'undefined' && typeof module !== 'undefined'){factory(exports,module);}else {var mod={exports:{}};factory(mod.exports,mod);global.Store = mod.exports;}})(this,function(exports,module){'use strict';var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}var Store=(function(){_createClass(Store,null,[{key:'attr',value:function attr(name,options){if(name && typeof name === 'object'){return Store.attr(null,name);}else {return {type:"attr",'default':options && options['default'],deserialize:function deserialize(data,key){return data.attributes && data.attributes[name || key];}};}}},{key:'hasOne',value:function hasOne(name,options){if(name && typeof name === 'object'){return Store.hasOne(null,name);}else {return {type:"has-one",inverse:options && options.inverse,deserialize:function deserialize(data,key){name = name || key;if(data.relationships && data.relationships[name]){if(data.relationships[name].data === null){return null;}else if(data.relationships[name].data){return this.find(data.relationships[name].data.type,data.relationships[name].data.id);}}}};}}},{key:'hasMany',value:function hasMany(name,options){if(name && typeof name === 'object'){return Store.hasMany(null,name);}else {return {type:"has-many",'default':[],inverse:options && options.inverse,deserialize:function deserialize(data,key){var _this=this;name = name || key;if(data.relationships && data.relationships[name]){if(data.relationships[name].data === null){return [];}else if(data.relationships[name].data){return data.relationships[name].data.map(function(c){return _this.find(c.type,c.id);});}}}};}}}]);function Store(){_classCallCheck(this,Store);this._data = {};this._types = {};}_createClass(Store,[{key:'add',value:function add(object){var _this2=this;if(object){if(object.type && object.id){(function(){var resource=_this2.find(object.type,object.id);var definition=_this2._types[object.type];Object.keys(definition).forEach(function(fieldName){_this2._addField(object,resource,definition,fieldName);});})();}else {throw new TypeError('The data must have a type and id');}}else {throw new TypeError('You must provide data to add');}}},{key:'define',value:function define(name,defition){this._types[name] = defition;}},{key:'find',value:function find(type,id){var _this3=this;var definition;if(type){definition = this._types[type];if(definition){this._data[type] = this._data[type] || {};if(id){if(!this._data[type][id]){this._data[type][id] = {_dependents:[],type:type,id:id};Object.keys(definition).forEach(function(key){_this3._data[type][id][key] = definition[key]['default'];});}return this._data[type][id];}else {return Object.keys(this._data[type]).map(function(x){return _this3._data[type][x];});}}else {throw new TypeError('Unknown type \'' + type + '\'');}}else {throw new TypeError('You must provide a type');}}},{key:'push',value:function push(root){var _this4=this;if(root.data.constructor === Array){root.data.forEach(function(x){return _this4.add(x);});}else {this.add(root.data);}if(root.included){root.included.forEach(function(x){return _this4.add(x);});}}},{key:'remove',value:function remove(type,id){var _this5=this;if(type){if(this._types[type]){if(id){var resource=this._data[type][id];if(resource){this._remove(resource);}}else {Object.keys(this._data[type]).forEach(function(id){return _this5.remove(type,id);});}}else {throw new TypeError('Unknown type \'' + type + '\'');}}else {throw new TypeError('You must provide a type to remove');}}},{key:'_addField',value:function _addField(object,resource,definition,fieldName){var _this6=this;var field=definition[fieldName];var newValue=field.deserialize.call(this,object,fieldName);if(typeof newValue !== "undefined"){if(field.type === "has-one"){if(resource[fieldName]){this._removeInverseRelationship(resource,fieldName,resource[fieldName],field);}if(newValue){this._addInverseRelationship(resource,fieldName,newValue,field);}}else if(field.type === "has-many"){resource[fieldName].forEach(function(r){if(resource[fieldName].indexOf(r) !== -1){_this6._removeInverseRelationship(resource,fieldName,r,field);}});newValue.forEach(function(r){_this6._addInverseRelationship(resource,fieldName,r,field);});}resource[fieldName] = newValue;}}},{key:'_addInverseRelationship',value:function _addInverseRelationship(sourceResource,sourceFieldName,targetResource,sourceField){var targetDefinition=this._types[targetResource.type];var targetFieldName=sourceField.inverse || targetResource.type;var targetField=targetDefinition && targetDefinition[targetFieldName];targetResource._dependents.push({type:sourceResource.type,id:sourceResource.id,fieldName:sourceFieldName});if(targetField){if(targetField.type === "has-one"){sourceResource._dependents.push({type:targetResource.type,id:targetResource.id,fieldName:targetFieldName});targetResource[targetFieldName] = sourceResource;}else if(targetField.type === "has-many"){sourceResource._dependents.push({type:targetResource.type,id:targetResource.id,fieldName:targetFieldName});if(targetResource[targetFieldName].indexOf(sourceResource) === -1){targetResource[targetFieldName].push(sourceResource);}}else if(targetField.type === "attr"){throw new Error('The the inverse relationship for \'' + sourceFieldName + '\' is an attribute (\'' + targetFieldName + '\')');}}else if(sourceField.inverse){throw new Error('The the inverse relationship for \'' + sourceFieldName + '\' is missing (\'' + sourceField.inverse + '\')');}}},{key:'_remove',value:function _remove(resource){var _this7=this;resource._dependents.forEach(function(dependent){var dependentResource=_this7._data[dependent.type][dependent.id];switch(_this7._types[dependent.type][dependent.fieldName].type){case "has-one":{dependentResource[dependent.fieldName] = null;break;}case "has-many":{var index=dependentResource[dependent.fieldName].indexOf(resource);if(index !== -1){dependentResource[dependent.fieldName].splice(index,1);}break;}default:{break;}}dependentResource._dependents = dependentResource._dependents.filter(function(d){return !(d.type === resource.type && d.id === resource.id);});});delete this._data[resource.type][resource.id];}},{key:'_removeInverseRelationship',value:function _removeInverseRelationship(sourceResource,sourceFieldName,targetResource,sourceField){var targetDefinition=this._types[targetResource.type];var targetFieldName=sourceField.inverse || targetResource.type;var targetField=targetDefinition && targetDefinition[targetFieldName];targetResource._dependents = targetResource._dependents.filter(function(r){return !(r.type === sourceResource.type && r.id === sourceResource.id && r.fieldName === sourceFieldName);});if(targetField){if(targetField.type === "has-one"){sourceResource._dependents = sourceResource._dependents.filter(function(r){return !(r.type === targetResource.type && r.id === targetResource.id && r.fieldName === targetFieldName);});targetResource[targetFieldName] = null;}else if(targetField.type === "has-many"){sourceResource._dependents = sourceResource._dependents.filter(function(r){return !(r.type === targetResource.type && r.id === targetResource.id && r.fieldName === targetFieldName);});targetResource[targetFieldName] = targetResource[targetFieldName].filter(function(r){return r !== sourceResource;});}else if(targetField.type === "attr"){throw new Error('The the inverse relationship for \'' + sourceFieldName + '\' is an attribute (\'' + targetFieldName + '\')');}}else if(sourceField.inverse){throw new Error('The the inverse relationship for \'' + sourceFieldName + '\' is missing (\'' + sourceField.inverse + '\')');}}}]);return Store;})();module.exports = Store;});