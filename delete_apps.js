[centos@ip-10-0-1-234 myapp]$ cat delete_apps.js
var express = require('express');
var app = express();
var https = require('https');
var querystring = require('querystring');
var login_token = '';
var appid_array = [];
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()


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

                var ressis = d.results;
        for(var r of ressis) {
                        console.log("Here in list apps and the app named " + r.name + " has an I.D. of -> " + r.id);
                        appid_array.push(r.id);
        }
                eventEmitter.emit('listed_apps')
        })
    })

    req.on('error', error => { console.error(error) });
    req.end();
}

async function login(email, password) {

    console.log("email=" + email + "&password=" + password)
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
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            var dobj = JSON.parse(d);
            login_token = dobj.key;
            console.log('---------------The below should be the API key / token YAY!-------------------------------------');
            console.log(login_token);
            eventEmitter.emit('logged_in')
        });
        });


    //req.write("email=waas-student02%40bugbug.me&password=serenitynow_insanitylater");
    //console.log(encodeURI("email=" + email + "&password=" + password));
    console.log('email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
    req.write('email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));

    req.on('error', (e) => { console.error(e); });
    req.end();

}


function delete_apps() {
    var tmp = '';
    appid_array.forEach(async function(appid) {

        let xxx = "api.waas.barracudanetworks.com";
        let lll = '/v2/waasapi/applications/' + appid + '/';
        console.log("deleting " + xxx + " " + lll);
        tmp = tmp + "deleting " + xxx + " " + lll + "<br>";

        var options = {
          hostname: xxx,
          port: 443,
          path: lll,
          method: 'DELETE',
          headers: {
               'accept': 'application/json',
               'auth-api': login_token
                }
        }
        var req = https.request(options, res => {
            console.log('statusCode: '+ res.statusCode);
            const index = appid_array.indexOf(appid);
            if (index > -1) { appid_array.splice(index, 1); }

        });

        req.on('error', error => { console.error(error) })
        req.end();

    });
}

eventEmitter.on('logged_in', () => {
  console.log('logged_in')
  list_apps();
})

eventEmitter.on('listed_apps', () => {
  console.log('listed_apps')
  delete_apps();
})


var myArgs = process.argv.slice(2);
email = myArgs[0];
password = myArgs[1];
login(email, password);
[centos@ip-10-0-1-234 myapp]$
