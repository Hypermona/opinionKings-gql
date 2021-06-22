#!/bin/bash

cd /home/ec2-user/express-gql/

node app.js

#start our node app in the background
node app.js > app.out.log 2> app.err.log < /dev/null & 