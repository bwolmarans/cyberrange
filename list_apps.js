[centos@ip-10-0-1-234 partnerlab]$ node list_apps waas-student01@bugbug.me serenitynow_insanitylater
statusCode: 200
---------------The below should be the API key / token YAY!-------------------------------------
eyJleHBpcmF0aW9uIjogMTYxMzc4NzcwNiwgImFjY19pZCI6IDEwOTU5MzAxLCAidXNlcl9pZCI6IDg0MTg0MTU0fQ==.5c1fe146d056074294d37566c6a0a782534ad778779ba21ca9ecd920cc8a23f7
email=waas-student01%40bugbug.me&password=serenitynow_insanitylater
List_apps login_token: eyJleHBpcmF0aW9uIjogMTYxMzc4NzcwNiwgImFjY19pZCI6IDEwOTU5MzAxLCAidXNlcl9pZCI6IDg0MTg0MTU0fQ==.5c1fe146d056074294d37566c6a0a782534ad778779ba21ca9ecd920cc8a23f7
List_Apps statusCode: 200
Here in list apps and the app named badstore has an I.D. of -> 10280
{
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 12524,
      protocol: 'Redirect Service',
      dps_service: [Object],
      managed_service: [Object],
      certificate: [Object],
      advanced_configuration: [Object],
      enable_ssl_3: false,
      enable_tls_1: false,
      enable_tls_1_1: true,
      enable_tls_1_2: true,
      enable_tls_1_3: true,
      monitored: true,
      session_timeout: 60,
      cname: 'app364663.prod.cudawaas.com',
      cipher_suite_name: 'all',
      custom_ciphers: [],
      enable_pfs: false
    },
    {
      id: 12525,
      protocol: 'HTTPS',
      dps_service: [Object],
      managed_service: [Object],
      certificate: [Object],
      advanced_configuration: [Object],
      enable_ssl_3: false,
      enable_tls_1: false,
      enable_tls_1_1: true,
      enable_tls_1_2: true,
      enable_tls_1_3: true,
      monitored: true,
      session_timeout: 60,
      cname: 'app364663.prod.cudawaas.com',
      cipher_suite_name: 'all',
      custom_ciphers: [],
      enable_pfs: false
    }
  ]
}
[centos@ip-10-0-1-234 partnerlab]$ ping app364663.prod.cudawaas.com
PING app364663.prod.cudawaas.com (64.113.57.140) 56(84) bytes of data.
^C64 bytes from 64.113.57.140: icmp_seq=1 ttl=50 time=1.83 ms

--- app364663.prod.cudawaas.com ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 1.835/1.835/1.835/0.000 ms
[centos@ip-10-0-1-234 partnerlab]$ cat list_apps.js
var express = require('express');
var app = express();
var https = require('https');
var querystring = require('querystring');
var got = require('got');
var appid_array = [];


async function list_apps(login_token) {
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

    var res = await got(options)
        console.log("List_Apps statusCode: " + res.statusCode)
        //console.log('headers:', res.headers);
        let d = JSON.parse(res.body);
        var ressis = d.results;
        for(var r of ressis) {
                console.log("Here in list apps and the app named " + r.name + " has an I.D. of -> " + r.id);
                appid_array.push(r.id);
        }
}

async function login(email, password) {

    var postdata = querystring.stringify({ 'email': email, 'password': password });
    var options = {
        hostname: 'api.waas.barracudanetworks.com',
        port: 443,
        path: '/v2/waasapi/api_login/',
        method: 'POST',
        timeout: 1000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': postdata.length },
        body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
    };
    var res = await got(options)
        console.log('statusCode:', res.statusCode);
        var d = JSON.parse(res.body);
        login_token = d.key;
        console.log('---------------The below should be the API key / token YAY!-------------------------------------');
        console.log(login_token);
    console.log('email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
    //console.log('email=' + encodeURIComponent('waas-student01@bugbug.me') + '&password=' + encodeURIComponent('serenitynow_insanitylater'));
    return login_token
}

async function show_endpoints () {
for (let appid of appid_array) {
var options = {
hostname: 'api.waas.barracudanetworks.com',
port: 443,
path: '/v2/waasapi/applications/' + appid + '/endpoints/?page=1',
timeout: 1100,
method: 'GET', headers: { 'accept': 'application/json', 'auth-api': login_token }
}
res = await got(options);
console.log(JSON.parse(res.body))
}

}


var myArgs = process.argv.slice(2);
email = myArgs[0];
password = myArgs[1];
async function main(email, password) {
login_token = await login(email, password)
await list_apps(login_token)
await show_endpoints()
}
main(email, password);
[centos@ip-10-0-1-234 partnerlab]$
