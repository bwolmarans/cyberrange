root@ip-172-31-8-35:/home/admin/cyberrange# it is barracudawaf < - - - look here
root@ip-172-31-8-35:/home/admin/cyberrange# cat cyberrange.js
var express = require('express');
var events = require('events');
//var https = require('https');
var http = require('http');
var fs = require('fs');
var shell = require('shelljs');
var util = require('util');
var got = require('got');
var sha256 = require('js-sha256');

var app = express();
//var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
//app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

var instance_ids_array = [];

var login_token = "this will be our WAFaaS login token";
var appid_array = [];
var appname_array = [];
var achetml = 'List of Application IDs<br>---------------------------<br>';
var globalres;

// At the top of your server.js
process.env.PWD = process.cwd()

// Then
app.use(express.static(process.env.PWD + '/public'));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/go', function (req, res) {
    console.log(req.body.uuuu)
    console.log(req.body.pppp)
    var hashcakes = sha256.create();
    hashcakes.update(req.body.uuuu);
    var hotdogs = sha256.create();
    hotdogs.update(req.body.pppp);
    if (hashcakes == '6d6e5375c8d9b66f8b8a72966f503bece2d9f4b2b8e94da78ca7c8a0cafe9a7f' ) {
                if (hotdogs == '6d6e5375c8d9b66f8b8a72966f503bece2d9f4b2b8e94da78ca7c8a0cafe9a7f') {
                        res.sendFile(__dirname + '/index.html');
                } else {
                        res.sendFile(__dirname + '/login.html');
                }
        } else {
                res.sendFile(__dirname + '/login.html');
        }
});

app.get('/sqlmap_badstore-wafaas', function (req, res) {
// sqlmap gets stuck thinking it is in interactive mode.
// the only fix I have found it to go and edit sqlmap/lib/core/option.py and edit out the 'STDIN' message part, so that fix must be in place or else this will hang
// original and good lll = shell.exec('./do_sqlmap.sh https://badstore-wafaas.cudathon.com', {silent:true}).stdout;
lll = shell.exec('./do_sqlmap.sh https://badstore-wafaas.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/sqlmap_badstore-origin', function (req, res) {
// sqlmap gets stuck thinking it is in interactive mode.
// the only fix I have found it to go and edit sqlmap/lib/core/option.py and edit out the 'STDIN' message part, so that fix must be in place or else this will hang
console.log('sqlmap');
//lll = shell.exec('./do_sqlmap.sh http://badstore-origin.cudathon.com', {silent:true}).stdout;
lll = shell.exec('./do_sqlmap.sh http://badstore-origin.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/hydra_badstore-wafaas', function (req, res) {
lll = shell.exec('./do_hydra.sh https://badstore-wafaas.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/hydra_badstore-origin', function (req, res) {
lll = shell.exec('./do_hydra.sh http://badstore-origin.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})


app.get('/stealadmincookie_badstore-origin', function (req, res) {
lll = shell.exec('./do_stealadmincookie.sh http://badstore-origin.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/stealadmincookie_badstore-wafaas', function (req, res) {
lll = shell.exec('./do_stealadmincookie.sh https://badstore-wafaas.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

//const privateKey = fs.readFileSync('/etc/letsencrypt/live/partnerlab.cudathon.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/partnerlab.cudathon.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/partnerlab.cudathon.com/chain.pem', 'utf8');

//const credentials = {
//      key: privateKey,
//      cert: certificate,
//      ca: ca
//};

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
//httpsServer.listen(443);
console.log("running");

root@ip-172-31-8-35:/home/admin/cyberrange#

