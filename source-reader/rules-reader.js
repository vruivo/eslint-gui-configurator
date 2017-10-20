'use strict';

const fs = require('fs');
//const readline = require('readline');


module.exports = function() {
  //console.log(__dirname);  // process.cwd()
  const rules_dir = __dirname + '/git-clone/eslint/lib/rules/'; // TODO: safe termination '/'

  const files = fs.readdirSync(rules_dir);
  var rule, eslint_rule, docs_len;
  //var rules = [];

  var cc = 0;
  files.forEach(function list_files(file) {
    if (file.search('.js$') !== -1) {
      //console.log(cc + ' - ' + file);
      cc++;

      eslint_rule = require(rules_dir + file).meta;
      // console.log(eslint_rule);
      // console.log('---');

      // required : docs, schema (prop)
      // optional: fixable, schema (contents)

      rule = {};
      rule.name = file.substring(0, file.length-3);
      rule.url = 'https://eslint.org/docs/rules/' + rule.name;

      // docs section
      if (eslint_rule.docs != null) {
        if (eslint_rule.docs.description != null) {
          rule.description = eslint_rule.docs.description;
        } else {
          console.log(`Rule ${rule.name} missing docs.description`);
        }

        (eslint_rule.docs.category != null) ?
            rule.category = eslint_rule.docs.category :
            console.log(`Rule ${rule.name} missing docs.category`);

        (eslint_rule.docs.recommended != null) ?
            rule.recommended = eslint_rule.docs.recommended :
            console.log(`Rule ${rule.name} missing docs.recommended`);
      }
      else {
        console.log(`Rule ${rule.name} missing docs section`);
      }

      // schema section
      if (eslint_rule.schema != null) {
        if (Array.isArray(eslint_rule.schema) && eslint_rule.schema.length) {
          eslint_rule.schema.forEach(function parse_schema(schema) {

            if (schema.enum && Array.isArray(schema.enum)) {  // enum: one from the list
              if (!rule.set) rule.set = {};
              rule.set._one_of = schema.enum;
            }
            else if (schema.type) {
              if (schema.type === 'object' && schema.properties != null) {
                for (let prop in schema.properties) {
                  if (!rule.set) rule.set = {};
                  if (!rule.set.params) rule.set.params = [];
                  rule.set.params.push({'name':prop, 'type':schema.properties[prop].type});
                }
                if (schema.additionalProperties === true)
                  console.log("--- omg WTF ---");
              }
              else {
                console.log(`[${rule.name}] Unknown schema.type format`);
              }
//XXX: test-set-> accessor-pairs, arrow-parens, brace-style, one-var
            }
            else {  // default
              //console.log(`[${rule.name}] Unknown schema rule format`);
            }
          });
        }
        else {
          //console.log(`[${rule.name}] Unknown schema format`);
        }
      }
      else {
        console.log(`Rule ${rule.name} missing schema section`);
      }

      // optional parameters
      if (eslint_rule.fixable != null) {
        rule.fixable = !!eslint_rule.fixable;
      }
      //
      if (eslint_rule.deprecated != null) {
        rule.deprecated = eslint_rule.deprecated;
      }

      // check for unknown parameters
      // docs_len = Object.keys(eslint_rule.docs).length;
      for (var key in eslint_rule) {
        if (key !== 'docs' && key !== 'schema' && key !== 'fixable'
                && key !== 'deprecated') {
          console.log(`[${rule.name}] Found unknown parameter: ${key}`);
        }
      }


      rule = eslint_rule = docs_len = null;

//process.exit();
    } // end of if(.js)
  }); // end of for

  return {};
};
