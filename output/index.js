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
  var list = document.getElementsByName(checkbox.name);
  var checked_checkbox;
  list.forEach(function functionName(check) {
    if (check.checked === true)
      checked_checkbox = check;
    check.checked = false;
  });
  if (checked_checkbox !== this)
    checkbox.checked = true;
  // checked_checkbox = document.querySelector('input[type=checkbox][name="'+checkbox.name+'"][checked=true]');
  // if (checked_checkbox !== checkbox) {
  // checked_checkbox.checked = false;
  // checkbox.checked = true;
  // }
  // else
  // checkbox.checked = false;
}
