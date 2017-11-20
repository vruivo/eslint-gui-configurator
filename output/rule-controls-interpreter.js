'use strict';

function interpretControls(control) { // eslint-disable-line no-unused-vars
  var div = closest(control, 'div.controls', 'body');  // eslint-disable-line no-undef
  var schema = div.dataset.schema;
  schema = schema.replace(/%22/g, '"');  // url decode "
  schema = JSON.parse(schema);

  var arr = [];
  schema.forEach(function functionName(param) {
    arr.push(read(param, div.id));
  });

  console.log('> ', JSON.stringify(arr));
  console.log(arr);
  return arr;

  //------------------------------

  function read(schema, name) {
    if (schema.enum) {
      return readEnum(schema, name);
    }
    else if (schema.type && schema.type === 'boolean') {
      return readBoolean(schema, name);
    }
    else if (schema.type && schema.type === 'integer') {
      return readInteger(schema, name);
    }
    else if (schema.type && schema.type === 'number') {
      return readNumber(schema, name);
    }
    else if (schema.type && schema.type === 'string') {
      return readString(schema, name);
    }
    else if (schema.type && schema.type === 'object') {
      return readObject(schema, name);
    }
    else if (schema.type && schema.type === 'array') {
      return readArray(schema, name);
    }
    else if (schema.oneOf) {
      return readOneOf(schema, name);
    }
    else if (schema.anyOf) {
      return readAnyOf(schema, name);
    }
    else if (schema.type && schema.type === 'arrayEnum') {
      return readArrayEnum(schema, name);
    }
  }

  //------------------------------

  function readEnum(schema, name) {
    var name1 = name+'_enum';
    var el = document.getElementsByName(name1);

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked)
        return el[i].value;
    }
  }

  function readBoolean(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1);

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked)
        return el[i].value;
    }
  }

  function readInteger(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
    return parseInt(el.value);
  }

  function readNumber(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
    return parseInt(el.value);
  }

  function readString(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
    return el.value;
  }

  //------------------------------

  function readObject(schema, name) {
    var name1;// = name + '_';
    var obj = {};
    // var str = '{';

    if (schema.properties) {
      for (let prop in schema.properties) {
        name1 = name + '_' + prop;
        // console.log('---prop: ' + name1);
        // str += prop + ':';
        // str += read(schema.properties[prop], name1);
        // str += ', ';
        obj[prop] = read(schema.properties[prop], name1);
      }
    }

    // str += '}';
    return obj;
  }

  function readArray(schema, name) {
    // var name1;// = name + '_';
    var arr = [];

    if (schema.properties) {
      for (let prop in schema.properties) {
        // name1 = name + '_' + prop;
        arr.push(read(schema.properties[prop], name));
      }
    }

    return arr;
  }

  //------------------------------

  function readOneOf(schema, name) {
    var name1 = name+'_oneOf';
    var el = document.getElementsByName(name1);

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked) {
        return read(schema.oneOf[i], name1);
      }
    }
  }

  function readAnyOf(schema, name) {
    var name1 = name+'_anyOf';
    var el = document.getElementsByName(name1);

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked) {
        return read(schema.anyOf[i], name1);
      }
    }
  }

  //------------------------------

  function readArrayEnum(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1);
    var arr = [];

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked) {
        arr.push(el[i].value);
      }
    }
    return arr;
  }

  function readArrayOneOf(schema, name) {
  }

  function readArrayAnyOf(schema, name) {
  }

}
