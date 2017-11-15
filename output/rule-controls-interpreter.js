'use strict';

function interpretControls(control) {
  var root = closest(control, 'div.controls', 'body');
  var schema = '[ { "type": "object", "properties": { "getWithoutSet": { "type": "boolean" }, "setWithoutGet": { "type": "boolean" } } } ]';

  var str = '';
  schema.forEach(function functionName(param) {
    str += read(param, root);
  });

  console.log(str);
  return str;

  //------------------------------

  function read(schema, dom) {
    var str = '';
    // schema.forEach(function functionName(param, i) {
    if (schema.type && schema.type === 'boolean') {
      //
    }
    else if (schema.type && schema.type === 'object') {
      str += readObject(schema, dom);
    }
    // });

    return str;
  }

  //------------------------------

  function readObject(schema, dom) {
    console.log('--object--');

    // find object
    var objhtml = dom.querySelector('tbody');

  }
}
