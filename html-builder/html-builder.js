'use strict';

const fs = require('fs');
const html_utils = require(__dirname + '/node-html-utils');
const generateRuleControls = require(__dirname + '/html-rule-control-generator');

module.exports = function htmlBuilder(rules, output_file) {

  const createHtmlPage = html_utils.loadTemplate(__dirname + '/templates/html_base.htt');
  const html = createHtmlPage({
    body: createRulesHtml(rules)
  });
  fs.writeFileSync(output_file, html);



  function createRulesHtml(rules) {

    var html = '<form autocomplete="off"><table style="margin: 0">\n<tbody>\n';

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
          recommended: (rule.recommended)?'<i class="fa fa-star fa-lg"></i>':'',
          fixable: (rule.fixable)?'<i class="fa fa-wrench fa-lg"></i>':'',
          url: rule.url,
          name: rule.name,
          description: rule.description,
          select_id: rule_nr + '_level',
          controls: generateRuleControls(rule.schema, rule_nr++)
        });
      });
    });

    html+='</tbody>\n</table>\n</form>';
    return html;
  }

};
