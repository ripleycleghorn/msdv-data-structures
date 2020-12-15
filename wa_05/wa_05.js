var async = require('async');
var blogEntries = [];

class BlogEntry {
  constructor(date, entry, duration, mode, distance) {
    this.timedate = {};
    this.timedate.N = new Date(date).valueOf().toString();
    this.entry = {};
    this.entry.S = entry;
    this.duration = {};
    this.duration.N = duration.toString();
    this.mode = {};
    this.mode.S = mode;
    if (distance != null) {
      this.distance = {};
      this.distance.N = distance.toString();
    }
  }
}
blogEntries.push(new BlogEntry('September 1, 2020 17:30', "test", 20, "biking", 2.6));
blogEntries.push(new BlogEntry('October 2, 2020 17:30', "Biked to the park", 20, "biking", 2.6));
blogEntries.push(new BlogEntry('October 2, 2020 19:00', "Did yoga at home", 30, "yoga"));
blogEntries.push(new BlogEntry('October 3, 2020 9:45', "Went hiking to the same trail as last weekend", 120, "hiking", 7.5));
blogEntries.push(new BlogEntry('October 5, 2020 18:00', "Biked to the store to buy new roller skates", 50, "biking", 8));
blogEntries.push(new BlogEntry('October 8, 2020 21:00', "Went roller skating nearby", 20, "roller skating"));
blogEntries.push(new BlogEntry('October 12, 2020 18:15', "Went to the new place to practice roller skating", 20, "roller skating"));
blogEntries.push(new BlogEntry('October 13, 2020 18:30', "Went to the new place to practice roller skating", 20, "roller skating"));
blogEntries.push(new BlogEntry('October 14, 2020 19:00', "Went to the new place to practice roller skating", 20, "roller skating"));
blogEntries.push(new BlogEntry('October 16, 2020 17:30', "Went to the new place to practice roller skating", 20, "roller skating"));
blogEntries.push(new BlogEntry('October 24, 2020 11:30', "Biked to Parque Bicentinario", 60, "biking", 7));
blogEntries.push(new BlogEntry('October 24, 2020 12:30', "Roller skated at Parque Bicentinario", 30, "roller skating"));
blogEntries.push(new BlogEntry('October 29, 2020 16:30', "Biked to Parque Araucano", 15, "biking", 2));
blogEntries.push(new BlogEntry('October 29, 2020 17:00', "Roller skated at Parque Araucano", 30, "roller skating"));
blogEntries.push(new BlogEntry('November 2, 2020 17:30', "Roller skated up Presidente Riesco", 75, "roller skating"));
blogEntries.push(new BlogEntry('November 6, 2020 14:30', "Roller skated at the skate park", 45, "roller skating"));
blogEntries.push(new BlogEntry('November 8, 2020 19:00', "Did yoga at home", 30, "yoga"));
blogEntries.push(new BlogEntry('November 9, 2020 17:30', "Biked to Los Dominicos", 30, "biking", 5));
blogEntries.push(new BlogEntry('November 12, 2020 14:30', "Roller skated at Los Dominicos", 30, "roller skating"));
blogEntries.push(new BlogEntry('November 13, 2020 18:30', "Biked in Viña", 30, "biking", 2));
blogEntries.push(new BlogEntry('November 15, 2020 10:30', "Biked in Viña", 60, "biking", 6));
blogEntries.push(new BlogEntry('November 16, 2020 17:30', "Biked to Los Dominicos", 30, "biking", 5));
blogEntries.push(new BlogEntry('November 19, 2020 14:30', "Roller skated at Los Dominicos", 30, "roller skating"));
blogEntries.push(new BlogEntry('November 25, 2020 17:00', "Biked to Vivero Las Hualtatas", 45, "biking"));
blogEntries.push(new BlogEntry('December 5, 2020 13:00', "Biked to De La Ostia and then Barrio Italia", 120, "biking"));
blogEntries.push(new BlogEntry('December 7, 2020 16:00', "Yoga with Jorge", 20, "yoga"));
blogEntries.push(new BlogEntry('December 10, 2020 10:00', "Recorded 15 minutes of yoga at the park before going low", 15, "yoga"));



console.log(blogEntries);

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {};

async.eachSeries(blogEntries, function(value, callback) {
    //add blog entry to the object params
    params.Item = value; 
    params.TableName = "process-blog2";
    //add object params to the database
    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    setTimeout(callback, 1000); 
}); 