
var fs = require('fs');
var content = fs.readFileSync('data.json');

generateElements(content);
  
  //generate html elements
function generateElements(data) {
  //loop through data
  data.forEach(record => {

    //ALTERNATIVE (SAFER) WAY OF CREATING ELEMENTS
    let groupCard = document.createElement("div");
    groupCard.classList.add("group-card");
  
    let recordBuilding = document.createElement("h4");
    recordBuilding.innerHTML = record.building;
    groupCard.appendChild(recordBuilding);
  
    let recordTitle = document.createElement("h4");
    recordTitle.innerHTML = record.title;
    groupCard.appendChild(recordTitle);

    let locationNotes = document.createElement("div");
    locationNotes.innerHTML = record.location_notes;
    groupCard.appendChild(locationNotes);

    record.day_time_type.forEach(meeting => {
      let day_time = document.createElement("div");
      day_time.innerHTML = meeting.day + " from " + meeting.start_time + " to " + meeting.end_time;
      groupCard.appendChild(day_time);
    });
    
    //add the element to our content container
    document.getElementById("content").appendChild(groupCard);
    // document.getElementById("content").innerHTML += div;

  });
}

var days = [];
content.forEach(meeting => {
  meeting['day_time_type'].forEach(record => {
    days.push(record.day);
  });
});

const checkboxValues = Array.from(new Set(days));
console.log(checkboxValues);

// var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings FROM aadatall GROUP BY lat, lon;`;

//// SQL query
//modify this query for my usecase and then I'll have the data in the format I want it  
// var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings FROM aadatall WHERE day = ` + dayy + 'and shour >= ' + hourr + `GROUP BY lat, lon;`;
//it will return a lat long and for each lat long object we'll have a list of meetings within that lat long

//after that I can start working on prototyping the other two projects