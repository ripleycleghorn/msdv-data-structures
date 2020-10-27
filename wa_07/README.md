# Weekly Assignment 7

Overall workflow:

1. `wa_07a` reads the text files from the text files folder (which we downloaded in week one), parses it for necessary info, and writes flattened json to data folder
2. `wa_03` reads flattened json, gets geolocation data using the TAMU API, appends new address/lat/long to that json and rewrites the file
3. `wa_07b` creates one sql table with all fields
4. `wa_0c` reads json from step 2 and inserts into sql database
5. `wa_07d` counts number of rows in the database


## Part One: wa_07a
For part a) of this assignment, I looped over each text file and parse them for all the information I will need for the application. For each group of meetings I will have: 

```
"address": address, 
"details": detailsBox,
"building": building,
"title": title, 
"location_notes": locationNotes, 
"wheelchair_accesible": wheelchairAccesible, 
"day": item.day,
"start_time": item.start_time,
"end_time": item.end_time,
"type": item.type
```
I did this by creating many lists inside of lists. For `bigList` I split the file into an array where each item is a group of meetings. This means I would have an address and then all of the day/time combinations at that address. From each item in this list, I was able to parse the address, details, building, title, location notes and whether it was wheelchair accessible. Next I created another loop based on the list `allMeetingsList`, this time splitting on all the day/time combinations within that group of meetings. For each of these items, I parsed out the day, start time, end time, and type. Therefore for each of these day/time combinations, I pushed the day/time/type as well as all the previous fields I mentioned. This means that I would end up with a final list where for each meeting, all the previous items could repeat (address, details, etc), but they're day/time combination would be different.

For the scripts below, I will attach all the ones I used for the first text file as an example.

```javascript
//in files 02 03, and 04 there were incorrect meetings where day was 's' and time was 12:00am to 12:00am which I deleted directly from the text files
var fs = require('fs');
var file = '../../wa_01/data/01.txt';
var content = fs.readFileSync(file) + '';
var bigList = content
    .replace(/(\r|\n|\t)/gm, "")
    .split('<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">');

var smallList = [];

bigList.forEach((item, index) => {
    if(index !== 0){
        
        var address  = item
            .split('</b><br />')[1]
            .split(',')[0]
            .split('-')[0]
            .split('(')[0]
            .split('@')[0]
            .split('&')[0]
            .split('Rm')[0]
            .trim();
        
        var building = item.split("<br />")[0].split("</h4>")[0].split(">")[1];
        var title = item.split("<br />")[1].split("</b>")[0].replace(/<b>/g, "").trim();
        var locationNotes = item.split("<div class=\"detailsBox\"> ")[0].split("<br /><br />")[0].split(",");
        locationNotes.shift();
        locationNotes = locationNotes.join(',')
            .replace(/<br \/>/g, '') // clean up text file 01
            .replace(/<\/b>/g, '') // clean up text file 02
            .replace(/<\/h4>      <b>/g, ''); // clean up text file 03
        
        var details = item.includes("detailsBox");
        var wheelchairAccesible = (item.split('</b><br />')[1].includes("alt=\"Wheelchair Access\"")) ? "True" : "False"; 
        var detailsBox = (details) ? item.split("<div class=\"detailsBox\">")[1].split("</div>")[0].trim() : ""; 
        detailsBox = detailsBox.replace(/<br \/>/g, '');
        
        //now I can split allMeetings in different ways to get the type of info I need
        //item = one block of meetings, grouped by location
        var allMeetingsList = item
            .split('<td style="border-bottom:1px solid #e3e3e3;width:350px;" valign="top">')[1]
            .replace(/\s+/g,' ')
            .trim()
            .split('<br /> <br />');

        allMeetingsList.pop();
        
        var daytimeList = [];
        //item = one day/time combination
        allMeetingsList.forEach(item => {
            //length three means there are two breaks and therefore a special interest category
            var lengthThree = item.split('From')[1].split('<br /><b>').length == 3;
            var specialInterest = (lengthThree) ? item.split('Interest')[1].replace(/<\/b>/g, "").trim() : "";
            var day = item.split('From')[0].replace("<b>", "").trim();
            var times = item.split('From')[1].split('<br /><b>')[0].replace("</b>", "").replace("<b>to</b>", "to").split("to");
            var startTime = times[0].trim();
            var endTime = times[1].trim();
            var type = item.split('From')[1].split('<br /><b>')[1];
            //in files 07 and 08 there were meetings where type was undefined, but still valid meetings so I should include them
            type = (item.split('From')[1].split('<br /><b>')[1] == undefined) ? "" : type.replace("</b>", "");
            daytimeList.push({"day": day, "start_time": startTime, "end_time": endTime, "type": type, "specialInterest": specialInterest});
        });
        //repeat meeting details, location, etc. for each day/time combination at that location
        daytimeList.forEach(item => {
             smallList.push({
                "address": address, 
                "details": detailsBox,
                "building": building,
                "title": title, 
                "location_notes": locationNotes, 
                "wheelchair_accesible": wheelchairAccesible, 
                "day": item.day,
                "start_time": item.start_time,
                "end_time": item.end_time,
                "type": item.type
             });
        });
    }
});

const data = JSON.stringify(smallList);

fs.writeFile('../data/' + file.substring(17,19) + '.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
```
## Part Two: wa_03

Before moving on to create the tables, I first had to use week three's assignment to get the geolocation for each address and append it to the json I created in part one. I had to modify that week's code so that instead of writing a new json with just the address, latitude and longitude, I read in the original json from part one and added it to the current value and then pushed the value to the json.

```javascript
"use strict"

// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

// TAMU api key
dotenv.config({path: '/home/ec2-user/environment/.env'});
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';

// geocode addresses
// var newObj = [];
let meetingsData = [];
let rawdata = fs.readFileSync('../wa_07/data/01.json');
let addresses = JSON.parse(rawdata);

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value["address"],
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
        value.newAddress = tamuGeo.InputAddress.StreetAddress;
        value.latitude = tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude;
        value.longitude = tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude;
        meetingsData.push(value);
    });
    
    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    //rewrite the json file with added geolocation details
    fs.writeFileSync('../wa_07/data/01.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ', meetingsData.length);
});
```

## Part Three: wa_07b

In this part I created a table for all the meetings and their details. In this table, addresses could repeat but rows would be unique, since each address could have multiple unique day/time combinations.

```javascript
//in this file I will create the details table in PostGres

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

//for now I'm leaving them all as strings to test it out
var thisQuery = "CREATE TABLE aadetails (address varchar(100), location_notes varchar(200), wheelchair_accesible varchar(100), day varchar(100), start_time varchar(100), end_time varchar(100), type varchar(100));";

// details varchar(200), building varchar(200), title varchar(200),

// var thisQuery = "DROP TABLE aadetails;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
```
## Part Four: wa_07c

Now that I created the table I had to insert my data. Because I was having an error from not escaping the apostrophes I used a handy library called `pg-escape`. I read in the updated json from the previous part.

```javascript
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

let rawdata = fs.readFileSync('../data/01.json');
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
```

## Part Four

Finally, after inserting my data I wrote a script to see all of the rows in the table.

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
var thisQuery = "SELECT * FROM aadetails;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});
```
