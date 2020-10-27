//in files 02 03, and 04 there were incorrect meetings where day was 's' and time was 12:00am to 12:00am which I deleted directly from the text files
var fs = require('fs');
var file = '../text_files/10.txt';
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

fs.writeFile('../data/' + file.substring(14,16) + '.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
