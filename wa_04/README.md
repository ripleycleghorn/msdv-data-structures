# Weekly Assignment 4

This week's objective was to take the data we obtained last week (a latitude and longitude for each address) and insert it into a relational database.

## Part One: Sketch a data model

First, the task was to sketch a data model for what our final database should look like. For now, I decided on a normalized data structure. This means that I will need to assign a foreign key to each address in my database. Even though some addresses repeat, I will ignore that, and have 53 meeting keys in total. The reason for this is because even though the addresses repeat, the content they represent (meeting days and times, types of meetings, etc) are very different so I think it's necessary to keep them as they are and not reduce them.

Apart from a table with an address and a meeting key, I will have a table for meeting time and days, which will use the meeting key defined in the first table. The granularity of this table will be one row per day/time combination. Since there are usually multiple days/times listed for a single meeting key, they will inevitably repeat in this table. So the relation from the first table to the second will be one to many. It will also include a field for "special interest" which is listed at the same level of granularity. However this field is not filled out for each day/time combination, so it will not be a required field.

The third and final table will be for additional details. The additional details are not listed for every meeting, so this table will only be partially filled. Each meeting key should be listed no more than once, since the level of granularity will be the meeting key. This table will include include fields such as "Nickname" (i.e. 46th Street Clubhouse), room number, floor number, and others. The relation between this table and the first one will be some to many.

## Part Two: Create a table

Now it's time to actually create the database. The starter code gave us two SQL sample statements: one to create a table and one to delete a table. Our task was to replace the credentials with our own and give it a try. This code was saved in the file ```wa_04a.js```.

```javascript
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

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
```

## Part Three: Populate the table

Next we had to populate our database. Modifying the starter code, I read the data from my json file from last week (whose structure is a list of objects, each with their own address, latitude and longitude). 

```javascript
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

let rawdata = fs.readFileSync('../wa_03/data/selected_data.json');
let addressesForDb = JSON.parse(rawdata);

// var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];
```

Then, using the ```async``` module, I inserted a row into the table ```aalocations``` for each object in my array. This code and the previous code was saved to the file ```wa_04b.js```.

```javascript
async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.newaddress + "', " + value.latLong.lat + ", " + value.latLong.long + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
});
```

## Part Four: Check the data

The last script for this week's assignment allowed us to see what rows had been inserted into our table, and make sure they were all there. After repeating the same credentials as the first two scripts, I used a ```SELECT``` query to see the rows. Luckily, all 53 were there. I saved this query to ```wa_04c.js```.

```javascript
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
var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});
```