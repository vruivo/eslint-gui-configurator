'use strict';

const readRules = require('./source-reader/rules-reader');
const buildHTML = require('./html-builder/html-builder.js');

var rules = readRules();
buildHTML(rules, 'output/index.html');
