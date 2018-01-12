'use strict';

const readRules = require('./source-reader/rules-reader');
const readEnvironments = require('./source-reader/environments-reader');
const buildHTML = require('./html-builder/html-builder.js');

var rules = readRules();
var environments = readEnvironments();

buildHTML({rules, environments}, 'output/index.html');


//TODO: array add
//TODO: sortable array
//TODO: load config from file
//
