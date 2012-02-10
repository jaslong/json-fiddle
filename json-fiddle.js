var JSONFiddle = new function () {
  Element.implement({
    collapsableStruct: function () {
      return this.addClass('clickable').addEvent('click', toggleCollapse);
    }
  });

  var toggleCollapse = function (event) {
    event.target.getNext().toggleClass('hidden');
  };

  var jsonText = $('json-text');
  var jsonVisual = $('json-visual');
  var jsonObject = null;

  var init = function () {
    jsonText.addEvents({
      'keyup': jsonTextChange,
      'change': jsonTextChange,
    });

    jsonText.focus();
  };

  var jsonTextChange = function () {
    try {
      jsonObject = JSON.decode(jsonText.value);
    } catch (e) {
      jsonObject = null;
    }
    var output = null;
    if (jsonObject) {
      jsonVisual.empty();
      jsonVisual.grab(render(jsonObject));
      var structs = jsonVisual.getElements('.object-name, .array-name');
      structs.collapsableStruct();
    }
  };

  var render = function (obj) {
    var objType = typeOf(obj);
    if (objType === 'object' || objType === 'array') {
      return renderStruct(obj);
    } else {
      return renderValue(obj);
    }
  };

  var renderStruct = function (obj) {
    var div = new Element('div', {'class':'value ' + typeOf(obj)});
    Object.each(obj, function (value, key) {
      var nameValueDiv = new Element('div');
      nameValueDiv.adopt(new Element('span', {'text':key, 'class':typeOf(value) + '-name name'}), render(value));
      div.grab(nameValueDiv);
    });
    return div;
  };

  var renderValue = function (val) {
    var valType = typeOf(val);
    var span = new Element('span', {text:val, 'class':'value ' + valType});
    if (valType === 'boolean') {
      span.addClass(val);
    }
    return span;
  };

  var objectString = function (obj) {
    var keyValues = [];
    Object.each(obj, function (item, key) {
      var itemStr = null;
      var itemType = typeOf(item);
      if (itemType === 'null') {
        itemStr = 'null';
      } else if (itemType === 'array') {
        itemStr = '[' + item.join(', ') + ']';
      } else if (itemType === 'object') {
        itemStr = objectString(item);
      } else if (itemType === 'string') {
        itemStr = '"' + item + '"';
      } else {
        itemStr = item.toString();
      }
      keyValues.push(key + ':' + itemStr);
    });
    return '{' + keyValues.join(', ') + '}';
  };

  this.domready = init;
};

window.addEvent('domready', JSONFiddle.domready);
