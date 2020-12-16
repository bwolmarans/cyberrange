[centos@ip-10-0-1-234 myapp]$ node walp.js
statusCode: 200
---------------The below should be the API key / token YAY!-------------------------------------
eyJleHBpcmF0aW9uIjogMTYwNzAyNDYyMSwgImFjY19pZCI6IDEwOTU5MzAxLCAidXNlcl9pZCI6IDg0MTg0MTU0fQ==.ef28bb5d955b3a798e9ae2d7b2bed1e3a8d569beedd87403c64d39013e897f8c
----------------------------------------------------
List_apps login_token: eyJleHBpcmF0aW9uIjogMTYwNzAyNDYyMSwgImFjY19pZCI6IDEwOTU5MzAxLCAidXNlcl9pZCI6IDg0MTg0MTU0fQ==.ef28bb5d955b3a798e9ae2d7b2bed1e3a8d569beedd87403c64d39013e897f8c
create_apps statusCode: 201
headers: {
  date: 'Thu, 03 Dec 2020 18:43:43 GMT',
  'content-type': 'application/json',
  'content-length': '91',
  connection: 'close',
  'set-cookie': [
    'AWSALB=W+1oFj7y0IMlrx67a3pceGViDOUmRU+wWYi7xtDpZjrVHuauI/5syNQleXoMrcXWdfFsU00knfp6m/GlHW1rTLE0gZlAVjSTgJW/kfF7Om3dBqGFBItufUpTK8Ya; Expires=Thu, 10 Dec 2020 18:43:41 GMT; Path=/',
    'AWSALBCORS=W+1oFj7y0IMlrx67a3pceGViDOUmRU+wWYi7xtDpZjrVHuauI/5syNQleXoMrcXWdfFsU00knfp6m/GlHW1rTLE0gZlAVjSTgJW/kfF7Om3dBqGFBItufUpTK8Ya; Expires=Thu, 10 Dec 2020 18:43:41 GMT; Path=/; SameSite=None; Secure',
    'sessionid=79h4c38gbu5roajxrmy80gwneswt7s8c; HttpOnly; Path=/; SameSite=Lax; Secure'
  ],
  server: 'nginx',
  'x-frame-options': 'SAMEORIGIN',
  allow: 'GET, POST, HEAD, OPTIONS',
  vary: 'Cookie',
  'strict-transport-security': 'max-age=604800; includeSubDomains; preload'
}
List_Apps statusCode: 200
----> [object Object]
Here in list apps and the app named new app has an I.D. of -> 9157
Here in list apps and the app named new app has an I.D. of -> 9158
Here in list apps and the app named new app has an I.D. of -> 9159
Here in list apps and the app named new app has an I.D. of -> 9160
Here in list apps and the app named new app has an I.D. of -> 9161
Here in list apps and the app named new app has an I.D. of -> 9162
Here in list apps and the app named new app has an I.D. of -> 9163
Here in list apps and the app named new app has an I.D. of -> 9164
Here in list apps and the app named new app has an I.D. of -> 9165
Here in list apps and the app named new app has an I.D. of -> 9166
Here in list apps and the app named new app has an I.D. of -> 9167
Here in list apps and the app named new app has an I.D. of -> 9168
Here in list apps and the app named new app has an I.D. of -> 9169
Here in list apps and the app named new app has an I.D. of -> 9170
[centos@ip-10-0-1-234 myapp]$ cat walp.js
var express = require('express');
var app = express();
var https = require('https');
var querystring = require('querystring');
var login_token = '';
var appid_array = [];

function dream1() { console.log("dream1"); create_app('death_on_the_nile_dot_edu'); setTimeout(dream2, 3000); }
function dream2() { console.log("dream2"); create_app('before_the_flood_dot_cc'); setTimeout(dream3, 3000); }
function dream3() { console.log("dream3"); create_app('express_app_dot_com'); }


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

function login() {

    var postdata = querystring.stringify({
        'email': 'waas-student01@bugbug.me',
        'password': 'serenitynow_insanitylater'
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
            console.log('----------------------------------------------------');
            setTimeout(dream1,3000);  
          list_apps();
        });


    });

    req.write("email=waas-student01%40bugbug.me&password=serenitynow_insanitylater");
    //console.log('email=' + encodeURIComponent('waas-student01@bugbug.me') + '&password=' + encodeURIComponent('serenitynow_insanitylater'));

    req.on('error', (e) => { console.error(e); });
    req.end();


    //curl -X POST "https://api.waas.barracudanetworks.com/v2/waasapi/api_login/" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "email=waas-student01%40bugbug.me&password=serenitynow_insanitylater"
    //curl -X GET "https://api.waas.barracudanetworks.com/v2/waasapi/applications/" -H "accept: application/json" -H "auth-api: eyJhY2Nf9cc84630ff6e132ffcabff04"

}

function create_app(appname) {

    var body = JSON.stringify(
        {
                "useHttp": true,
                "backendPort": 443,
                "serviceIp": "2.2.2.2",
                "hostnames": [ { "hostname": "8.8.8.8" } ],
                "httpsServicePort": "443",
                "backendType": "HTTPS",
                "redirectHTTP": true,
                "applicationName": appname,
                "serviceType": "HTTP",
                "backendIp": "1.1.1.1",
                "useExistingIp": true,
                "useHttps": true,
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
        console.log("create_apps statusCode: " + res.statusCode)
        console.log('headers:', res.headers);
    })

    req.write(body);

    req.on('error', error => { console.error(error) });
    req.end();
}

login();
[centos@ip-10-0-1-234 myapp]$


