# Weekly Assignment 1

## Step 1

For this assignment our job was: 
Using Node.js (in Cloud 9), make a request for each of the ten "Meeting List Agenda" pages for Manhattan.

First, I created my global variables:

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
    
## Step 2

Next, I used a forEach to loop over each item (which I call 'page' below) in the array I created above. I created a variable called 'startPath' so I can reuse it to save a file with the data each time (to the same path). When writing the file I concatinated the startPath with the part of the url that contained the page number, and added the extension at the end. This way, each filename was unique and easily identifiable.

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