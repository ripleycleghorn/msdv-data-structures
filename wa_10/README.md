# Weekly Assignment 10
For this week, we needed to design the interface for all three of our final projects.

## Final Assignment 1

The interface for my AA Meeting List will consist of a map, a list, a search bar, and a filter section. The main idea is that on the lefthand side there will be scrollable list with all the meeting groups, similar to how they were set up on the original website. Each of these groups can have several meeting time/days within it. A group is defined by its name; therefore one location can have multiple groups and so that location would repeat for each group that is hosted there. I read the AA definition of a group and decided it was necessary to keep that separation rather than grouping all meetings that occur at the same location into one category.

The map will show all the pins, where one pin represents one location. If a user clicks on a pin, the list on the left will update to show all the meeting groups at that location. For each meeting group 'box' all its details will be listed: meeting name, notes, day/time combinations, wheelchair accessible, etc. At the same time, all the other pins on the map will disappear, so that it's clear that the meeting list is reflecting only one location. They can then click reset to see all the pins again.

Alternatively, they can search by meeting name or address. And the map and list section will update to show only those that match. 

Finally, they can also use the filter boxes to show meetings by day, type, and whether it's wheelchair accessible. These filters will affect both the map and the meeting list.

The data will be mapped to the visual elements in the map by address, which will require a restructuring to group by address. The list on the left will need to be tied to the map elements by address. Finally, the filters on the right will be connected to the list section and the map by linking those elements which are filterable.

I'm assuming that people will know how to search by meeting name or address and/or know how to filter and/or be able to find their meeting on a map.

<img src="https://ripleycleghorn.github.io/msdv-data-structures/wa_10/finalassignment1.png" alt="Data interface drawing">

## Final Assignment 2

The visualization I'll choose for my process blog data is a simple heat map based on a calendar. On days when there are records (i.e. I exercised) the color of that day will be darker than on days where there are no records. Depending on the number of activities done that day the color will be darker or lighter. If you hover over a square, you will see the entries listed for that day. Each entry will display all the information on record: `activity`, `duration`, `distance` if applicable, and `notes`.

In order to display this information I will need to group entries by day (not day/time). The minimum amount of data I will need to display the information will be one month of records, since the default view will be an entire month. Although the default view could just as well be a week, in order to achieve an effecitve overview of how often I exercise, I think 30 days is better suited.

<img src="https://ripleycleghorn.github.io/msdv-data-structures/wa_10/finalassignment2.png" alt="Data interface drawing">

## Final Assignment 3

For this project, I'm supposing that someone wants to build a wine cellar in their basement, and therefore they need to know the current temperature range in the basement. After doing preliminary research (i.e. one google search) it seems the ideal temperature for wine is between 50 and 59 degrees farenheit. No harm will be done to wine 59 and 68 degrees as long as the temperature does not fluctuate too dramatically. Hypothetically, this person wants to know if they can build it without implementing any heating or cooling system in the basement, in the case that the temperatures already fall in the correct range. This visualization would need to span at least a year in order to monitor the temperatures throughout the seasons.

In order to see the feasibility of building a wine cellar, I will map the temperatures onto a line graph. There will be a light grey shaded band between 50-59 to show the ideal temperature, and a slightly darker band from 59-68 in order to more easily identify if the temperatures fall in the correct range. Additionally, I will probably need to emphasize somehow when there is a sharp fluctuation in the temperatures.

In terms of the data, it will be pretty straightforward to map the temperatures to a line graph. However in order to emphasize the possible fluctuation I will need to calculate the difference between each temperature and the following day's temperature. I will also need to make sure the date is shown in the correct format on the x-axis

<img src="https://ripleycleghorn.github.io/msdv-data-structures/wa_10/finalassignment3.jpg" alt="Data interface drawing">