# Weekly Assignment 7
(This assignment is not complete, but I'm uploading what I have so far)

## Part One
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

We were cautioned against using the same script for all 10 files, but I found it easier than I expected. What I have yet to finish, though, is accurately parsing the addresses so that they exactly match the addresses in my other table (with the geolocations). Right now, the script doesn't account for that.

```javascript
//in files 02 03, and 04 there were incorrect meetings where day was 's' and time was 12:00am to 12:00am which I deleted directly from the text files

var fs = require('fs');
var textFiles = ['../wa_01/data/01.txt',
                '../wa_01/data/02.txt',
                '../wa_01/data/03.txt',
                '../wa_01/data/04.txt',
                '../wa_01/data/05.txt',
                '../wa_01/data/06.txt',
                '../wa_01/data/07.txt',
                '../wa_01/data/08.txt',
                '../wa_01/data/09.txt',
                '../wa_01/data/10.txt'];

textFiles.forEach(item => {
    var content = fs.readFileSync(item) + '';
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
                .replace(' Rm 306', 'reet')
                .replace('W.', 'West')
                .replace('St.', 'Street')
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
    
    fs.writeFile('data/' + item.substring(14,16) + '.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    
    
});
```
## Part Two

In this part I created a table for all the meetings and their details. In this table, addresses could repeat, whereas in my second table addresses should be unique and include their geolocations. I only got as far as creating and inserting the data for the first table, and haven't finished parsing the addresses with their geolocations for the second table.

Also, for now I had to leave out details, building, and title because my script doesn't escape the `'` properly and was throwing errors. I will add these fields later.

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
## Part Three
Now that I created the table I had to insert my data. Eventually I will put this inside a loop and go through each json file to insert, but for now I just tested them one by one. I only managed to successfully test files one and two, because the third had the same error with the apostrophe.

```javascript

//in this file I will insert them all into the details table

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

let rawdata = fs.readFileSync('data/02.json');
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

In conclusion I don't know if any of this makes sense because I've spent too long looking at this but tomorrow I think I'll be able to get farther.