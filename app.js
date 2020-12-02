var express = require('express');
var app = express();
global.globaltoken = "this will be our WAFaaS login token";

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/startstop_aws_instance', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
  DryRun: false
};

// Call EC2 to retrieve policy for selected bucket
ec2.describeInstances(params, function(err, data) {
  if (err) {
    console.log("Error", err.stack);
  } else {
    console.log("Success", JSON.stringify(data));
  }
});
 var params = {
  InstanceIds: [
     req.body.lastName
  ],
  DryRun: true
 };

if (req.body.firstName.toUpperCase() === "START") {
  // Call EC2 to start the selected instances
  ec2.startInstances(params, function(err, data) {
    if (err && err.code == 'DryRunOperation') {
      params.DryRun = false;
      ec2.startInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Success", data.StartingInstances);
          }
      });
    } else {
      console.log(err.code + " You don't have permission to start instances.");
    }
  });
} else if (req.body.firstName.toUpperCase() === "STOP") {
  // Call EC2 to stop the selected instances
  ec2.stopInstances(params, function(err, data) {
    if (err && err.code === 'DryRunOperation') {
      params.DryRun = false;
      ec2.stopInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Success", data.StoppingInstances);
          }
      });
    } else {
      console.log("You don't have permission to stop instances");
    }
  });
}

    res.send(name + ' Submitted Successfully!');
});


//app.get('/', function (req, res) {
//    res.send('<html><body><h1>Hello World</h1></body></html>');
//});

app.post('/login', function (req, res) {
    res.send('Now attempting to login to Barracuda WAFaaS');
var querystring = require('querystring');
var https = require('https');
var postData = querystring.stringify({
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
    var auth_api = dobj.key;
    console.log('---------------The below should be the API key / token YAY!-------------------------------------');
    console.log(auth_api);
    global.globaltoken = auth_api;
    console.log('----------------------------------------------------');
  });
});

req2.write('email=waas-student01%40bugbug.me&password=serenitynow_insanitylater');
req2.on('error', (e) => {
  console.error(e);
});

//curl -x POST "https://api.waas.barracudanetworks.com/v2/waasapi/api_login/" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "email=waas-student01%40bugbug.me&password=serenitynow_insanitylater"
//curl -X GET "https://api.waas.barracudanetworks.com/v2/waasapi/applications/" -H "accept: application/json" -H "auth-api: eyJhY2NfaWQiOiAxMDk1OTMwMSwgInVzZXJfaWQiOiA4NDE4NDE1NCwgImV4cGlyYXRpb24iOiAxNjA2ODU4Nzk4fQ==.dba1fecf39fc2c8c2cb8f67bc1fdbdf1829277ed9cc84630ff6e132ffcabff04"

});

app.post('/uuulist_apps', function (req, res) {
console.log(globaltoken);

const https = require('https');

const options2 = {
  hostname: 'api.waas.barracudanetworks.com',
  port: 443,
  path: '/v2/waasapi/applications/',
  method: 'GET',
  headers: {
       'accept': 'application/json',
       'auth-api': 'eyJhY2NfaWQiOiAxMDk1OTMwMSwgInVzZXJfaWQiOiA4NDE4NDE1NCwgImV4cGlyYXRpb24iOiAxNjA2ODY4Mzk0fQ==.5b6b9948b1b8d4fe29f578aa4065fa4f3f616bb027bbffd9fc6deafc4ecf32aa'
     }
};

https.get('https://api.waas.barracudanetworks.com/v2/waasapi/applications/', (resp) => {
console.log('statusCode:', resp.statusCode);
  console.log('headers:', resp.headers);

  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    console.log(JSON.parse(data).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});


app.post('/list_apps', function (req, res) {
res.send('Now attempting to list the applications');

const https = require('https')
const options = {
  hostname: req.body.hostname,
  port: 443,
  path: req.body.urlpath,
  method: 'GET',
  headers: {
       'accept': 'application/json',
       'auth-api': globaltoken
     }
}

const reqi = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

reqi.on('error', error => {
  console.error(error)
})

reqi.end()

});

app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

app.delete('/delete-data', function (req, res) {
    res.send('DELETE Request');
});

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});
