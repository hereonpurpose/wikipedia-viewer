const goRandom = document.getElementById("randBtn"); 
const searchButton = document.getElementById('searchBtn');

searchButton.addEventListener('click',scrubbedSearchTerm);

/* Event listener for 'enter/return' (no form being submitted) to take search input forward */
/*if (key === 13) {
	scrubbedSearchTerm();
}*/
//})// look up keypress

/* This should help format the search term so that unexpected characters and spaces don't break my API call*/
var searchStr = '';

function scrubbedSearchTerm(){
	searchStr = document.querySelector('#searchField').value; 
	var scrubbedStr = searchStr.replace(/\s+/g, '+').replace(/[^A-Za-z0-9+]/g, "");

	//Now the string is used to call the API or let the user know that nothing was entered
	if (scrubbedStr.length > 0) {
		getResults(scrubbedStr);
		//return searchStr;
	} else {
		alert("Sorry. I couldn't run the search with that input. Try using alphanumeric characters like (anything from A-z and 0-9).");
	}
}

function getResults(str){
	preResults.innerHTML = "<p>Article titles that start with: " + searchStr + "</p>";
	results.innerHTML = '';

	var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageterms&generator=prefixsearch&redirects=1&wbptterms=description&gpssearch=" + str + "&gpslimit=10";
	/*Previous request URL:*/
/*var apiUrl =
"https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions&rvprop=content&continue=&generator=allpages&gapprefix=" + str;
*/



	$.getJSON(apiUrl, function(json){
		try {

		//This strips away everything I don't need so I can focus on the pages that result from the search
			var pagesOnlyJson = json.query.pages;

			for (var key in pagesOnlyJson) {
				var titles = pagesOnlyJson[key].title;
				var link = "https://en.wikipedia.org/wiki/" + titles; //JSON.stringify( )
				var introText = pagesOnlyJson[key].terms.description;
				console.log(introText);
				results.innerHTML += "<div class='article'> <a href='" + link + "'" + "target='_blank'>" + titles + "</a> </div> <hr>";
				fullContent.innerHTML = JSON.stringify(pagesOnlyJson); //start display \n and end display at \n. [[Article titles]]
			}
			//results.innerHTML = '<p>' + JSON.stringify(pagesOnlyJson[key].title) + '</p>';

		} catch (e) {
			preResults.innerHTML = "Nope";
			results.innerHTML = "<p>No articles found starting with: " + document.getElementById("searchField").value + "</p>";
		}
	})
}


var results = document.getElementById("results");


