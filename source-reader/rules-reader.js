'use strict';

const fs = require('fs');
const readline = require('readline');


module.exports = function() {
  //console.log(__dirname);  // process.cwd()
  const rules_dir = __dirname + '/git-clone/eslint/lib/rules/'; // TODO: safe termination '/'

  const files = fs.readdirSync(rules_dir);

  var cc = 0;
  files.forEach(function list_files(file) {  // TODO: lazy load (sync-like) OR Promise all()
    if (file.search('.js$') !== -1) {
      console.log(cc + ' - ' + file);
      cc++;

      //var ff = fs.readFileSync(rules_dir + file);
      //console.log(ff);
      const rl = readline.createInterface({
        input: fs.createReadStream(rules_dir + file)
      });

      let phase1 = false, copy = false, brackets = 0;
      let rule_meta = '';

      rl.on('line', (line) => {
        //console.log(`Line from file ${file}: ${line}`);
        if (!copy && line.search('module.exports') !== -1)
          phase1 = true;
        if (phase1 && line.search('meta:') !== -1)
          copy = true;
        if (copy && line.search('{') !== -1)
          brackets++;
        if (copy && line.search('}') !== -1)
          brackets--;
        if (copy && brackets == 0) {   // TODO: bugfix if meta and { are in different lines
          phase1 = false;
        }

        if (copy) {
          //console.log(file + ': ' +line);
          rule_meta += line;

          if (phase1 === false)
            copy = false; // TODO: goto end !
        }

      });

      rl.on('close', () => {
        console.log('Ending file ' + file);
        console.log(rule_meta);
        process.exit();  // ------------------------------<<<<<
      });

    }
  });

  return {};
};
