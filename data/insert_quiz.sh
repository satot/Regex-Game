#!/bin/bash

#DEV=1$B$J$i$P(Blocal$B$N(Bmongo$B$X(B 0$B$J$i(Bheroku$B$N(Bmongo$B$X(B
DEV=1

ruby yml2json.rb
if [ $DEV -eq 1 ] ; then
    echo "insert data to localhost"
    mongo app14201811 --eval "printjson(db.study.drop())"
    mongoimport -d app14201811 -c study -type json -file study.js -headerline
else
    echo "insert data to production"
	mongo alex.mongohq.com:10015/app14201811 -u regex -p --eval "printjson(db.study.drop())"
    mongoimport -h alex.mongohq.com:10015 -d app14201811 -c study -type json -file study.js -headerline -u regex -pregex
fi

rm study.js
