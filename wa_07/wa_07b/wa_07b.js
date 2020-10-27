//in this file I will create the second table in PostGres

// Create a table in the database
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/.env'});  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'rcleghorn';
db_credentials.host = 'ds-20.cbk4m9wel0if.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

//create table with all meeting details
var thisQuery = "CREATE TABLE aadetails (ID serial primary key, address varchar(100), latitude varchar(100), longitude varchar(100), details varchar(200), building varchar(200), title varchar(200), location_notes varchar(200), wheelchair_accesible varchar(100), day varchar(100), start_time varchar(100), end_time varchar(100), type varchar(100));";

// var thisQuery = "DROP TABLE aadetails;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});