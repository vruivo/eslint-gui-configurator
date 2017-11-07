'use strict';

function toggleConfigVisibility(abc) { // eslint-disable-line no-unused-vars
  var value = abc.value;

  var tr = closest(abc, 'tr', 'tbody');
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
