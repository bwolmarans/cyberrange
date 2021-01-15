[centos@ip-10-0-1-234 myapp]$ cat app.js
var express = require('express');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var app = express();
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

var instance_ids_array = [];
var https = require('https');
var http = require('http');
var fs = require('fs');

var login_token = "this will be our WAFaaS login token";
var appid_array = [];
var achetml = 'List of Application IDs<br>---------------------------<br>';
var globalres;

// At the top of your server.js
process.env.PWD = process.cwd()

// Then
app.use(express.static(process.env.PWD + '/public'));


// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
//AWS.config.update({region: 'us-east-1'});
console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
// NOTE: Have to run sudo to get node to run ports less than 1024, then have to run sudo with dash capital E to get centos users environment variables so sudo -E node app.js
const awsconfig = {
    apiVersion: "2010-12-01",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
}
AWS.config.update(awsconfig);
//<- If you want send something to your bucket, you need take off the region settings, because the S3 are global.


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/go', function (req, res) {
    console.log(req.body.uuuu)
    console.log(req.body.pppp)
    if (req.body.uuuu == 'cudacudacuda' && req.body.pppp == 'cudacudacuda') {
        res.sendFile(__dirname + '/index.html');
        } else {
                res.sendFile(__dirname + '/login.html');
        }
});


app.post('/describe_aws_instances', function (req, res) {



// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
  DryRun: false,
  Filters: [
        {
            Name: 'tag:dartboard',
            Values: [
                'badstore'
            ]
        }
    ]
};

// Call EC2 to retrieve policy for selected bucket
ec2.describeInstances(params, function(err, data) {
  if (err) {
    console.log("Error", err.stack);
  } else {
    const sss = JSON.stringify(data, null, 4);
    console.log(sss);
    console.log('----------------contoso------------------');
   // const ppp = JSON.parse(data);
    //console.log(data.Reservations[0].Instances[0].InstanceId);
    const iii = data.Reservations[0].Instances;
    for(let ii of iii){console.log(ii.InstanceId);}
    //console.log("Success", data);
  }
});
});

app.get('/start_backend', function (req, res) {
    var params = {
        DryRun: false,
        Filters: [
        {
            Name: 'tag:' + 'dartboard',
            Values: [
                'badstore'
            ]
        }
        ]
    };
    globalres = res;
    ec2_start_stop_wrapper('start', params);
    //res.writeHead(204);
    //res.end();
});

app.get('/stop_backend', function (req, res) {
    var params = {
        DryRun: false,
        Filters: [
        {
            Name: 'tag:' + 'dartboard',
            Values: [
                'badstore'
            ]
        }
        ]
    };
    globalres = res;
    ec2_start_stop_wrapper('stop', params);
    //res.writeHead(204);
    //res.end();
});

app.post('/startstop_aws_instance', function (req, res) {
        var params = {
                DryRun: false,
                Filters: [
        {
            Name: 'tag:' + 'dartboard',
            Values: [
                'badstore'
            ]
        }
        ]
        };
    console.log("OK we clicked the mouse");
        ec2_start_stop_wrapper(req.body.action, params);
    res.writeHead(204);
    //res.end("We did your action: " + req.body.action);
    res.end();

});

async function ec2_start_stop_wrapper(action, params) {
        console.log("we are now going to try to wait for the array to be built");
        const results = await build_ec2_instance_array(params);
    console.log(results);
    console.log("we are going to start or stop em");
        actually_start_stop_ec2(action);
        console.log("we have done our starting or stopping as it were");
}

function build_ec2_instance_array(params) {
        instance_ids_array = [];
        return new Promise(resolve => {
                var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
                ec2.describeInstances(params, function(err, data) {
                        if (err) { console.log("Error", err.stack); } else {
                        const iii = data.Reservations[0].Instances;
                        for(let ii of iii){var iid = ii.InstanceId;console.log("building adding this brick here ------> " + iid);instance_ids_array.push(iid);}
                                resolve("building of EC2 instances Resolved! " + instance_ids_array);
                        }
                });
        });
};


function actually_start_stop_ec2(action) {
        var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
        var params = {
                InstanceIds:instance_ids_array,
                DryRun: true
        };
    var tmp = '';
        if (action.toUpperCase() === "START") {
          tmp = "starting backend instances";
                console.log(tmp);
          // Call EC2 to start the selected instances
          ec2.startInstances(params, function(err, data) {
                if (err && err.code == 'DryRunOperation') {
                  params.DryRun = false;
                  ec2.startInstances(params, function(err, data) {
                          if (err) {
                tmp = "Error: " + err;
                                console.log(tmp);
                          } else if (data) {
                                tmp = "Starting Instances good! " + JSON.stringify(data.StartingInstances);
                                console.log(tmp);
                                globalres.send('Success: ' + JSON.stringify(data.StartingInstances));
                          }
                  });
                } else {
                  tmp = "You don't have permission to start instances."
                        console.log(tmp);
                }
          });
        } else if (action.toUpperCase() === "STOP") {
          tmp = "stopping backend instances";
                console.log(tmp);
          // Call EC2 to stop the selected instances
          ec2.stopInstances(params, function(err, data) {
                if (err && err.code === 'DryRunOperation') {
                  params.DryRun = false;
                  ec2.stopInstances(params, function(err, data) {
                          if (err) {
                tmp = "Error: " + err;
                                console.log(tmp);
                          } else if (data) {
                                tmp = "Stopping ec2 Success! " + JSON.stringify(data.StoppingInstances);
                                console.log(tmp);
                                globalres.send('Success: ' + JSON.stringify(data.StoppingInstances));
                          }
                  });
                } else {
                  tmp = "You don't have permission to stop instances"
                }
          });
        }
}


