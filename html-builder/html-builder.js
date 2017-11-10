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

    rules.forEach(function createHTML(rule) {
      html += createRuleLine({
        url: rule.url,
        name: rule.name,
        description: rule.description,
        controls: generateRuleControls(rule.schema)
      });
    });

    html+='</tbody>\n</table>\n</form>';
    return html;
  }

};
