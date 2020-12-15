// npm install aws-sdk
const fs = require('fs');
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
        ":minDate": {N: new Date("October 2, 2020").valueOf().toString()},
        ":maxDate": {N: new Date("November 25, 2020").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        fs.writeFileSync('data.json', JSON.stringify(data.Items));
    }
});