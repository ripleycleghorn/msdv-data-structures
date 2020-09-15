var fs = require('fs');
var content = fs.readFileSync('../wa_01/data/04.txt') + '';

var addressesLong = content.split("<\/b><br \/>", 54);

var addressesShort = [];

addressesLong.forEach(item => {
    var address = '';
    address = item.substring(0, item.indexOf(','));
    address = address.trim();
    addressesShort.push(address);
});

addressesShort = addressesShort.slice(1);
addressesShort[13] = addressesShort[13].slice(0,16);
addressesShort[13] = addressesShort[13].replace("St", "Street");
addressesShort[30] = addressesShort[30].replace("W.", "West");
addressesShort[30] = addressesShort[30].replace("St.", "Street");
addressesShort[48] = addressesShort[48].slice(0,19);


addressesShort.forEach(item => {
    fs.appendFile('data/addresses.csv', "'" + item + "'" + ",", (err) => { 
      
    if (err) throw err; 
});
});


