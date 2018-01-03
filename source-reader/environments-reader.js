'use strict';

module.exports = function readEnvironments() {
  const environments = require(__dirname + '/git-clone/eslint/conf/environments.js');
  var envs = [];

  Object.keys(environments).forEach(function re(env) {
    if (env === 'builtin') { // internal variable / default value ?
      return;
    }
    envs.push(env);
  });
  
  return envs;
};
