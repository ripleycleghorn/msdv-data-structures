# Weekly Assignment 2
The assignment this week was to parse one of the AA text files that we scraped last week. Specifically, we needed to identify the address for each meeting, and store it in a newline within a document (could be text, JSON, etc.). Which text file we parsed dependeded on our school ID, and in my case it was the fourth page. One question we were given was: "why are we reading this from a saved text file instead of making another http request?" One idea I had was that we would be running our code a lot in order to test our script, and we didn't want to overload the server with requests (especially with multiple people making the same requests).

## Step 1: Setup
The first step was to install the appropriate requirements and load the contents of the text file into a variable, called 'content'. In my case I needed to work with the whole text file as if it were one string, so I added '' on the end to be able to do so.

`var fs = require('fs');
var content = fs.readFileSync('../wa_01/data/04.txt') + '';
`

## Step 2: Isolate relvant text
Next, I needed to look within the structure of the HTML content to identify where the address for each meeting was stored. First, I counted how many times "Get Directions" appeared, beceause I knew that text accompanied each address. This happened 53 times, so that was the number I compared against everytime I checked the results. The HTML structure was fairly messy, as seen below:

    `<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
    	<h4 style="margin:0;padding:0;">46th Street Club House</h4><br />
  	    <b>4 THE GRACE - </b><br />
		252 West 46th Street, 3rd Floor, 
		<br />(Betw Broadway & 8th Avenue) 10036
		<br />
		<br />
    </td>`

The first issue I saw was that the address wasn't within any specific element, it was just within the `<td>`. My first attempt was to use to use the package 'Cheerio' in order to isolate certain blocks of code by their tags and/or class. Even though I didn't have a specific element to target for the address, I could target all the `<td>` elements and start there. This proved difficult as well, because there were 163 `<td>` tags, and I only needed 53 of them. I noticed that all the `<td>` tags that contained addresses also contained certain CSS attributes that only appeared 53 times, so I tried to see if it was possible to search for all tags with a certain style using Cheerio. Sadly, I couldn't find a way to do that, so I needed to switch up my strategy.     
                    
## Step 3: Iterate over addresses
After giving RegEx a decent attempt, I was given the suggestion of using the String split() method. What was useful was that I could control how many times it was split, so that it didn't perform it unnecessarily. I split the string after every `</b><br />`, since this preceeded every address (I had to escape the slashes with a `\`). 

    var addressesLong = content.split("<\/b><br \/>", 53);
## Step 4: Clean data
This returned an array of 53 items, where each item was a rather large block of text. The positive side was that every item started with the address, so all I needed to do was chop off the proceeding text. This was fairly easy to do given that every item followed the pattern of "address" + ",". So I used a method the substring() to delete the characters following the first commma for every item. I also trimmed any white space that came before or after the address.

    addressesLong.forEach(item => {
        var address = '';
        address = item.substring(0, item.indexOf(','));
        address = address.trim();
        addressesShort.push(address);
    });

Here I noticed that the first item wasn't actually an address, and was therefore cutting off the last item. I fixed this by splitting the string 54 times, and then removing the last item.

    var addressesLong = content.split("<\/b><br \/>", 54);
    addressesShort = addressesShort.slice(1);

There were a few addresses with abbreviations and extra text, which I also fixed by using the methods slice() and replace(). 

    addressesShort[13] = addressesShort[13].slice(0,16);
    addressesShort[13] = addressesShort[13].replace("St", "Street");
    addressesShort[30] = addressesShort[30].replace("W.", "West");
    addressesShort[30] = addressesShort[30].replace("St.", "Street");
    addressesShort[48] = addressesShort[48].slice(0,19);

## Step 5: Save data
Originally, when checking each item in the array, I saved them to a text file and added a new line, so they were easy to read. Once I saw that everything was correct (and that there were no commas in the entries), I replaced the new lines for commas and saved it as a csv.

    addressesShort.forEach(item => {
        fs.appendFile('data/addresses.txt', "'" + item + "'" + ",", (err) => { 
          
        if (err) throw err; 
    });
    });