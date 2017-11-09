'use strict';

const fs = require('fs');

module.exports = (function functionName() {

  return {createElement, loadTemplate};

  // var div = createElement('div');
  // div.class = 'class';
  // var a = createElement('a');
  // a.href = 'https://abc.com';
  // a.setText('link maravilha');
  // div.appendChild(a);
  // console.log(div.toString());

  function createElement(tag) {
    return {
      children: [],
      'appendChild': function appendChild(el) {
        this.children.push(el.toString());
      },
      'setText': function appendChild(str) {
        this.children.push(str);
      },
      'toString': function toString() {
        var str = '<'+ tag;

        for (var p in this) {
          if (typeof this[p] !== 'function' && p !== 'children')
            str += ' ' + p + '="' + this[p] + '"';
        }

        str += '>';

        str += this.children.join('');

        str += '</'+ tag +'>';
        return str;
      }
    };
  }

  // var tt = loadTemplate(__dirname + '/rule_line.htt');
  // console.log(tt({
  //   url: 'https://abc.com',
  //   name: 'myName',
  //   description: 'bla bla bla'
  // }));
  // console.log(tt({
  //   url: 'https://xyz.com',
  //   name: 'myNameZ',
  //   description: '12345678900'
  // }));

  function loadTemplate(file) {
    var data = fs.readFileSync(file, 'utf8');

    var variables = data.match(/\${(\w+)}/g);
    variables = Array.from(new Set(variables)); // uniques
    variables = variables.map(function removeTagChars(item) {
      return item.substring(2, item.length-1);
    });

    return function createFromTemplate(values) {
      let value_keys = Object.keys(values);

      variables.forEach(function checkVars(variable) {
        if (value_keys.indexOf(variable) === -1)
          throw 'Missing argument \'' + variable +'\'';
      });

      let v, tag, data_out=data;
      for (v in values) {
        tag = '\\${' + v + '}';
        data_out = data_out.replace(new RegExp(tag,'g'), values[v]);
      }
      return data_out;
    };
  }
})();
