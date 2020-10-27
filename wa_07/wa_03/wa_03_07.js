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
let rawdata = fs.readFileSync('../wa_07/data/07.json');
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
    fs.writeFileSync('../wa_07/data/07.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ', meetingsData.length);
});
