'use strict';

const readRules = require('./source-reader/rules-reader');

var rules = readRules();

const html_beginning =
'<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'  <meta charset="utf-8">' +
'</head>' +
'<body>';
const html_end = '</body></html>';

var html = html_beginning;
html += '<table><tbody>';

rules.forEach(function createHTML(rule) {
  html += '<tr> '+
      '<td>' +
        '<a href="'+rule.url +'">'+ rule.name + '</a>'+
      '</td>' +
      '<td>' +
        '&nbsp&nbsp&nbsp'+ rule.description+ '<br>' +
      '</td>' +
      '</tr>';
});

html+='</tbody></table>';
html += html_end;

const fs = require('fs');
fs.writeFileSync('index.html', html);
