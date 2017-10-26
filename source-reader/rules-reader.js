'use strict';

const fs = require('fs');
const schemaReader = require(__dirname + '/schema-reader');


module.exports = function getRules() {
  const rules_dir = __dirname + '/git-clone/eslint/lib/rules/'; // don't forget the last '/'
  const url_prefix = 'https://eslint.org/docs/rules/';

  const files = fs.readdirSync(rules_dir);
  var rule, eslint_rule, file_count = 0, files_parsed_count = 0;
  var rules = [];

  files.forEach(function list_files(file) {
    if (file.search('.js$') !== -1) {
      file_count++;

      eslint_rule = require(rules_dir + file).meta;

      // required : docs, schema (prop)
      // optional: fixable, schema (contents)

      rule = {};
      rule.name = file.substring(0, file.length-3);
      rule.url = url_prefix + rule.name;

      // docs section
      if (eslint_rule.docs != null) {

        if (eslint_rule.docs.description != null)
          rule.description = eslint_rule.docs.description;
        else
          throw `Rule ${rule.name} missing docs.description`;

        if (eslint_rule.docs.category != null)
          rule.category = eslint_rule.docs.category;
        else
          throw `Rule ${rule.name} missing docs.category`;

        if (eslint_rule.docs.recommended != null)
          rule.recommended = eslint_rule.docs.recommended;
        else
          throw `Rule ${rule.name} missing docs.recommended`;
      }
      else {
        throw `Rule ${rule.name} missing docs section`;
      }

      // schema section
      if (eslint_rule.schema != null) {
// if (rule.name !== 'no-restricted-modules') return;
        try {
          rule.schema = schemaReader(eslint_rule.schema);
        } catch (e) {
          throw rule.name + '  --  ' + e;
          // return; // skip
        }

      }
      else {
        throw `Rule ${rule.name} missing schema section`;
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
          throw `[${rule.name}] Found unknown parameter: ${key}`;
        }
      }

      if (rule.schema == undefined) {
        throw 'Schema not found: ' + rule.name;
      }

      // console.log(JSON.stringify(rule, null, 3));
      // console.log('----');

      rules.push(rule);

      files_parsed_count++;
      rule = eslint_rule = null;

    } // end of if(.js)
  }); // end of for

  console.log('Rules found:  ' + file_count);
  console.log('Rules parsed: ' + files_parsed_count);

  return rules;
};
