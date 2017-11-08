'use strict';

module.exports = function htmlBuilder(rules, output_file) {

  const readline = require('readline');
  const fs = require('fs');

  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/html_base.html')
  });

  var html = '';
  rl.on('line', (line) => {
    // console.log(`Line from file: ${line}`);
    html += line + '\n';

    if (line.indexOf('<body>') !== -1) {
      html += createRulesHtml(rules);
    }
  });

  rl.on('close', () => {
    fs.writeFileSync(output_file, html);
  });

  function createRulesHtml(rules) {

    var html = '<form autocomplete="off"><table>\n<tbody>\n';

    rules.forEach(function createHTML(rule) {
      // html += '<tr>\n'+
      //     ' <td>' +
      //       '<a href="'+rule.url +'">'+ rule.name + '</a>'+
      //     '</td>\n' +
      //     ' <td>' +
      //       rule.description +
      //     '</td>\n' +
      //     ' <td>' +
      //       '<select onchange="toggleConfigVisibility(this)">\n'+
      //       '  <option value="off">off</option>\n' +
      //       '  <option value="warn">warn</option>\n' +
      //       '  <option value="error">error</option>\n' +
      //       '<select>' +
      //     '</td>\n' +
      //     '</tr>\n' +
      //
      //     '<tr class="hidden">' +
      //     ' <td colspan="3">' +
      //       'hidden stuffs <br> abc <br> 123'+
      //     '</td>\n' +
      //     '</tr>\n';

      // let tr = createElement('tr');
      // let td = createElement('td');
      // let a = createElement('a');
      // a.href = rule.url;
      // a.setText(rule.name);
      // td.appendChild(a);
      // tr.appendChild(td);
      // td = createElement('td');
      // td.setText(rule.description);
      // tr.appendChild(td);
      // td = createElement('td');
      // td.setText('<select onchange="toggleConfigVisibility(this)">\n'+
      //       '  <option value="off">off</option>\n' +
      //       '  <option value="warn">warn</option>\n' +
      //       '  <option value="error">error</option>\n' +
      //       '<select>');
      // tr.appendChild(td);
      // html += tr.toString();
      //
      // tr = createElement('tr');
      // tr.class='hidden';
      // td = createElement('td');
      // td.colspan = 3;
      // td.setText('hidden stuffs <br> abc <br> 123');
      // tr.appendChild(td);
      // html += tr.toString();

      // html += ruleLine({
      //   name: rule.name,
      //   url: rule.url,
      //   description: rule.description
      // });
    });

    html+='</tbody>\n</table>\n</form>';
    return html;
  }

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

};
