# Weekly Assignment 6
Both parts of this assignment had to do with retrieving filtered rows from two different databases, one SQL and one NoSQL.

### Part One
In the first part of this week's assignment, we had to write and execute an SQL query for our aa data in order to filter it by parameters that the future users will likely use to search. Because my data only has three fields so far: ```address, latitude, and longitude,``` the most reasonable parameter is address. Maybe they know a specific location and only want to see meetings at that location. I doubt they would search by latitude and longitude, so I left that out. To access the database and table I used the same credentials from week 4. Then I used the SQL ```LIKE``` operator to find any address that started with ```252```. This returned 12 rows of meetings at 252 W 46th St (this was the only address that started with 252, and is repeated 12 times). I imagine when I have more columns, I will filter by parameters such as time, day, and meeting type.

```javascript
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
```
### Part Two
For the next part of the assignment we had to perform a similar task, but this time with our diary entries from our personal blog we started last week. Mine is an exercise log, so I decided to filter my data by mode (in this case roller skating) and date (within the last week). I needed to use name subsitution for the word ```mode``` since that is a reserved word in DynamoDB. In order to avoid having to do the same for the ```date``` field, I just renamed it ```timedate``` in my table. When filtering (like when creating items in DynamoDB) it's necessary to change numbers to strings, even if they are a number type. This was the case for date as well, which is why I used the ```toString()``` method on ```minDate``` and ```maxDate```. I used the ```valueOf()``` method because I altered my week 5 code to store the timedate as the number of milliseconds since 1970. This will make it easier to sort by date in the future. My result returned two items, which were correct.

```javascript
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
```