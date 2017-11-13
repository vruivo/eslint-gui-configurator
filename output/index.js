'use strict';

function toggleConfigVisibility(select) { // eslint-disable-line no-unused-vars
  var value = select.value;

  var tr = closest(select, 'tr', 'tbody');
  var hidden_tr = tr.nextElementSibling;

  if (value != 'off') {
    hidden_tr.classList.remove('hidden');
  }
  else {
    hidden_tr.classList.add('hidden');
  }
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
}
