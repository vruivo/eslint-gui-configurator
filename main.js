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

rules.forEach(function createHTML(rule) {
  html += '<a href="'+rule.url +'">'+ rule.name + ' -- '+ rule.description+ '</a><br>';
});

html += html_end;

const fs = require('fs');
fs.writeFileSync('index.html', html);
