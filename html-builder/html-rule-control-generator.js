'use strict';

// var cc=0;

module.exports = function generateRuleControls(schema, sch_nr, rule_name) {
  var schema_str = JSON.stringify(schema);
  var html = '';
  html += '<div style="overflow-wrap:break-word; width:1000px; color:green;">'+schema_str + '</div>'+'<br>';  // debug line
  schema_str = schema_str.replace(/"/g, '%22');  // url encode "
  html += '<div class="controls" id="'+sch_nr+'_rule" data-schema="'+schema_str+'" style="border: 1px solid #aaa; min-height:5px; margin-top: 3px;">';
  // text box with rule configuration
  html += '<input id="'+sch_nr+'_text" name="'+rule_name+'" type="text" width="100%" size="60"' +
    'class="rule-text" readonly="true" onchange="updateRule(this)">';

  schema.forEach(function schemaReader(spec) {
    // html += '<div class="controls" id="'+sch_nr+'" data-schema="'+schema_str+'" style="border: 1px solid #aaa; min-height:5px; margin-top: 3px;">';

    html += writeParameter(spec, ''+sch_nr);

    // html += '</div>';
  });
  html += '</div>';
  return html;

  //---------------------------------------------------------------

  function writeParameter(spec, name) {
    if (spec.enum) {
      return writeEnum(spec, name);
    }
    else if (spec.type && spec.type === 'boolean') {
      return writeBoolean(spec, name);
    }
    else if (spec.type && spec.type === 'integer') {
      return writeInteger(spec, name);
    }
    else if (spec.type && spec.type === 'number') {
      return writeInteger(spec, name);
    }
    else if (spec.type && spec.type === 'string') {
      return writeString(spec, name);
    }
    else if (spec.type && spec.type === 'object') {
      return writeObject(spec, name);
    }
    else if (spec.type && spec.type === 'array') {
      return writeArray(spec, name);
    }
    else if (spec.type && spec.type === 'arrayEnum') {  // custom
      return writeArrayEnum(spec, name);
    }
    else if (spec.type && spec.type === 'arrayAnyOf') {  // custom
      return writeArrayAnyOf(spec, name);
    }
    else if (spec.type && spec.type === 'arrayOneOf') {  // custom
      return writeArrayOneOf(spec, name);
    }
    else if (spec.oneOf) {    // choose 1
      return writeOneOf(spec, name);
    }
    else if (spec.anyOf) {    // 0 or 1
      return writeAnyOf(spec, name);
    }
    else {
      throw 'Unknown parameter ' + spec;
    }
  }

  //---------------------------------------------------------------

  function writeEnum(spec, name) {
    var html = '';
    var name1 = name+'_enum';
    if (spec.enum.length > 1) {
      spec.enum.forEach(function functionName(item) {
        html += '<input type="radio" id="'+name1+'" name="'+name1+'" '+
                'value="'+item+'" onchange="interpretControls(this)"> ' + item;
      });
    }
    else {
      // html = spec.enum[0];
      var item = spec.enum[0];
      html = '<input type="checkbox" id="'+name1+'" name="'+name1+'" '+
             'value="'+item+'" onchange="interpretControls(this)"> ' + item;
    }

    // cc++;
    return html;
  }

  function writeBoolean(spec, name) {
    var name1 = name + '_' + spec.type;
    var html = '<input type="radio" id="'+name1+'" name="'+name1+'" '+
                  'value="true" checked onchange="interpretControls(this)"> true' +
               '<input type="radio" id="'+name1+'" name="'+name1+'" '+
                  'value="false" onchange="interpretControls(this)"> false';
    // cc++;
    return html;
  }

  function writeInteger(spec, name) {
    var name1 = name + '_' + spec.type;
    var html = '<input id="'+name1+'" name="'+name1+'" type="number"';
    if (spec.minimum != null)
      html += ' min="'+ spec.minimum +'"';
    if (spec.maximum != null)
      html += ' max="'+ spec.maximum +'"';
    html += 'onchange="interpretControls(this)">';
    return html;
  }

  function writeString(spec, name) {
    var name1 = name + '_' + spec.type;
    var html = '<input id="'+name1+'" name="'+name1+'" type="text"';
    html += 'onchange="interpretControls(this)">';
    return html;
  }


  function writeObject(spec, name) {
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
        //     spec.properties[prop] = writeParameter(spec.properties);
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
        html += '<td>'+ writeParameter(spec.properties[prop], name+'_'+prop) +'</td>';
        html+= '</tr>';
        // html += '<br>';
      }
      html += '</tbody></table>';
    }
    return html;
  }

  function writeArray(spec, name) {
    var html = '';
    var name1 = name + '_' + spec.type;
    html += '<table><tbody>';
    for (let prop in spec.items) {
      html += '<tr>';
      // html += '<td><span>' + prop + ': </span></td>';
      if (spec.maxItems === 1 && spec.items[prop].enum && spec.items[prop].enum.length === 1) {
        // console.log('__', spec.items[prop]);
        var ename = name1 + prop + '_enum';
        html += '<td><span id="'+ename+'" name="'+ename+'"">'+ spec.items[prop].enum[0] +'</span></td>';
      }
      else {
        html += '<td>'+ writeParameter(spec.items[prop], name1+prop) +'</td>';
      }
      if (spec.additionalItems != false && spec.maxItems != spec.items.length)
        html += '<td>+</td>';
      html+= '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function writeArrayEnum(spec, name) {
    var html = '<table><tbody>';
    // var counter = cc++;
    var name1 = name + '_' + spec.type;

    for (let prop in spec.items) {
      html += '<input type="checkbox" id="'+name1+'" name="' + name1 +
              '" value="'+spec.items[prop] +
              '" onchange="interpretControls(this)"> '+ spec.items[prop];
    }
    html += '</tbody></table>';
    return html;
  }

  function writeArrayAnyOf(spec, name) {
    var html = '<table><tbody>';
    // var counter = cc++;
    var name1 = name + '_' + spec.type;


    for (var i=0; i<spec.items.length; i++) {
      html += '<tr>';
      html += '<td><input type="checkbox" id="'+name1+'" name="'+name1+'" onchange="checkOnlyOne(this)"> </td>'+
              '<td>'+ writeParameter(spec.items[i], name1+'_'+i) +'</td>';
      html += '<td>+</td>';
      html+= '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function writeArrayOneOf(spec, name) {
    var html = '<table><tbody>';
    // var counter = cc++;
    var name1 = name + '_' + spec.type;

    // for (let prop in spec.items) {
    for (var i=0; i<spec.items.length; i++) {
      html += '<tr>';
      html += '<td><input type="radio" id="'+name1+'" name="'+name1+'" onchange="interpretControls(this)"> </td>'+
              '<td>'+ writeParameter(spec.items[i], name1+'_'+i) +'</td>';
      html += '<td>+</td>';
      html+= '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }


  function writeOneOf(spec, name) {
    var html = '';
    // var counter = cc++;
    var name1 = name + '_oneOf';

    html += '<table><tbody>';
    spec.oneOf.forEach(function functionName(item) {
      html += '<tr>';
      html += '<td><input type="radio" id="'+name1+'" name="'+name1+'" onchange="interpretControls(this)"> </td>'+
              '<td>'+ writeParameter(item, name1) +'</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    return html;
  }

  function writeAnyOf(spec, name) {
    var html = '';
    // var counter = cc++;
    var name1 = name + '_anyOf';

    html += '<table><tbody>';
    spec.anyOf.forEach(function functionName(item, i) {
      html += '<tr>';
      html += '<td><input type="checkbox" id="'+name1+'" name="'+name1+'" onchange="checkOnlyOne(this)"> </td>'+
              '<td>'+ writeParameter(item, name1+i) +'</td>';
      html += '</tr>';

    });
    html += '</tbody></table>';

    return html;
  }
};
