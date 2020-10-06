# Weekly Assignment 5

This week's assignment had us create the datasource for what will be Final Assignment 2. Our task was to come up with database that would hold blog entries (of whatever content we choose). For that we had to think of what kind of variables we would include in our dataset.

### Part One: Draw a data model

For the first part, we had to draw an initial data model for the structure of our database. I included 5 variables in my dataset: ```date, duration, entry, mode, and distance```. ```Date``` is in the date/time format and serves as my primary key. ```Duration``` and ```distance``` are numbers, and ```entry``` is a string. ```Mode``` is an array of strings, since I can have multiple exercise modes in one session. All are required fields except for ```distance``` (which doesn't make sense when doing stationary exercise). This data will be normalized, since I can never be doing two different exercise sessions at the same time.

![Image of Data Model](/Users/ripleycleghorn/Desktop/Masters/Data Structures/msdv-data-structures/wa_05/datamodel.jpg)

### Part Two: Create the data for the database

After outlining the types of data I would store in the database, I had to create my first few entries. I did this by creating the class ```BlogEntry``` and passing it the properties: ```date, entry, duration, mode, and distance```. I pushed four new entries to my ```blogEntries```. Finally I printed my entries to the console to make sure they were created correctly.

```javascript
var async = require('async');
var blogEntries = [];

class BlogEntry {
  constructor(date, entry, duration, mode, distance) {
    this.pk = {};
    this.pk.S = new Date(date).toString();
    this.entry = {};
    this.entry.S = entry;
    this.duration = {};
    this.duration.N = duration;
    this.mode = {};
    this.mode.SS = mode;
    if (distance != null) {
      this.distance = {};
      this.distance.N = distance;
    }
  }
}

blogEntries.push(new BlogEntry('October 2, 2020 17:30', "Biked to the park", "20", ["biking"], "2.6"));
blogEntries.push(new BlogEntry('October 2, 2020 19:00', "Did yoga at home", "30", ["yoga"]));
blogEntries.push(new BlogEntry('October 3, 2020 9:45', "Went hiking to the same trail as last weekend", "120", ["hiking"], "7.5"));
blogEntries.push(new BlogEntry('October 5, 2020 18:00', "Biked to the store to buy new roller skates", "50", ["biking"], "8"));

console.log(blogEntries);
```

### Part Three: Populate the database

Finally, once I made sure my entries were printed correctly, I added them to my database. I used the ```async``` function with the ```eachSeries``` method to loop over the four items in my ```blogEntries``` list and add them to the object ```params```. I set the tablename, ```processblog```, as the same one I defined in my database, and then used the ```putItem``` method from the ```dynamodb``` function to insert them. Finally, I set a timeout to wait 2 seconds before each insertion.

```javascript
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {};

async.eachSeries(blogEntries, function(value, callback) {
    //add blog entry to the object params
    params.Item = value; 
    params.TableName = "processblog";
    //add object params to the database
    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    setTimeout(callback, 1000); 
}); 
```
