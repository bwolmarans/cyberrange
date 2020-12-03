[centos@ip-10-0-1-234 myapp]$ cat app.js
var express = require('express');
var app = express();
var ida = [];
global.globaltoken = "this will be our WAFaaS login token";
global.appid_array = [];

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

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
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

// Call EC2 to retrieve policy for selected bucket
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
    for(let ii of iii){var iid = ii.InstanceId;ida.push(iid);console.log(iid);}
    //console.log("Success", data);
  }
});

if ( ida.length > 0 ) {
 var params = {
  InstanceIds:ida,
  DryRun: true
 };

if (req.body.action.toUpperCase() === "START") {
  // Call EC2 to start the selected instances
  ec2.startInstances(params, function(err, data) {
    if (err && err.code == 'DryRunOperation') {
      params.DryRun = false;
      ec2.startInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Success", data.StartingInstances);
            res.send('Success: ' + JSON.stringify(data.StartingInstances));
          }
      });
    } else {
      console.log(err.code + " You don't have permission to start instances.");
    }
  });
} else if (req.body.action.toUpperCase() === "STOP") {
  // Call EC2 to stop the selected instances
  ec2.stopInstances(params, function(err, data) {
    if (err && err.code === 'DryRunOperation') {
      params.DryRun = false;
      ec2.stopInstances(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else if (data) {
            console.log("Success", data.StoppingInstances);
            res.send('Success: ' + JSON.stringify(data.StoppingInstances));
          }
      });
    } else {
      console.log("You don't have permission to stop instances");
    }
  });
}
} else {
res.send('uh, we don\'t have no ida yet. Go back and try again.');
}

});


//app.get('/', function (req, res) {
//    res.send('<html><body><h1>Hello World</h1></body></html>');
//});

app.post('/login', function (req, res) {
console.log(req.body.username)
console.log(req.body.password)

var querystring = require('querystring');
var https = require('https');
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
    var auth_api = dobj.key;
    console.log('---------------The below should be the API key / token YAY!-------------------------------------');
    console.log(auth_api);
    global.globaltoken = auth_api;
    res.send(auth_api);
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


app.post('/delete_apps', function (req, res) {

        list_apps(req, res);
        for (var i = 0; i < appid_array.length; i++) {
                console.log(appid_array[i]);
        }

    var https = require('https')

    appid_array.forEach(function(appid) {

        let xxx = "api.waas.barracudanetworks.com";
        let lll = '/v2/waasapi/applications/' + appid + '/';
        console.log("~~~~~~~~~~```````````````````````````````````````~~~~~~~~~~~~~~~~~");
        console.log("deleting " + xxx + " " + lll);
        console.log("~~~~~~~~~~```````````````````````````````````````~~~~~~~~~~~~~~~~~");

        var options3 = {
          hostname: req.body.hostname,
          port: 443,
          path: lll,
          method: 'DELETE',
          headers: {
               'accept': 'application/json',
               'auth-api': globaltoken
                }
        }
        var ireqi = https.request(options3, res4 => {
        console.log('statusCode: '+ res4.statusCode);
        });

        ireqi.on('error', error => {
          console.error(error)
        })

        ireqi.end();

        });
    res.send("ok");

});


function list_apps() {
    var https = require('https')

    var options = {
      hostname: 'api.waas.barracudanetworks.com',
      port: 443,
      path: '/v2/waasapi/applications/',
      method: 'GET',
      headers: {
           'accept': 'application/json',
           'auth-api': globaltoken
         }
    }

    var reqi = https.request(options, res2 => {
      console.log("List_Apps statusCode: " + res2.statusCode)

      res2.on('data', d => {
        d = JSON.parse(d);
        var ressis = d.results;
        for(var r of ressis) {
            console.log("Here in list apps and the app named " + r.name + " has an I.D. of -> " + r.id);
            appid_array.push(r.id);
        }
      })
    })

    reqi.on('error', error => {
      console.error(error)
    });

    reqi.end();
}



app.post('/list_apps', function (req, res) {
        list_apps();
        for (var i = 0; i < appid_array.length; i++) {
        console.log("ummm -> " + appid_array[i]);
        }
    res.end();
});


app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});
[centos@ip-10-0-1-234 myapp]$
