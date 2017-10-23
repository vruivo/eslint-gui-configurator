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
    if (schema_param.enum) {
      readEnum(schema_param.enum);
    }
    else if (schema_param.type && schema_param.type === 'boolean') {
      readBoolean(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'object') {
      readObject(schema_param);
    }
    else if (schema_param.type && schema_param.type === 'array') {
      readArray(schema_param);
    }
    else if (schema_param.oneOf) {
      // do nothing for now
    }
    else if (schema_param.anyOf) {
      // do nothing for now
    }
    else if (schema_param.type && schema_param.type === 'integer') {
      // do nothing for now
    }
    else if (schema_param.type && schema_param.type === 'string') {
      // do nothing for now
    }
    else if (schema_param.type && schema_param.type === 'number') {
      // do nothing for now
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
    if (Array.isArray(param)) {  // enum: one from the list
      //if (!rule.set) rule.set = {};
      //rule.set._one_of = param;
      return 1;
    }
  }

  function readBoolean(param) {
    return 1;
  }

  function readObject(param) {
    if (param.properties != null) {
      for (let prop in param.properties) {
        //console.log(prop + '   ' + JSON.stringify(param.properties[prop], null, 3));
        readParameter(param.properties[prop]);
      }
    }

    if (param.additionalProperties !== false)
      throw 'Strange object';

    //         if (schema.properties != null) {
    //           for (let prop in schema.properties) {
    //             if (!rule.set) rule.set = {};
    //             if (!rule.set.params) rule.set.params = [];
    //             rule.set.params.push({'name':prop, 'type':schema.properties[prop].type});
    //           }
    //           if (schema.additionalProperties === true)
    //             console.log("--- omg WTF ---");
    //         }
    //         else {
    //           console.log(`[${rule.name}] Unknown schema.type format`);
    //         }
  }

  function readArray(param) {
    //
  }

};
