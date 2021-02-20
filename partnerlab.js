[centos@ip-10-0-1-234 partnerlab]$ cat partnerlab.js
var express = require('express');
var events = require('events');
var https = require('https');
var http = require('http');
var fs = require('fs');
var shell = require('shelljs');
var util = require('util');
var got = require('got');

var app = express();
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

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


async function login_to_waas(req, res2) {
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': postData.length },
        body: 'email=' + encodeURIComponent(req.body.username) + '&password=' + encodeURIComponent(req.body.password)
        };
        res = await got(options);
        console.log('statusCode:', res.statusCode);
        console.log('email=' + encodeURIComponent(req.body.username) + '&password=' + encodeURIComponent(req.body.password));
        console.log('');
        var bunch_of_json = JSON.parse(res.body);
        login_token = bunch_of_json.key;
        console.log('---------------The below should be the API key / token YAY!-------------------------------------');
        console.log(login_token);
        console.log('------------------------------------------------------------------------------------------------');
        res2.end(login_token);
        //req2.write('email=waas-student01%40bugbug.me&password=serenitynow_insanitylater');

        //curl -X POST "https://api.waas.barracudanetworks.com/v2/waasapi/api_login/" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "email=waas-student01%40bugbug.me&password=serenitynow_insanitylater"
        //curl -X GET "https://api.waas.barracudanetworks.com/v2/waasapi/applications/" -H "accept: application/json" -H "auth-api: eyJhY2NfaWQiOiAxMDk1OTMwMSwgInVzZXJfaWQiOiA4NDE4NDE1NCwgImV4cGlyYXRpb24iOiAxNjA2ODU4Nzk4fQ==.dba1fecf39fc2c8c2cb8f67bc1fdbdf1829277ed9cc84630ff6e132ffcabff04"

}

async function delete_apps(req, res2) {
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
          headers: { 'accept': 'application/json', 'auth-api': login_token }
        }
        var res = await got(options);
            console.log('statusCode: '+ res.statusCode);
                const index = appid_array.indexOf(appid);
                if (index > -1) { appid_array.splice(index, 1); }
    });
        res2.end(tmp);
}

async function list_apps(req, res2) {
        var options = {
        hostname: 'api.waas.barracudanetworks.com',
        port: 443,
        path: '/v2/waasapi/applications/',
        method: 'GET',
        headers: { 'accept': 'application/json', 'auth-api': login_token }
        }
        appid_array.length = 0;
        appname_array.length = 0;
        var res = await got(options);
        console.log("statusCode: " + res.statusCode)
        let d = JSON.parse(res.body);
        var ressis = d.results;
        if(ressis){
        achetml = '<div class="lbb">';
        for(var r of ressis) {
                console.log("About to push to array an appid of -> " + r.id + " and name " + r.name );
                appid_array.push(r.id);
                appname_array.push(r.name);
                achetml = achetml + '<div>name: ' + r.name + ' id: ' + r.id + '</div>';
        }
        achetml = achetml + '</div>';
        console.log(achetml);
        } else {
                console.log("no apps found, maybe you did not log in ?");
        achetml = "no apps found, maybe you did not log in ?"
    }
        return achetml
}

async function show_endpoints (req, res2) {
        console.log('here')
        console.log('here')
        console.log('here')
        achetml = '';
        for (let appid of appid_array) {
                console.log(appid)
                var options = {
                hostname: 'api.waas.barracudanetworks.com',
                port: 443,
                path: '/v2/waasapi/applications/' + appid + '/endpoints/?page=1',
                timeout: 1100,
                method: 'GET', headers: { 'accept': 'application/json', 'auth-api': login_token }
                }
                res = await got(options);
                bunch_of_json = JSON.parse(res.body);
                boj = bunch_of_json
                console.log(boj.results[0]);
                for (var ep of boj.results) {
                        console.log(ep.cname);
                achetml = achetml + '<div class="lbb">';
                    achetml = achetml + ep.cname;
                    achetml = achetml + '</div>'
                }
                //boj = JSON.stringify(boj)
        }
        console.log(achetml);
        return achetml;
}

app.post('/login_ajax', function (req, res) {
console.log("distant shore");
console.log(req.body.username)
console.log(req.body.password)
res.send("hello! " + req.body.username + " with password " + req.body.password);
res.end();
});

app.post('/login', async function (req, res) {
        console.log(req.body.username)
        console.log(req.body.password)
        login_to_waas(req, res)
})

app.get('/list_apps', async function (req, res) {
    achetml = await list_apps(req, res);
        achetml = await show_endpoints(req, res);
        res.end(achetml);
});

app.get('/delete_apps', function (req, res) {
    if (appid_array.length == 0) { list_apps(); }
    delete_apps(req, res);
});

app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

app.get('/attack_badstore-origin', function (req, res) {
res.send('hello')
lll = shell.exec('./do_hydra.sh badstore-origin.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
// sqlmap gets stuck thinking it is in interactive mode.
// the only fix I have found it to go and edit sqlmap/lib/core/options.py and edit out the 'STDIN' message part, so that fix must be in place or else this will hang
jjj = shell.exec("./do_sqlmap.sh badstore-origin.cudathon.com", {silent:true}).stdout;
jjj = jjj.replace(/\n/g, "<br>")
kkk = lll + jjj
res.send(kkk);
res.end();
})

app.get('/sqlmap_badstore', function (req, res) {
// sqlmap gets stuck thinking it is in interactive mode.
// the only fix I have found it to go and edit sqlmap/lib/core/options.py and edit out the 'STDIN' message part, so that fix must be in place or else this will hang
lll = shell.exec('./do_sqlmap.sh badstore.cudathon.com', {silent:true}).stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/sqlmap_badstore-wafaas', function (req, res) {
// sqlmap gets stuck thinking it is in interactive mode.
// the only fix I have found it to go and edit sqlmap/lib/core/options.py and edit out the 'STDIN' message part, so that fix must be in place or else this will hang
lll = shell.exec('./do_sqlmap.sh badstore-wafaas.cudathon.com', {silent:true}).stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/sqlmap_badstore-origin', function (req, res) {
// sqlmap gets stuck thinking it is in interactive mode.
// the only fix I have found it to go and edit sqlmap/lib/core/options.py and edit out the 'STDIN' message part, so that fix must be in place or else this will hang
lll = shell.exec('./do_sqlmap.sh badstore-origin.cudathon.com', {silent:true}).stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})


app.get('/hydra_badstore', function (req, res) {
lll = shell.exec('./do_hydra.sh badstore.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/hydra_badstore-wafaas', function (req, res) {
lll = shell.exec('./do_hydra.sh badstore-wafaas.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})

app.get('/hydra_badstore-origin', function (req, res) {
lll = shell.exec('./do_hydra.sh badstore-origin.cudathon.com').stdout;
lll = lll.replace(/\n/g, "<br>")
res.send(lll);
})


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

[centos@ip-10-0-1-234 partnerlab]$
