'use strict';

module.exports = function schemaReader(schema) {
  if (!Array.isArray(schema)) {
    schema = [schema];
  }

  return schema.map(function parse_schema(schema_param) {
    return readParameter(schema_param);
  });

// XXX: test-set-> accessor-pairs, arrow-parens, brace-style, one-var


  // -----------------------------
  function readParameter(schema_param) {
    if (schema_param == null)
      throw 'schema param is undefined';

    if (schema_param.enum) {
      return readEnum(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'boolean') {
      return readBoolean(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'integer') {
      return readInteger(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'number') {
      return readNumber(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'string') {
      return readString(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'object') {
      return readObject(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'array') {
      return readArray(schema_param);
    }
    else if (schema_param.oneOf) {    // choose 1
      return readOneOf(schema_param);
    }
    else if (schema_param.anyOf) {    // 0 or 1
      return readAnyOf(schema_param);
    }
    else if (schema_param.properties && !schema_param.type) {
      // assume as object -- (nonblock-statement-body-position uses this)
      schema_param.type = 'object';
      return readObject(schema_param);
    }
    else if (schema_param['$ref']) {
      // 'special' param (comma-dangle and padding-line-between-statements use this)
      return schema_param;
    }
    else if (schema_param.type && Array.isArray(schema_param.type)
        && schema_param.type.length === 2
        && schema_param.type.indexOf('null') !== -1) {
      // another 'special' param (array-bracket-newline and array-element-newline use this)
      let index = schema_param.type[0] !== 'null' ? 0 : 1;
      schema_param.type = schema_param.type[index];
      schema_param = {
        'oneOf': [
          schema_param,
          { 'enum': ['null'] }
        ]
      };
      return readParameter(schema_param);
    }
    else {  // default
      throw 'Unknown schema param  ' + JSON.stringify(schema_param, null, 3);
    }
  }

  // ------------- base types ----------
  function readEnum(param) {
    checkForUnknownParameters(param, ['enum']);
    if (!Array.isArray(param.enum)) {  // enum: one from the list
      throw 'Not an array enum';
    }
    return param;
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
    checkForUnknownParameters(param, ['type', 'not', 'minLength']);
    return param;
  }


  function readObject(param) {
    if (param.properties == null && param.additionalProperties == null) {
      throw 'Object without properties';
    }

    checkForUnknownParameters(param, ['type', 'properties',
      'additionalProperties', 'required', 'patternProperties', 'minProperties']);

    // additionalProperties are not defined completely in the schema,
    //  must refer to the docs for the full syntax

    // if additionalProperties exists but is false it isn't doing anything
    if (param.additionalProperties === false) {
      delete param.additionalProperties;
    }

    for (let prop in param.properties) {
      if (prop === 'anyOf' || prop === 'oneOf') {   // happens once, in operator-linebreak
        try {
          param.properties[prop] = readParameter(param.properties);
        } catch (e) {
          if (!param.additionalProperties) {
            delete param.properties;
            param.additionalProperties = { 'type':'string' };
          }
          else
            throw 'Invalid object param';
        }
      }
      else
        param.properties[prop] = readParameter(param.properties[prop]);
    }

    return param;
  }


  function readArray(param) {   // order matters in arrays
    if (param.items == null) {
      throw 'Array without items';
    }

    if (!Array.isArray(param.items)) {
      param.items = [ param.items ];
    }

    checkForUnknownParameters(param, ['type', 'items',
      'minItems', 'maxItems', 'uniqueItems', 'definitions', 'additionalItems']);

    // definitions is a 'special' param (comma-dangle and
    //     padding-line-between-statements use this)
    // additionalItems is used by padding-line-between-statements

    param.items = param.items.map(function mapArray(item) {
      return readParameter(item);
    });

    return param;
  }


  function readOneOf(param) {
    checkForUnknownParameters(param, ['oneOf']);
    if (!Array.isArray(param.oneOf)) {
      throw 'Not an array oneOf';
    }

    param.oneOf = param.oneOf.map(function mapOneOf(item) {
      return readParameter(item);
    });
    return param;
  }

  function readAnyOf(param) {
    checkForUnknownParameters(param, ['anyOf']);
    if (!Array.isArray(param.anyOf)) {
      throw 'Not an array anyOf';
    }

    param.anyOf = param.anyOf.map(function mapAnyOf(item) {
      return readParameter(item);
    });
    return param;
  }

  // --------------------
  function checkForUnknownParameters(obj, known_keys) {
    for (var key in obj) {
      if (known_keys.indexOf(key) === -1)
        throw 'Unknown parameter:  ' + key + ' :: ' + JSON.stringify(obj, null, 3);
    }
  }

};
