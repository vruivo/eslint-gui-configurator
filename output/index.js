'use strict';

function toggleConfigVisibility(select) { // eslint-disable-line no-unused-vars
  var value = select.value;

  var tr = closest(select, 'tr', 'tbody');
  var hidden_tr = tr.nextElementSibling;

  if (value != 'off') {
    hidden_tr.classList.remove('hidden');
    if (value === 'warn') {
      tr.classList.add('rule-warning');
      tr.classList.remove('rule-error');
      tr.classList.remove('rule-off');
    }
    else if (value === 'error') {
      tr.classList.add('rule-error');
      tr.classList.remove('rule-warning');
      tr.classList.remove('rule-off');
    }
  }
  else {
    hidden_tr.classList.add('hidden');
    tr.classList.add('rule-off');
    tr.classList.remove('rule-warning');
    tr.classList.remove('rule-error');
  }

  interpretControls(select);  // eslint-disable-line no-undef
}

// https://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
function closest(el, selector, stopSelector) {
  var retval = null;
  while (el) {
    if (el.matches(selector)) {
      retval = el;
      break;
    } else if (stopSelector && el.matches(stopSelector)) {
      break;
    }
    el = el.parentElement;
  }
  return retval;
}

function checkOnlyOne(checkbox) { // eslint-disable-line no-unused-vars
  // this gets called AFTER the checkbox changes value
  var list = document.getElementsByName(checkbox.name);
  list.forEach(function functionName(check) {
    if (check.checked === true && check !== checkbox)
      check.checked = false;
  });

  interpretControls(checkbox);  // eslint-disable-line no-undef
}

var rules_output_arr = [];

function updateOutput(el) {  // eslint-disable-line no-unused-vars
  // update final output text box
  const eloutput = document.getElementById('xx');
  const rule_nr = Number(el.id.substring(0, el.id.indexOf('_')));

  rules_output_arr[rule_nr] = el.value;

  var str = '{\n';
  str += '  "rules": {\n';

  rules_output_arr.forEach(function(val, i) {
    if (val != null && typeof val === 'string' && val.length > 0) {
      str += '    ' + val;
      // if not last rule add a comma
      str += (i !== rules_output_arr.length-1)? ',\n' : '\n';
    }
  });

  str += '  }\n';
  str += '}';

  eloutput.value = str;
}

function toggleViewFilter(el) {  // eslint-disable-line no-unused-vars
  var filter = el.value;
  var rules = document.getElementById('rules_table').getElementsByClassName('rule-line');
  var controls = document.getElementById('rules_table').getElementsByClassName('rule-controls-line');

  // hide all controls
  Array.prototype.forEach.call(controls, function hideControls(el) {
    el.classList.add('hidden');
  });

  Array.prototype.forEach.call(rules, function showSelected(el) {
    if (filter === 'fixable') {
      showElement(el, (el.dataset.isFixable === 'true'));
    }
    if (filter === 'recommended') {
      showElement(el, (el.dataset.isRecommended === 'true'));
    }
    if (filter === 'recommended_fixable') {
      showElement(el, (el.dataset.isRecommended === 'true') || (el.dataset.isFixable === 'true'));
    }
    if (filter === 'all') {
      showElement(el, true);
    }
  });

  function showElement(el, show) {
    if (show === true) {
      el.classList.remove('hidden');
      // re-show controls if needed
      toggleConfigVisibility(el.getElementsByTagName('select')[0]);
    }
    else {
      el.classList.add('hidden');
    }
  }
}


function envUpdate() {
  var envs_grp = document.getElementsByName('environments');
  var envs = [];
  Array.prototype.forEach.call(envs_grp, function (env) {
    if (env.checked) {
      envs.push(env.value);
    }
  });
  return envs;
}
