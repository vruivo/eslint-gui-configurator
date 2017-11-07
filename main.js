'use strict';

const readRules = require('./source-reader/rules-reader');

var rules = readRules();

const html_beginning =
'<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'  <meta charset="utf-8">\n' +
'  <link rel="stylesheet" href="styles.css"/>\n' +
'  <script src="index.js"></script>' +
'</head>\n' +
'<body>\n';
const html_end = '</body>\n</html>\n';

var html = html_beginning;
html += '<table>\n<tbody>\n';

rules.forEach(function createHTML(rule) {
  html += '<tr>\n'+
      ' <td>' +
        '<a href="'+rule.url +'">'+ rule.name + '</a>'+
      '</td>\n' +
      ' <td>' +
        rule.description+ '<br>' +
      '</td>\n' +
      ' <td>' +
        '<select onchange="toggleConfigVisibility(this)">\n'+
        '  <option value="off">off</option>\n' +
        '  <option value="warn">warn</option>\n' +
        '  <option value="error">error</option>\n' +
        '<select>' + '<br>' +
      '</td>\n' +
      '</tr>\n' +

      '<tr class="hidden">' +
      ' <td colspan="3">' +
        'hidden stuffs <br> abc <br> 123'+
      '</td>\n' +
      '</tr>\n';
});

html+='</tbody>\n</table>\n';
html += html_end;

const fs = require('fs');
fs.writeFileSync('output/index.html', html);
