'use strict';

// var cc=0;

module.exports = function generateRuleControls(schema, sch_nr) {
  var schema_str = JSON.stringify(schema);
  var html = schema_str + '<br>';
  schema_str = schema_str.replace(/"/g, '%22');  // url encode "
  html += '<input type="text" width="100%" class="rule-text">';
  schema.forEach(function schemaReader(spec) {
    html += '<div class="controls" id="'+sch_nr+'" data-schema="'+schema_str+'" style="border: 1px solid #aaa; min-height:5px; margin-top: 3px;">';

    html += readParameter(spec, ''+sch_nr);

    html += '</div>';
  });
  return html;

  //---------------------------------------------------------------

  function readParameter(spec, name) {
    if (spec.enum) {
      return readEnum(spec, name);
    }
    else if (spec.type && spec.type === 'boolean') {
      return readBoolean(spec, name);
    }
    else if (spec.type && spec.type === 'integer') {
      return readInteger(spec, name);
    }
    else if (spec.type && spec.type === 'number') {
      return readInteger(spec, name);
    }
    else if (spec.type && spec.type === 'string') {
      return readString(spec, name);
    }
    else if (spec.type && spec.type === 'object') {
      return readObject(spec, name);
    }
    else if (spec.type && spec.type === 'array') {
      return readArray(spec, name);
    }
    else if (spec.type && spec.type === 'arrayEnum') {  // custom
      return readArrayEnum(spec, name);
    }
    else if (spec.type && spec.type === 'arrayAnyOf') {  // custom
      return readArrayAnyOf(spec, name);
    }
    else if (spec.type && spec.type === 'arrayOneOf') {  // custom
      return readArrayOneOf(spec, name);
    }
    else if (spec.oneOf) {    // choose 1
      return readOneOf(spec, name);
    }
    else if (spec.anyOf) {    // 0 or 1
      return readAnyOf(spec, name);
    }
    else {
      throw 'Unknown parameter ' + spec;
    }
  }

  //---------------------------------------------------------------

  function readEnum(spec, name) {
    var html = '';
    if (spec.enum.length > 1) {
      spec.enum.forEach(function functionName(item) {
        html += '<input type="radio" name="'+name+'_enum" value="'+item+'" onchange="interpretControls(this)"> ' + item;
      });
    }
    else {
      html = spec.enum[0];
    }

    // cc++;
    return html;
  }

  function readBoolean(spec, name) {
    var name1 = name + '_' + spec.type;
    var html = '<input type="radio" name="'+name1+'" value="true" checked onchange="interpretControls(this)"> true' +
               '<input type="radio" name="'+name1+'" value="false" onchange="interpretControls(this)"> false';
    // cc++;
    return html;
  }

  function readInteger(spec, name) {
    var name1 = name + '_' + spec.type;
    var html = '<input name="'+name1+'" type="number"';
    if (spec.minimum != null)
      html += ' min="'+ spec.minimum +'"';
    if (spec.maximum != null)
      html += ' max="'+ spec.maximum +'"';
    html += 'onchange="interpretControls(this)">';
    return html;
  }

  function readString(spec, name) {
    var name1 = name + '_' + spec.type;
    var html = '<input name="'+name1+'" type="text"';
    html += 'onchange="interpretControls(this)">';
    return html;
  }


  function readObject(spec, name) {
    // if (spec.properties == null && spec.additionalProperties == null) {
    //   throw 'Object without properties';
    // }

    // checkForUnknownParameters(spec, ['type', 'properties',
    //   'additionalProperties', 'required', 'patternProperties', 'minProperties']);

    // additionalProperties are not defined completely in the schema,
    //  must refer to the docs for the full syntax

    // if additionalProperties exists but is false it isn't doing anything
    // if (spec.additionalProperties === false) {
    //   delete spec.additionalProperties;
    // }
    var html = '';
    if (spec.additionalProperties && spec.additionalProperties !== false) {
      html += '<a href="abc">Not enough information on schema. Check rule documentation</a>';
    }
    else {
      html += '<table><tbody>';
      for (let prop in spec.properties) {
        // if (prop === 'anyOf' || prop === 'oneOf') {   // happens once, in operator-linebreak
        //   try {
        //     spec.properties[prop] = readParameter(spec.properties);
        //   } catch (e) {
        //     if (!spec.additionalProperties) {
        //       delete spec.properties;
        //       spec.additionalProperties = { 'type':'string' };
        //     }
        //     else
        //       throw 'Invalid object spec';
        //   }
        // }
        // else
        html += '<tr>';
        html += '<td><span>' + prop + ': </span></td>';
        html += '<td>'+ readParameter(spec.properties[prop], name+'_'+prop) +'</td>';
        html+= '</tr>';
        // html += '<br>';
      }
      html += '</tbody></table>';
    }
    return html;
  }

  function readArray(spec, name) {
    var html = '';
    html += '<table><tbody>';
    for (let prop in spec.items) {
      html += '<tr>';
      // html += '<td><span>' + prop + ': </span></td>';
      html += '<td>'+ readParameter(spec.items[prop], name) +'</td>';
      if (spec.additionalItems != false && spec.maxItems != spec.items.length)
        html += '<td>+</td>';
      html+= '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function readArrayEnum(spec, name) {
    var html = '<table><tbody>';
    // var counter = cc++;
    var name1 = name + '_' + spec.type;

    for (let prop in spec.items) {
      html += '<input type="checkbox" name="' + name1 + '" value="' +spec.items[prop]+
              '" onchange="interpretControls(this)"> '+ spec.items[prop];
    }
    html += '</tbody></table>';
    return html;
  }

  function readArrayAnyOf(spec, name) {
    var html = '<table><tbody>';
    // var counter = cc++;
    var name1 = name + '_' + spec.type;

    for (let prop in spec.items) {
      html += '<tr>';
      html += '<td><input type="checkbox" name="'+name1+'" onchange="checkOnlyOne(this)"> </td>'+
              '<td>'+ readParameter(spec.items[prop], name1) +'</td>';
      html += '<td>+</td>';
      html+= '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function readArrayOneOf(spec, name) {
    var html = '<table><tbody>';
    // var counter = cc++;
    var name1 = name + '_' + spec.type;

    for (let prop in spec.items) {
      html += '<tr>';
      html += '<td><input type="radio" name="'+name1+'" onchange="interpretControls(this)"> </td>'+
              '<td>'+ readParameter(spec.items[prop], name1) +'</td>';
      html += '<td>+</td>';
      html+= '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }


  function readOneOf(spec, name) {
    var html = '';
    // var counter = cc++;
    var name1 = name + '_oneOf';

    html += '<table><tbody>';
    spec.oneOf.forEach(function functionName(item) {
      html += '<tr>';
      html += '<td><input type="radio" name="'+name1+'" onchange="interpretControls(this)"> </td>'+
              '<td>'+ readParameter(item, name1) +'</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    return html;
  }

  function readAnyOf(spec, name) {
    var html = '';
    // var counter = cc++;
    var name1 = name + '_anyOf';

    html += '<table><tbody>';
    spec.anyOf.forEach(function functionName(item) {
      html += '<tr>';
      html += '<td><input type="checkbox" name="'+name1+'" onchange="checkOnlyOne(this)"> </td>'+
              '<td>'+ readParameter(item, name1) +'</td>';
      html += '</tr>';

    });
    html += '</tbody></table>';

    return html;
  }
};
