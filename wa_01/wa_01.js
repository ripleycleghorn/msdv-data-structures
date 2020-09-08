// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

var pagesList = ['https://parsons.nyc/aa/m01.html',  
    'https://parsons.nyc/aa/m02.html',
    'https://parsons.nyc/aa/m03.html',
    'https://parsons.nyc/aa/m04.html',
    'https://parsons.nyc/aa/m05.html',
    'https://parsons.nyc/aa/m06.html',
    'https://parsons.nyc/aa/m07.html',
    'https://parsons.nyc/aa/m08.html',
    'https://parsons.nyc/aa/m09.html',
    'https://parsons.nyc/aa/m10.html'];

var startPath = '/home/ec2-user/environment/wa_01/data/';

pagesList.forEach(page => {
   request(page, function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync(startPath.concat(page.substring(24,26),'.txt'), body);
        console.log('Success', page.substring(24,26));
    }
    else {
        console.log("Request failed!");
    }
    }); 
    
});




