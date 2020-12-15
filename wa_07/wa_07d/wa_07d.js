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

// Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aadetails;";
var thisQuery = "SELECT COUNT (id) as count FROM aadetails;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});
//COUNT(*) as count