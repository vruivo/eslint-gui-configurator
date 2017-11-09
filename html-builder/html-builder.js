'use strict';

const fs = require('fs');
const readline = require('readline');
const html_utils = require(__dirname + '/node-html-utils');

module.exports = function htmlBuilder(rules, output_file) {

  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/html_base.html')
  });

  var html = '';
  rl.on('line', (line) => {
    // console.log(`Line from file: ${line}`);
    html += line + '\n';

    if (line.indexOf('<body>') !== -1) {
      html += createRulesHtml(rules);
    }
  });

  rl.on('close', () => {
    fs.writeFileSync(output_file, html);
  });

  function createRulesHtml(rules) {

    var html = '<form autocomplete="off"><table>\n<tbody>\n';

    const createRuleLine = html_utils.loadTemplate(__dirname + '/rule_line.htt');

    rules.forEach(function createHTML(rule) {
      html += createRuleLine({
        url: rule.url,
        name: rule.name,
        description: rule.description
      });
    });

    html+='</tbody>\n</table>\n</form>';
    return html;
  }

};
