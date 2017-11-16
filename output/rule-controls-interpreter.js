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

    if (schema.type && schema.type === 'boolean') {
      return readBoolean(schema, name);
    }
    else if (schema.type && schema.type === 'object') {
      return readObject(schema, name);
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
  }

  function readNumber(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
  }

  function readString(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
  }

  //---------------

  function readObject(schema, name) {
    // console.log('--object--');
    var name1 = name + '_';
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
}
