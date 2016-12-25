/*Notes:
11/18 Added basic HTML: buttons and text box.
Button for random article works!
11/19 Added div for results to populate. Went ahead and moved to Sublime (local). 
The debugging is really confusing on CodePen. Started dabbling with API url
--Add 'enter/return' functionality --wishlist
11/26 Did some messing around with the API call results. Figuring out what I want to display on page. I want the title 
and link and maybe a short desc of result but I can't GET to it. :(
prop=extracts for extract of given pages...?

11/27 I'm thinking I'm going to need to use replace, parse, regex methods to decipher the content returned. :/
I can use page ids (or titles?) from results to build links 'pageids=1234'
Generator - i can use the output of a list, only one generator is allowed -- this would be my search term. (Probably
wouldn't be bad to keep user from using more than term, like |. What else would 'break' it? )

rvprop=content - for the content of the article. Would take some work to use a summary...
https://en.wikipedia.org/w/api.php?action=query&generator=allpages&gaplimit=2&gapfilterredir=nonredirects&gapfrom=Re&prop=revisions&rvprop=content
Removing redirects sounds like a good idea, maybe? No. I think I want to keep them. Maybe annotate them?

Still need to work on pulling out the title and link (it's called Page Links - looks like [[Page]]. prop=links
to the results and populating it onto a page

https://en.wikipedia.org/wiki/Lego.com <-- can i just put the title after wiki/ ??
Title normalization - replace underscores with spaces, change namespaces to localized form defined for wiki. Trailing
line breaks (\n) will need to be stripped out..?
negative pageids = missing/invalid title

Difference between gapfrom - title to start enumerating from -- I guess if I want to limit returned results...?

gapprefix  - searches all page titles that begin with this value

!!!! Warning with using Generator: !!!
No support for special pages has been implemented. Thrown if a title in the Special: or Media: namespace is given.
-- What should I do about this exactly?

formatversion=2 -- should specify this with format as well? I dont see the diff between this and 1.

11/29 Ok. I think I'm good to go with my API request URL. What are my smaller problems to solve?
Variable scope... I need the JSON data to be accessible to my functions for displaying the link and title results.

1. Still need to display results when text is input after button is clicked. !!!
 Parse out 'title' for all key pairs of 'pages'
   Play with static JSON to figure this out. 
  Then display the link (reference line 23 for href).
  /-- Replace all punctuation and spaces to -> linky/
  Replace my practice JSON with real one
  Make results populate when 'search' is clicked
  Use search box input to make API call url 

1.a Format search text to work for generator - convert spaces, punctuation, etc before making the call.

2. Next, display 'x' or trash icon for when user inputs text. Clicking it sets value of box to "". Box disappears when 
text field = "".

3. Add styling to ugly page.
 - have input box expand when clicked on

Got the practiceJson to work and display results.

11/30
Working on the link to generate.
Generic link now shows. 
Build title-specific link. With _blank target.
(Normalize link (replace spaces and punctuation, remove /n) - Replace function? Unnecessary?)

The page now takes its JSON from Wikipedia :D . 
Button retrieves json.
Button now uses user text to make API call. !! :D
Clearing out 'test' at beginning of function now to reset previous search results. Done.

Issue: more than one word in text box throws the call, punctuation

12/2 Why does 'return' not cause search button to click? The input button and text have to be in a form together. 
Changed type to 'submit' from 'button' as well. Maybe form needs more direction because now it just blanks after enter

12/3 
-- keyCode - for enter?; forEach? addEventListener? Tabletop.js and using Google spreadsheets as a database
working on scrubbedSearchTerm fxn - replace spaces with +, remove: # <> {} [] _ | -, lowercase all (?)

Got spaces replaced with +. 

12/4
Added + to /\s so it now takes care of mult. spaces
Called getResults w scrubbed string as argument. Success!

Need to add something for this: 
 -- main.js:105 Uncaught TypeError: Cannot read property 'pages' of undefined(…)
-- Need to work around titlecase things - Women in Tech vs women in tech, iphone vs iPhone ...

12/9
Made input box opacity 0.6. 
Making results load into separate divs? Looks no different... Maybe alternate colors/style?
Do I want to notify user when they try to search for something and I have changed their input? i.e. jitter-bug vs 
jitterbug

Style notes:
want preResults to be smaller and searchStr to be italic

12/10
Removed non-alphanumeric chars from search. 


*/

var goRandom = document.getElementById("randBtn"); 

/* This should help format the search term so that unexpected characters and spaces don't break my API call*/
function scrubbedSearchTerm(){
	var searchStr = document.getElementById("searchField").value;
	var scrubbedStr = searchStr.replace(/\s+/g, '+');//takes spaces and replaces them with + 
	scrubbedStr = scrubbedStr.replace(/[^A-Za-z0-9]/g, "");// is this incomplete or something?

	console.log(scrubbedStr.length);

	//Now the string is used to call the API if there's something entered
	if (scrubbedStr.length > 0) {
		getResults(scrubbedStr);
	} else {
		alert("You didn't enter anything in text field.");
	}
}

function getResults(str){//needs text from text field, works blank too though..? !!!! NO!!!

	preResults.innerHTML = "<p>Article titles that start with: " + document.getElementById("searchField").value + "</p>";
	
	//This clears 'results' if multiple searches are conducted consecutively
	results.innerHTML = '';

	var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions&continue=&generator=allpages&gapprefix=" + str;

	$.getJSON(apiUrl, function(json){

		//This strips away everything I don't need so I can focus on the pages that result from the search
		var pagesOnlyJson = json.query.pages;
		var linky = "";

		for (var key in pagesOnlyJson) {
			linky = "https://en.wikipedia.org/wiki/" + pagesOnlyJson[key].title;
			results.innerHTML += "<div> <a href='" + linky + "'" + "target='_blank'>" + JSON.stringify(pagesOnlyJson[key].title) + "</a> </div>";
		}
	})
}


var results = document.getElementById("results");
//results.innerHTML = JSON.stringify(pagesOnlyJson);
//window.onload = getResults();

