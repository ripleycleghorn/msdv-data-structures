// dependencies
const fs = require('fs'),
      async = require('async');
      

let meetingsData = [];
let rawdata = fs.readFileSync('../data/02.json');
let addresses = JSON.parse(rawdata);

//add the hour to the json!!!!

async.eachSeries(addresses, function(value, callback) {
    
    var hour = parseInt(value.start_time.split(':')[0]);
    console.log('outside the loop');
    if(value.start_time.includes('PM') && !value.start_time.includes('12')) {
        console.log('inside the if');
        hour += 12;
    }
    else if(value.start_time.includes('AM') && value.start_time.includes('12')) {
        console.log('inside the else');
        hour += 12;
    }
    value.hour_string = hour.toString();
    // value.day = value.day.substring(0, value.day.length - 1);
    
    if(value.day.includes('Monday')) {
        value.day_number = '1';
    }
    else if(value.day.includes('Tuesday')) {
        value.day_number = '2';
    }
    else if(value.day.includes('Wednesday')) {
        value.day_number = '3';
    }
    else if(value.day.includes('Thursday')) {
        value.day_number = '4';
    }
    else if(value.day.includes('Friday')) {
        value.day_number = '5';
    }
    else if(value.day.includes('Saturday')) {
        value.day_number = '6';
    }
    else if(value.day.includes('Sunday')) {
        value.day_number = '7';
    }
    else {
        value.day_number = '0';
    }
    
    meetingsData.push(value);
    
    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    //rewrite the json file with added geolocation details
    fs.writeFileSync('../data/02.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ', meetingsData.length);
});