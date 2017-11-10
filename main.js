'use strict';

const readRules = require('./source-reader/rules-reader');
const buildHTML = require('./html-builder/html-builder.js');

var rules = readRules();
buildHTML(rules, 'output/index.html');

//TODO: environments
//TODO: fixable, recommended
//TODO: create text rules
//TODO: generate output, and a big text box for preview
//TODO: load config from file
