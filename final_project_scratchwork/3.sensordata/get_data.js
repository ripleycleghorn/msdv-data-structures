const fs = require('fs');
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

// Sample SQL statements for checking your work: 
// var thisQuery = "SELECT * FROM sensorData;"; // print all values
var thisQuery = 
                    `SELECT * FROM sensorData 
                    WHERE (sensortime >= CURRENT_DATE - 30 
                    AND sensorvalue > 60 
                    AND sensorvalue < 80);`;

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        // console.table(res.rows);
        fs.writeFileSync('data.json', JSON.stringify(res.rows));
        client.end();
    }
});
