var fs = require('fs');

var textFiles = ['../wa_01/data/01.txt',
                '../wa_01/data/02.txt',
                '../wa_01/data/03.txt',
                '../wa_01/data/04.txt',
                '../wa_01/data/05.txt',
                '../wa_01/data/06.txt',
                '../wa_01/data/07.txt',
                '../wa_01/data/08.txt',
                '../wa_01/data/09.txt',
                '../wa_01/data/10.txt'];


textFiles.forEach((file, index) => {
    var content = fs.readFileSync(file) + '';
    var addressesLong = content.split('</b><br />');
    var object = [];
    
    if (index == 2) {
        addressesLong.forEach(item => {
            var address = item.split(',')[0]
                .split('-')[0]
                //it was written as 206-208
                .replace('206', '206 East 11th Street')
                //didn't include the word street
                .replace('25 East 15th', '25 East 15th Street')
                //
                .trim();
            object.push({"address": address});
        });
        console.log("I'm in the first if!");
    }
    else if (index == 5) {
        addressesLong.forEach(item => {
            var address = item.split(',')[0]
                .split('-')[0]
                .split('. Meeting')[0]
                //address of the church instead of the intersection
                .replace('Central Park West & 76th Street', '160 Central Park West')
                .trim();
            object.push({"address": address});
        });
        console.log("I'm in the second if!");
    }
    else if (index == 6){
        addressesLong.forEach(item => {
            var address = item.split(',')[0]
                .split('-')[0]
                .split('(')[0]
                .split('@')[0]
                .split('&')[0]
                .split('Rm')[0]
                //replace with address in details
                .replace('Church of the Good Shepard', '543 Main St')
                .trim();
            object.push({"address": address});
        });
         console.log("I'm in the third if!");
    }
   else  if (index == 7) {
        addressesLong.forEach(item => {
            var address = item.split(',')[0]
                .split('-')[0]
                //only use for text file 8, because it was written as 58-66
                .replace('58', '58 West 135th Street')
                .trim();
            object.push({"address": address});
        });
         console.log("I'm in the fourth if!");
    }
   else {
        addressesLong.forEach(item => {
            var address = item.split(',')[0]
                .split('-')[0]
                .split('(')[0]
                .split('@')[0]
                .split('&')[0]
                .split('Rm')[0]
                .trim();
            object.push({"address": address});
        });
         console.log("I'm in the last if!");
    }
            
    object = object.slice(1);
    
    const data = JSON.stringify(object);
    
    fs.writeFile('data/' + file.substring(14,16)+ '.txt', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });  

});







