'use strict';

function interpretControls(control) { // eslint-disable-line no-unused-vars
  // var root = closest(control, 'div.controls', 'body');  // eslint-disable-line no-undef
  var root = control.name;
  root = root.substring(0, root.indexOf('_'));
  var schema = JSON.parse('[ { "type": "object", "properties": { "getWithoutSet": { "type": "boolean" }, "setWithoutGet": { "type": "boolean" } } } ]');
  // schema = JSON.parse(schema);

  // var str = '';
  var arr = [];
  schema.forEach(function functionName(param) {
    arr.push(read(param, root));
  });

  console.log('> ');
  console.log(arr);
  return arr;

  //------------------------------

  function read(schema, name) {
    // var str = '';
    // var arr =[];
    // schema.forEach(function functionName(param, i) {
    if (schema.type && schema.type === 'boolean') {
      return readBoolean(schema, name);
    }
    else if (schema.type && schema.type === 'object') {
      return readObject(schema, name);
    }
    // });

    // return str;
  }

  //------------------------------

  function readBoolean(schema, name) {
    var name1 = name+'_'+schema.type;
    var x = document.getElementsByName(name1);
    for (var i = 0; i < x.length; i++) {
      if (x[i].checked)
        return x[i].value;
    }
  }

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
