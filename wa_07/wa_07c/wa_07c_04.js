//in this file I will insert them all into the sql table

//Populate database
const { Client } = require('pg');
var async = require('async');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'}); 
var escape = require('pg-escape');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'rcleghorn';
db_credentials.host = 'ds-20.cbk4m9wel0if.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

let rawdata = fs.readFileSync('../data/04.json');
let detailsForDb = JSON.parse(rawdata);

async.eachSeries(detailsForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = escape("INSERT INTO aadetails VALUES (DEFAULT, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L)",
    value.address,
    value.latitude,
    value.longitude,
    value.details,
    value.building,
    value.title,
    value.location_notes,
    value.wheelchair_accesible,
    value.day,
    value.start_time,
    value.end_time,
    value.type);
    
    //"INSERT INTO aadetails VALUES (E'" + ) + "', E'" +  + "', E'" + value.day + "', E'" + value.start_time + "', E'" + value.end_time + "', E'" + value.type + "');";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 

