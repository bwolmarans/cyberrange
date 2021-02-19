
export AWS_PROFILE=testuser
export AWS_DEFAULT_REGION=us-east-1
export AWS_SECRET_ACCESS_KEY=secret
export AWS_ACCESS_KEY_ID=access
( you will have to npm add the following packages: all the ones that spit errors! and npm install nodemon )

The sudo -E is because there was some nasty issues running as root and of course it's a pain to run low ports as a user

sudo -E nodemon app.js



[centos@ip-10-0-1-234 myapp]$ ls public
1V5Iz9a.png  background.png  background.png.old  header-image.png  header-image.png.old  magic.js
[centos@ip-10-0-1-234 myapp]$


app.js  ec2-startstopinstance-via-post.js  index.html  node_modules  package.json  package-lock.json
[centos@ip-10-0-1-234 myapp]$
[centos@ip-10-0-1-234 myapp]$
[centos@ip-10-0-1-234 myapp]$
[centos@ip-10-0-1-234 myapp]$ cat package.json
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "aws-sdk": "^2.800.0",
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "http": "^0.0.1-security",
    "http-debug": "^0.1.2",
    "https": "^1.0.0",
    "uuid": "^3.3.2"
  }
}
[centos@ip-10-0-1-234 myapp]$