//app.get('/', function (req, res) {
//    res.send('<html><body><h1>Hello World</h1></body></html>');
//});

app.post('/login', function (req, res) {
        console.log(req.body.username)
        console.log(req.body.password)

        var querystring = require('querystring');
        var postData = querystring.stringify({
    'email': req.body.username,
    'password': req.body.password
        });
        var options = {
        hostname: 'api.waas.barracudanetworks.com',
        port: 443,
        path: '/v2/waasapi/api_login/',
                method: 'POST',
                headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
        }
        };
        var req2 = https.request(options, (res2) => {
                console.log('statusCode:', res2.statusCode);
                console.log('headers:', res2.headers);
                res2.on('data', (d) => {
                        // interesting behavior: console.log(d);
                        process.stdout.write(d);
                        console.log('');
                        var dobj = JSON.parse(d);
                        login_token = dobj.key;
                        console.log('---------------The below should be the API key / token YAY!-------------------------------------');
                        console.log(login_token);
                        // it says headers already sent - where?
                        // res.send(login_token);
                        console.log('----------------------------------------------------');
                        //res.writeHead(302, { 'Location': 'https://waas.barracudanetworks.com/applications' });
                        //res.end("We did your action: " + req.body.action);
                        res.end(login_token);
                });
        });

        //req2.write('email=waas-student01%40bugbug.me&password=serenitynow_insanitylater');
        console.log('email=' + encodeURIComponent(req.body.username) + '&password=' + encodeURIComponent(req.body.password));
        req2.write('email=' + encodeURIComponent(req.body.username) + '&password=' + encodeURIComponent(req.body.password));
        req2.on('error', (e) => {
        console.error(e);
        });

        //curl -X POST "https://api.waas.barracudanetworks.com/v2/waasapi/api_login/" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "email=waas-student01%40bugbug.me&password=serenitynow_insanitylater"
//curl -X GET "https://api.waas.barracudanetworks.com/v2/waasapi/applications/" -H "accept: application/json" -H "auth-api: eyJhY2NfaWQiOiAxMDk1OTMwMSwgInVzZXJfaWQiOiA4NDE4NDE1NCwgImV4cGlyYXRpb24iOiAxNjA2ODU4Nzk4fQ==.dba1fecf39fc2c8c2cb8f67bc1fdbdf1829277ed9cc84630ff6e132ffcabff04"
});

app.post('/login_ajax', function (req, res) {
console.log("distant shore");
console.log(req.body.username)
console.log(req.body.password)
res.send("hello! " + req.body.username + " with password " + req.body.password);
res.end();
});

function delete_apps(res2) {
    var tmp = '';
    appid_array.forEach(async function(appid) {

        let xxx = "api.waas.barracudanetworks.com";
        let lll = '/v2/waasapi/applications/' + appid + '/';
        console.log("deleting " + xxx + " " + lll);
        tmp = tmp + "deleting " + xxx + " " + lll + " | ";

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
    //res2.writeHead(204);
    res2.send(tmp);
}


app.get('/delete_apps', function (req, res) {
    if (appid_array.length == 0) {
                list_apps_async_wrapper(res);
    }
    setTimeout(delete_apps,3000, res);
        //setTimeout(list_apps_async_wrapper, 3000, res);
});


function list_apps() {
        return new Promise(resolve => {
                console.log("I promise to return the list of apps.")
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
                appid_array.length = 0;
                var req = https.request(options, res => {
                        console.log("List_Apps statusCode: " + res.statusCode)
                        //console.log('headers:', res.headers);

                        let chunks = [];
                        res.on('data', d => { chunks.push(d); })
                        res.on('end', function() {
                                let data = Buffer.concat(chunks);
                                let d = JSON.parse(data);
                                var ressis = d.results;
                                if(ressis){
                                        achetml = '<div class="tight-text">';
                                        for(var r of ressis) {
                                                console.log("About to push to array an appid of -> " + r.id);
                                                appid_array.push(r.id);
                                                achetml = achetml + '<div>name: ' + r.name + ' id: ' + r.id + '</div>';
                                        }
                                        achetml = achetml + '</div>';
                                        console.log("phew, got em!");
                                        resolve("list apps Resolved! " + appid_array);
                                } else {
                                        resolve("no apps, sorry.");
                                        console.log("no apps found, maybe you did not log in ?");
                                }
                        })
                })

                req.on('error', error => { console.error(error) });
                req.end();
    })
}


app.get('/list_apps', function (req, res) {
    list_apps_async_wrapper(res);
});

async function list_apps_async_wrapper(res) {
        const results = await list_apps();
        console.log(results);
        res.send(achetml);
        res.end;
}

app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

//var server = app.listen(3000, function () {
//    console.log('Node server is running..');
//});
//var privateKey  = fs.readFileSync('key.pem', 'utf8');
//var certificate = fs.readFileSync('cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/partnerlab.cudathon.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/partnerlab.cudathon.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/partnerlab.cudathon.com/chain.pem', 'utf8');
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/labaas.cudathon.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/labaas.cudathon.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/labaas.cudathon.com/chain.pem', 'utf8');

const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
console.log("running");

[centos@ip-10-0-1-234 myapp]$
