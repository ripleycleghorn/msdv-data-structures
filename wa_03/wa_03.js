"use strict"

// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';

// geocode addresses
var newObj = [];
let meetingsData = [];
let rawdata = fs.readFileSync('../wa_02/data/addresses.txt');
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
        // console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
        meetingsData.push(tamuGeo);
    });
    
    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    
    meetingsData.forEach(item => {
        newObj.push({
                    "newaddress": item.InputAddress.StreetAddress, 
                    "latLong": {
                        "lat": item.OutputGeocodes[0].OutputGeocode.Latitude,
                        "long": item.OutputGeocodes[0].OutputGeocode.Longitude
                }});
    });
    
    fs.writeFileSync('data/api_data.json', JSON.stringify(meetingsData));
    fs.writeFileSync('data/selected_data.json', JSON.stringify(newObj));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ', meetingsData.length);
    console.log('Number of meetings saved is: ', newObj.length);
});
