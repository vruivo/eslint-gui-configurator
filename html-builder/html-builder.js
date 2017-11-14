'use strict';

const fs = require('fs');
const html_utils = require(__dirname + '/node-html-utils');
const generateRuleControls = require(__dirname + '/html-rule-control-generator');

module.exports = function htmlBuilder(rules, output_file) {

  const createHtmlPage = html_utils.loadTemplate(__dirname + '/html_base.htt');
  const html = createHtmlPage({
    body: createRulesHtml(rules)
  });
  fs.writeFileSync(output_file, html);



  function createRulesHtml(rules) {

    var html = '<form autocomplete="off"><table style="margin: 0">\n<tbody>\n';

    const createRuleLine = html_utils.loadTemplate(__dirname + '/rule_line.htt');
    const createRuleCategoryLine = html_utils.loadTemplate(__dirname + '/rule_category.htt');

    var rules_organized = {};
    let category;
    // organize rules by category
    rules.forEach(function createHTML(rule) {
      category = rule.category;
      if (!rules_organized[category])
        rules_organized[category] = [];
      rules_organized[category].push(rule);
    });

    // category = null;
    Object.keys(rules_organized).sort().forEach(function loopItems(category) {
      // html += '<tr style="background-color:blue"><td colspan="5">'+key+'</td></tr>';
      html += createRuleCategoryLine({category: category});
      rules_organized[category].forEach(function createHTML(rule) {
        html += createRuleLine({
          recommended: rule.recommended,
          fixable: rule.fixable,
          url: rule.url,
          name: rule.name,
          description: rule.description,
          controls: generateRuleControls(rule.schema)
        });
      });
    });

    html+='</tbody>\n</table>\n</form>';
    return html;
  }

};
