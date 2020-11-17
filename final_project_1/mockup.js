//retrieve all items from database and add to an array

//look at item in meeting list
//if it's not in the group array add it to the group array
//if it is in the group array, append new meeting day/time to group item


//if address, details, building, title, location notes, and wheelchair accessible are the same, then they belong in the same group
var groupList = [
     {
      "address":"20 Cardinal Hayes Place",
      "details":"@Duane and Centre behind Federal courthouse enter thru driveway behind Church No meetings on Holidays",
      "building":"St Andrews Church",
      "title":"A DESIGN FOR LIVING -",
      "location_notes":" Rectory Basement, (Between Duane and Pearl Streets), 10007",
      "wheelchair_accesible":"False",
      "day_time_type": [
            {
              "day":"Thursdays",
              "start_time":"7:00 AM",
              "end_time":"8:00 AM",
              "type":"Meeting Type OD = Open Discussion meeting "
             },
             {
              "day":"Thursdays",
              "start_time":"7:00 AM",
              "end_time":"8:00 AM",
              "type":"Meeting Type B = Beginners meeting "
             },
          ],
      "newAddress":"20 CARDINAL HAYES PL New York NY ",
      "latitude":"40.7132597018695",
      "longitude":"-74.0023994478748"
  },
  {
      "address":"20 Cardinal Hayes Place",
      "details":"No meetings on Holidays. **LOCATION SUBJECT TO CHANGE- Call Inter-Group",
      "building":"St. Andrew's Church",
      "title":"CHAMBERS STREET - A BRIDGE BACK - Chambers Street - A Bridge Back",
      "location_notes":" Enter through driveway behind Church., (1 Block North of Chambers Street) NY 10007",
      "wheelchair_accesible":"False",
      "day_time_type": [
            {
              "day":"Mondays",
              "start_time":"12:15 PM",
              "end_time":"1:15 PM",
              "type":"Meeting Type OD = Open Discussion meeting "
             }
          ],
      "newAddress":"20 CARDINAL HAYES PL New York NY ",
      "latitude":"40.7132597018695",
      "longitude":"-74.0023994478748"
  }
];

generateElements(groupList);
  
  //generate html elements
function generateElements(data) {
  //loop through data
  data.forEach(record => {

    //ALTERNATIVE (SAFER) WAY OF CREATING ELEMENTS
    let groupCard = document.createElement("div")
    groupCard.classList.add("group-card")
  
    let recordBuilding = document.createElement("h4")
    recordBuilding.innerHTML = record.building;
    groupCard.appendChild(recordBuilding)
  
    let recordTitle = document.createElement("h4")
    recordTitle.innerHTML = record.title;
    groupCard.appendChild(recordTitle)

    let locationNotes = document.createElement("div")
    locationNotes.innerHTML = record.location_notes;
    groupCard.appendChild(locationNotes)

    record.day_time_type.forEach(meeting => {
      let day_time = document.createElement("div")
      day_time.innerHTML = meeting.day + " from " + meeting.start_time + " to " + meeting.end_time
      groupCard.appendChild(day_time)
    })
    
    //add the element to our content container
    document.getElementById("content").appendChild(groupCard);
    // document.getElementById("content").innerHTML += div;

  });
}

var days = [];
groupList.forEach(meeting => {
  meeting['day_time_type'].forEach(record => {
    days.push(record.day)
  })
})

const checkboxValues = Array.from(new Set(days));
console.log(checkboxValues)

var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings FROM aadatall GROUP BY lat, lon;`;

//// SQL query
//modify this query for my usecase and then I'll have the data in the format I want it  
// var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings FROM aadatall WHERE day = ` + dayy + 'and shour >= ' + hourr + `GROUP BY lat, lon;`;
//it will return a lat long and for each lat long object we'll have a list of meetings within that lat long

//after that I can start working on prototyping the other two projects