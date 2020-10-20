//in this file I will insert them all into the second table

//Populate database
const { Client } = require('pg');
var async = require('async');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'}); 

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'rcleghorn';
db_credentials.host = 'ds-20.cbk4m9wel0if.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

let rawdata = fs.readFileSync('data/03.json');
let addressesForDb = JSON.parse(rawdata);

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aadetails VALUES (E'" + value.address + "', E'" + value.location_notes + "', E'" + value.wheelchair_accesible + "', E'" + value.day + "', E'" + value.start_time + "', E'" + value.end_time + "', E'" + value.type + "');";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 

//E'" + value.details + "', E'" + value.building + "', E'" + value.title + "',