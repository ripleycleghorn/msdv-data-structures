//PART ONE
const { Client } = require('pg');
const cTable = require('console.table');
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

// Sample SQL statement to query meetings whose address begins with 252: 
var thisQuery = "SELECT address, lat, long FROM aalocations WHERE address LIKE '252%';";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});

//PART TWO
// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "process-blog2",
    KeyConditionExpression: "#md = :thismode and timedate between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#md" : "mode"
    },
    ExpressionAttributeValues: { // the query values
        ":thismode": {S: "roller skating"},
        ":minDate": {N: new Date("October 6, 2020").valueOf().toString()},
        ":maxDate": {N: new Date("October 13, 2020").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});