'use strict';

const readRules = require('./source-reader/rules-reader');
const buildHTML = require('./html-builder/html-builder.js');

var rules = readRules();
buildHTML(rules, 'output/index.html');

//TODO: environments
//TODO: sortable array
//TODO: array add
//TODO: load config from file
//
//TODO: unravel arrays
//TODO: rule line color highlight
