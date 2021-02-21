
**Main program:** partnerlab.js and index.html

These call some of the other programs, look at the code to determine which.


export AWS_PROFILE=testuser

export AWS_DEFAULT_REGION=us-east-1

export AWS_SECRET_ACCESS_KEY=secret

export AWS_ACCESS_KEY_ID=access

( you will have to npm add the following packages: all the ones that spit errors! and npm install nodemon )



sudo -E nodemon partnerlab.js

The sudo -E is because there was some nasty issues running as root and of course it's a pain to run low ports as a user


