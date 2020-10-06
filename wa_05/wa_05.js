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