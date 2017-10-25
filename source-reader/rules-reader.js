'use strict';

const fs = require('fs');
//const readline = require('readline');
const schemaReader = require(__dirname + '/schema-reader');


module.exports = function() {
  //console.log(__dirname);  // process.cwd()
  const rules_dir = __dirname + '/git-clone/eslint/lib/rules/'; // TODO: safe termination '/'

  const files = fs.readdirSync(rules_dir);
  var rule, eslint_rule, file_count = 0, files_parsed_count = 0;
  //var rules = [];

  files.forEach(function list_files(file) {
    if (file.search('.js$') !== -1) {
      //console.log(cc + ' - ' + file);
      file_count++;

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
// if (rule.name === 'arrow-parens') throw 'bla';
        try {
          rule.schema = schemaReader(eslint_rule.schema);
          // console.log(xyz);
          // rule.schema = xyz;
        } catch (e) {
          console.log(rule.name + '  --  ' + e);
          // console.log(JSON.stringify(eslint_rule.schema, null, 3));
          return; // skip
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
      for (var key in eslint_rule) {
        if (key !== 'docs' && key !== 'schema' && key !== 'fixable'
                && key !== 'deprecated') {
          console.log(`[${rule.name}] Found unknown parameter: ${key}`);
        }
      }

      if (rule.schema == undefined) {
        throw 'Schema not found: ' + rule.name;
      }

      // console.log(JSON.stringify(rule, null, 3));
      // console.log('----');

      files_parsed_count++;
      rule = eslint_rule = null;

//process.exit();
    } // end of if(.js)
  }); // end of for

  console.log('Rules found:  ' + file_count);
  console.log('Rules parsed: ' + files_parsed_count);

  return {};
};
