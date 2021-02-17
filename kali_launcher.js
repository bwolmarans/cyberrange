ec2-user@kali:~/node_launcher$ cat kali_launcher.js
const express = require('express')
const app = express()
const birds = require('./birds')

var shell = require('shelljs');
const util = require('util');
const promised_child_exec = util.promisify(require('child_process').exec);
//const promised_child_exec = util.promisify(require('child_process').exec);
async function lsWithGrep() {
  try {
      const { stdout, stderr } = await promised_child_exec('ls | grep walp');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
  } catch (err) {
     console.error(err);
  };
};
//lsWithGrep();

async function do_hydra() {
  try {
      const { stdout, stderr } = await promised_child_exec('./do_hydra.sh');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
  } catch (err) {
     console.error(err);
  };
};
//do_hydra();
async function do_sqlmap() {
  console.log('here');
  try {
      const { stdout, stderr } = await promised_child_exec("./do_sqlmap.sh");
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
  } catch (err) {
     console.error(err);
  };
};
//do_sqlmap();
app.get('/', function (req, res) {
  res.send('hello world')
  res.end
})

app.get('/walp', function (req, res) {
  //res.send('Ok dok')
  //res.end
  //res.send(toString(getls))
//var version = shell.exec('node --version', {silent:true}).stdout;
//res.send(version);
lll = shell.exec('./do_hydra.sh').stdout;
lll = lll.replace(/\n/g, "<br>")
jjj = shell.exec("./do_sqlmap.sh", {silent:true}).stdout;
jjj = jjj.replace(/\n/g, "<br>")
kkk = lll + jjj
res.send(kkk);
//if (!shell.which('blah')) {
  //res.send('Sorry, this script requires git');
  ////shell.exit(1);
//}
  //res.send(blah);
})

app.use('/birds', birds);

app.listen(3000)
ec2-user@kali:~/node_launcher$
