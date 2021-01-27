[centos@ip-10-0-1-234 myapp]$ cat walp.js
var express = require('express');
var app = express();
var https = require('https');
var querystring = require('querystring');
var login_token = '';
var appid_array = [];


function dream0() { console.log("dream0"); setTimeout(dream1, 5000); }
function dream1() { console.log("dream1"); create_app('django_dot_edu'); setTimeout(dream2, 5000); }
function dream2() { console.log("dream2"); create_app('death_on_the_nile_dot_edu'); setTimeout(dream3, 4000); }
function dream3() { console.log("dream3"); create_app('before_the_flood_dot_cc'); setTimeout(dream4, 4000); }
function dream4() { console.log("dream4");  create_app('cudathon_cc'); }


function list_apps() {
    console.log("List_apps login_token: " + login_token);
    var options = {
        hostname: 'api.waas.barracudanetworks.com',
        port: 443,
        path: '/v2/waasapi/applications/',
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'auth-api': login_token
        }
    }

    var req = https.request(options, res => {
        console.log("List_Apps statusCode: " + res.statusCode)
        //console.log('headers:', res.headers);


        let chunks = [];

        res.on('data', d => { chunks.push(d); })
    res.on('end', function() {
                let data   = Buffer.concat(chunks);
                let d = JSON.parse(data);

        console.log("----> " + d);
                var ressis = d.results;
        for(var r of ressis) {
                        console.log("Here in list apps and the app named " + r.name + " has an I.D. of -> " + r.id);
                        appid_array.push(r.id);
        }
        })
    })

    req.on('error', error => { console.error(error) });
    req.end();
}

async function login(email, password) {

    var postdata = querystring.stringify({
        'email': email,
        'password': password
    });
    var options = {
        hostname: 'api.waas.barracudanetworks.com',
        port: 443,
        path: '/v2/waasapi/api_login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postdata.length
        }
    };
    var req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        //console.log('headers:', res.headers);

        res.on('data', (d) => {
            var dobj = JSON.parse(d);
            login_token = dobj.key;
            console.log('---------------The below should be the API key / token YAY!-------------------------------------');
            console.log(login_token);
        setTimeout(dream0,10000);
            list_apps();
        });
        });


    console.log('email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
    req.write('email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
    //console.log('email=' + encodeURIComponent('waas-student01@bugbug.me') + '&password=' + encodeURIComponent('serenitynow_insanitylater'));

    req.on('error', (e) => { console.error(e); });
    req.end();


    //curl -X POST "https://api.waas.barracudanetworks.com/v2/waasapi/api_login/" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "email=waas-student01%40bugbug.me&password=serenitynow_insanitylater"
    //curl -X GET "https://api.waas.barracudanetworks.com/v2/waasapi/applications/" -H "accept: application/json" -H "auth-api: eyJhY2Nf9cc84630ff6e132ffcabff04"

}

async function create_app(appname) {

    var body = JSON.stringify(
        {
                "useHttp": true,
                "backendPort": 443,
                "serviceIp": "2.2.2.2",
                "hostnames": [ { "hostname": "www.wolmarans.com" } ],
                "httpsServicePort": "80",
                "backendType": "HTTP",
                "redirectHTTP": false,
                "applicationName": appname,
                "serviceType": "HTTP",
                "backendIp": "23.239.5.221",
                "useExistingIp": true,
                "useHttps": false,
                "account_ips": {},
                "httpServicePort": 80,
                "maliciousTraffic": "Passive"
    }
    )

    var options = {
        hostname: 'api.waas.barracudanetworks.com',
        port: 443,
        path: '/v2/waasapi/applications/',
        method: 'POST',
        headers: {
        'accept': 'application/json',
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body),
        'auth-api': login_token
        }
    }


    var req = https.request(options, res => {
        console.log("create_app statusCode: " + res.statusCode)
        console.log('headers:', res.headers);
    })

    req.write(body);

    req.on('error', error => { console.error(error) });
    req.end();
}

var myArgs = process.argv.slice(2);
email = myArgs[0];
password = myArgs[1];
login(email, password);
[centos@ip-10-0-1-234 myapp]$
