'use strict';

module.exports = function schemaReader(schema) {
  if (Array.isArray(schema) && schema.length) {

    // if (schema.length > 1) {
    //   throw 'Schema length > 1 (ignoring for now...)';
    // }

    schema.forEach(function parse_schema(schema_param) {
      readParameter(schema_param);
    });

// XXX: test-set-> accessor-pairs, arrow-parens, brace-style, one-var

  }
  else {
    throw 'Unknown schema format';
  }


  // -----------------------------
  function readParameter(schema_param) {
    if (schema_param == null)
      throw 'schema param is undefined'

    if (schema_param.enum) {
      readEnum(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'boolean') {
      readBoolean(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'integer') {
      readInteger(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'number') {
      readNumber(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'string') {
      readString(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'object') {
      readObject(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'array') {
      readArray(schema_param);
    }
    else if (schema_param.oneOf) {    // choose 1
      readOneOf(schema_param);
    }
    else if (schema_param.anyOf) {    // 0 or 1
      readAnyOf(schema_param);
    }
    else if (schema_param.properties && !schema_param.type) {
      // assume as object -- (nonblock-statement-body-position uses this)
      schema_param.type = 'object';
      readObject(schema_param);
    }
    else {  // default
      throw 'Unknown schema param  ' + JSON.stringify(schema_param, null, 3);
    }
  }

  // ------------- base types ----------
  function readEnum(param) {
    // console.log("ping1", param);
    checkForUnknownParameters(param, ['enum']);
    // console.log("ping2");
    if (!Array.isArray(param.enum)) {  // enum: one from the list
      throw 'Not an array enum';
    }
    // console.log("ping3");
    var z ={ oneOf: param.enum};
    // console.log("ping4");
    return z;
  }

  function readBoolean(param) {
    checkForUnknownParameters(param, ['type']);
    return param;
  }

  function readInteger(param) {
    checkForUnknownParameters(param, ['type', 'minimum', 'maximum']);
    return param;
  }

  function readNumber(param) {
    checkForUnknownParameters(param, ['type']);
    return param;
  }

  function readString(param) {
    checkForUnknownParameters(param, ['type', 'not']);
    return param;
  }


  function readObject(param) {
    if (param.properties == null && param.additionalProperties == null) {
      throw 'Object without properties';
    }

    checkForUnknownParameters(param, ['type', 'properties',
      'additionalProperties', 'required', 'patternProperties']);

    // additionalProperties are not defined completely in the schema,
    //  must refer to the docs for the full syntax
    //
    // if (param.additionalProperties != null && param.additionalProperties !== false)
    //   throw 'Object with additionalProperties';

    // if additionalProperties exists but is false it isn't doing anything
    if (param.additionalProperties === false) {
      delete param.additionalProperties;
    }

    for (let prop in param.properties) {
      //console.log(prop + '   ' + JSON.stringify(param.properties[prop], null, 3));
      param.properties[prop] = readParameter(param.properties[prop]);
    }

    return param;
  }


  function readArray(param) {   // order matters in arrays
    if (param.items == null) {
      throw 'Array without items';
    }

    checkForUnknownParameters(param, ['type', 'items',
      'minItems', 'maxItems', 'uniqueItems']);

    // items is an object
    param.items = readParameter(param.items);

    return param;
  }


  function readOneOf(param) {
    checkForUnknownParameters(param, ['oneOf']);
    if (!Array.isArray(param.oneOf)) {
      throw 'Not an array oneOf';
    }
    return param;
  }

  function readAnyOf(param) {
    checkForUnknownParameters(param, ['anyOf']);
    if (!Array.isArray(param.anyOf)) {
      throw 'Not an array anyOf';
    }
    return param;
  }

  // --------------------
  function checkForUnknownParameters(obj, known_keys) {
    for (var key in obj) {
      if (known_keys.indexOf(key) === -1)
        throw 'Unknown parameter:  ' + JSON.stringify(obj, null, 3);
    }
  }

};
