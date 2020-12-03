[centos@ip-10-0-1-234 myapp]$ cat app.js
var express = require('express');
var app = express();
var instance_ids_array = [];
var https = require('https');
var login_token = "this will be our WAFaaS login token";
var appid_array = [];

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
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


app.post('/startstop_aws_instance', function (req, res) {

var params = {
  DryRun: false,
  Filters: [
        {
            Name: 'tag:' + req.body.tagname,
            Values: [
                req.body.tagvalue
            ]
        }
    ]
};
build_instance_array(params);
console.log("gee I sure wish we could wait before getting here!");


setTimeout(() => { start_stop_em(req.body.action); }, 3000);

});


function build_instance_array(params) {
instance_ids_array = [];
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
ec2.describeInstances(params, function(err, data) {
  if (err) {
    console.log("Error", err.stack);
  } else {
    //const sss = JSON.stringify(data, null, 4);
    //console.log(sss);
    //console.log('----------------contoso------------------');
   // const ppp = JSON.parse(data);
    //console.log(data.Reservations[0].Instances[0].InstanceId);
    const iii = data.Reservations[0].Instances;
    ida = [];
    //sloppy assignment of variable ida without preceding it with var or const makes it global, conveniently
    for(let ii of iii){var iid = ii.InstanceId;console.log("building adding this brick here ------> " + iid);instance_ids_array.push(iid);}
    //console.log("Success", data);
  }
  console.log("Hi there ->" + instance_ids_array);
});
}

function start_stop_em(action) {
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
 var params = {
  InstanceIds:instance_ids_array,
  DryRun: true
 };

if (action.toUpperCase() === "START") {
  console.log("starting instances");
  // Call EC2 to start the selected instances
  ec2.startInstances(params, function(err, data) {
    if (err && err.code == 'DryRunOperation') {
      params.DryRun = false;
      ec2.startInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Starting Instances good!", data.StartingInstances);
            //res.send('Success: ' + JSON.stringify(data.StartingInstances));
          }
      });
    } else {
      console.log(err.code + " You don't have permission to start instances.");
    }
  });
} else if (action.toUpperCase() === "STOP") {
  console.log("stopping instances");
  // Call EC2 to stop the selected instances
  ec2.stopInstances(params, function(err, data) {
    if (err && err.code === 'DryRunOperation') {
      params.DryRun = false;
      ec2.stopInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Success", data.StoppingInstances);
            //res.send('Success: ' + JSON.stringify(data.StoppingInstances));
          }
      });
    } else {
      console.log("You don't have permission to stop instances");
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
    res.send(login_token);
    console.log('----------------------------------------------------');
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

function delete_apps() {

    appid_array.forEach(function(appid) {

        let xxx = "api.waas.barracudanetworks.com";
        let lll = '/v2/waasapi/applications/' + appid + '/';
        console.log("~~~~~~~~~~```````````````````````````````````````~~~~~~~~~~~~~~~~~");
        console.log("deleting " + xxx + " " + lll);
        console.log("~~~~~~~~~~```````````````````````````````````````~~~~~~~~~~~~~~~~~");

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
        });

        req.on('error', error => { console.error(error) })
        req.end();

        });
}


app.post('/delete_apps', function (req, res) {
        delete_apps()
});


function list_apps() {

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

    var req = https.request(options, res2 => {
      console.log("List_Apps statusCode: " + res2.statusCode)

      res2.on('data', d => {
        d = JSON.parse(d);
        console.log('hello');
        console.log(login_token);
console.log(d);
        var ressis = d.results;
        for(var r of ressis) {
            console.log("Here in list apps and the app named " + r.name + " has an I.D. of -> " + r.id);
            appid_array.push(r.id);
        }
        display_app_array();
        delete_apps();
      })
    })

    req.on('error', error => { console.error(error) });
    req.end();
}

function display_app_array() {
        for (var i = 0; i < appid_array.length; i++) {
                console.log("ummm -> " + appid_array[i]);
        }
}


app.post('/list_apps', function (req, res) {
    list_apps();
});


app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});
[centos@ip-10-0-1-234 myapp]$



