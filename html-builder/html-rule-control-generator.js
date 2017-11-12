'use strict';

var cc=0;

module.exports = function generateRuleControls(schema) {
  var html = JSON.stringify(schema, null, 3) + '<br>';

  html += '<input type="text" width="100%" class="rule-text">';
  schema.forEach(function schemaReader(spec) {
    html += '<div style="border: 1px solid #aaa; min-height:5px; margin-top: 3px;">';

    html += readParameter(spec);

    html += '</div>';
  });
  return html;

  //---------------------------------------------------------------

  function readParameter(spec) {
    if (spec.enum) {
      return readEnum(spec);
    }
    else if (spec.type && spec.type === 'boolean') {
      return readBoolean(spec);
    }
    else if (spec.type && spec.type === 'integer') {
      return readInteger(spec);
    }
    else if (spec.type && spec.type === 'number') {
      return readInteger(spec);
    }
    else if (spec.type && spec.type === 'string') {
      return readString(spec);
    }
    else if (spec.type && spec.type === 'object') {
      return readObject(spec);
    }
    // else if (spec.type && spec.type === 'array') {
    //   return readArray(spec);
    // }
    else if (spec.oneOf) {    // choose 1
      return readOneOf(spec);
    }
    else if (spec.anyOf) {    // 0 or 1
      return readAnyOf(spec);
    }
  }

  //---------------------------------------------------------------

  function readEnum(param) {
    var html = '';
    if (param.enum.length > 1) {
      param.enum.forEach(function functionName(item) {
        html += '<input type="radio" name="enum'+ cc +'" value="'+item+'"> ' + item;
      });
    }
    else {
      html = param.enum[0];
    }

    cc++;
    return html;
  }

  function readBoolean() {
    var html = '<input type="radio" name="boolean'+ cc +'" value="true" checked> true' +
               '<input type="radio" name="boolean'+ cc +'" value="false"> false';
    cc++;
    return html;
  }

  function readInteger(spec) {
    var html = '<input type="number"';
    if (spec.minimum != null)
      html += ' min="'+ spec.minimum +'"';
    if (spec.maximum != null)
      html += ' max="'+ spec.maximum +'"';
    html += '>';
    return html;
  }

  function readString(spec) {
    //'not', 'minLength']);
    var html = '<input type="text"';
    html += '>';
    return html;
  }


  function readObject(param) {
    // if (param.properties == null && param.additionalProperties == null) {
    //   throw 'Object without properties';
    // }

    // checkForUnknownParameters(param, ['type', 'properties',
    //   'additionalProperties', 'required', 'patternProperties', 'minProperties']);

    // additionalProperties are not defined completely in the schema,
    //  must refer to the docs for the full syntax

    // if additionalProperties exists but is false it isn't doing anything
    // if (param.additionalProperties === false) {
    //   delete param.additionalProperties;
    // }
    var html = '';
    html += '<table><tbody>';
    for (let prop in param.properties) {
      // if (prop === 'anyOf' || prop === 'oneOf') {   // happens once, in operator-linebreak
      //   try {
      //     param.properties[prop] = readParameter(param.properties);
      //   } catch (e) {
      //     if (!param.additionalProperties) {
      //       delete param.properties;
      //       param.additionalProperties = { 'type':'string' };
      //     }
      //     else
      //       throw 'Invalid object param';
      //   }
      // }
      // else
      html += '<tr>';
      html += '<td><span>' + prop + ': </span></td>';
      html += '<td>'+ readParameter(param.properties[prop]) +'</td>';
      html+= '</tr>';
      // html += '<br>';
    }
    html += '</tbody></table>';
    return html;
  }


  function readOneOf(param) {
    var html = '';
    var counter = cc;

    // html += '<div class="oneof-div">';
    // param.oneOf.forEach(function functionName(item) {
    //   html += '<input type="radio" name="oneof'+ counter +'" value="true"> '+
    //           '<div class="oneof-div2">'+ readParameter(item) +'</div><br>';
    // });
    // html += '</div>';

    html += '<table><tbody>';
    param.oneOf.forEach(function functionName(item) {
      html += '<tr>';
      html += '<td><input type="radio" name="oneof'+ counter +'" > </td>'+
              '<td>'+ readParameter(item) +'</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    cc++;
    return html;
  }

  function readAnyOf(param) {
    var html = '';
    var counter = cc;

    html += '<table><tbody>';
    param.anyOf.forEach(function functionName(item) {
      html += '<tr>';
      html += '<td><input type="checkbox" name="anyof'+ counter +'" onchange="checkOnlyOne(this)"> </td>'+
              '<td>'+ readParameter(item) +'</td>';
      html += '</tr>';

    });
    html += '</tbody></table>';

    cc++;
    return html;
  }
};
