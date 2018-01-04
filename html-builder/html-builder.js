'use strict';

const fs = require('fs');
const html_utils = require(__dirname + '/node-html-utils');
const generateRuleControls = require(__dirname + '/html-rule-control-generator');

module.exports = function htmlBuilder(conf, output_file) {
  const rules = conf.rules;
  const environments = conf.environments;

  // create the file
  const createHtmlPage = html_utils.loadTemplate(__dirname + '/templates/html_base.htt');
  const html = createHtmlPage({
    rules: createRulesHtml(rules),
    environments: createEnvironmentsHtml(environments)
  });
  fs.writeFileSync(output_file, html);

  // helper function
  function createEnvironmentsHtml(environments) {
    var html = '<form autocomplete="off">';
    environments.forEach(function functionName(env) {
      html += '<div style="display:inline; margin-right:1em;">' +
        '<input type="checkbox" name="environments" value="'+env+'" onchange="updateEnv()">'+env +
        '</div>';
    });
    html += '</form>';
    return html;
  }

  // helper function
  function createRulesHtml(rules) {
    var html = '<form autocomplete="off">' +
      '<table id="rules_table" style="margin:0;">\n<tbody>\n';

    const createRuleLine = html_utils.loadTemplate(__dirname + '/templates/rule_line.htt');
    const createRuleCategoryLine = html_utils.loadTemplate(__dirname + '/templates/rule_category.htt');

    var rules_organized = {};
    let category;
    // organize rules by category
    rules.forEach(function createHTML(rule) {
      category = rule.category;
      if (!rules_organized[category])
        rules_organized[category] = [];
      rules_organized[category].push(rule);
    });

    var rule_nr = 0;
    Object.keys(rules_organized).sort().forEach(function loopItems(category) {
      html += createRuleCategoryLine({category: category});

      rules_organized[category].forEach(function createHTML(rule) {
        html += createRuleLine({
          isrecommended: (rule.recommended)? true:false,
          isfixable: (rule.fixable)? true:false,
          recommended: (rule.recommended)?'<i class="fa fa-star fa-lg"></i>':'',
          fixable: (rule.fixable)?'<i class="fa fa-wrench fa-lg"></i>':'',
          url: rule.url,
          name: rule.name,
          description: rule.description,
          select_id: rule_nr + '_level',
          controls: generateRuleControls(rule.schema, rule_nr++, rule.name)
        });
      });
    });

    html+='</tbody>\n</table>\n</form>';
    return html;
  }

};
