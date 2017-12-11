'use strict';

function interpretControls(control) { // eslint-disable-line no-unused-vars
  // var div = closest(control, 'div.controls', 'body');  // eslint-disable-line no-undef
  const rule_nr = control.id.substring(0, control.id.indexOf('_'));

  var div = document.getElementById(rule_nr+'_rule');


  var schema = div.dataset.schema;
  schema = schema.replace(/%22/g, '"');  // url decode "
  schema = JSON.parse(schema);
  var level = document.getElementById(rule_nr + '_level').value;

  var arr = [level];
  let val;
  schema.forEach(function functionName(param) {
    val = read(param, rule_nr);
    if (val != null)
      arr.push(val);
  });

  // console.log(JSON.stringify(arr));
  // console.log(arr);

  var text_out = document.getElementById(rule_nr + '_text');
  text_out.value = '"' +text_out.name+ '": ' + JSON.stringify(arr);
  text_out.onchange();

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
    else if (schema.type && schema.type === 'arrayOneOf') {
      return readArrayOneOf(schema, name);
    }
    else if (schema.type && schema.type === 'arrayAnyOf') {
      return readArrayAnyOf(schema, name);
    }
  }

  //------------------------------

  function readEnum(schema, name) {
    if (schema.enum.length === 1)
      return schema.enum[0];

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
    var val = parseInt(el.value);
    return isNaN(val)?null:val;
  }

  function readNumber(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
    var val = parseInt(el.value);
    return isNaN(val)?null:val;
  }

  function readString(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1)[0];
    var val = el.value;
    return (val.length===0)?null:val;
  }

  //------------------------------

  function readObject(schema, name) {
    var name1;
    var obj = {};
    let val;

    if (schema.properties) {
      for (let prop in schema.properties) {
        name1 = name + '_' + prop;
        val = read(schema.properties[prop], name1);
        if (val != null) {
          obj[prop] = val;
        }
      }
    }

    return (Object.keys(obj).length===0)?null:obj;
  }

  function readArray(schema, name) {
    // var name1;// = name + '_';
    var arr = [];
    let val;

    if (schema.items) {
      for (let prop in schema.items) {
        // name1 = name + '_' + prop;
        val = read(schema.items[prop], name);
        if (val != null) {
          arr.push(val);
        }
      }
    }

    return (arr.length)?arr:null;
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
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1);
    var arr = [];
    let val;

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked) {
        val = read(schema.items[i], name1+'_'+i);
        if (val != null) {
          arr.push(val);
        }
      }
    }
    return (arr.length)?arr:null;
  }

  function readArrayAnyOf(schema, name) {
    var name1 = name+'_'+schema.type;
    var el = document.getElementsByName(name1);
    var arr = [];
    let val;

    for (var i = 0; i < el.length; i++) {
      if (el[i].checked) {
        val = read(schema.items[i], name1+'_'+i);
        if (val != null) {
          arr.push(val);
        }
      }
    }
    return (arr.length)?arr:null;
  }

}
