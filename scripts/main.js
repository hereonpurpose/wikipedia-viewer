document.getElementById('searchBtn').addEventListener('click',scrubbedSearchTerm);

const searchField = document.querySelector('#searchField');
searchField.addEventListener('keypress', function(e){
	var key = e.which || e.keyCode;
	if (key === 13) {
		scrubbedSearchTerm();
	}
});

/* This should help format the search term so that unexpected characters and spaces don't break my API call*/
var searchStr = '';

function scrubbedSearchTerm(){
	searchStr = searchField.value; 
	var scrubbedStr = searchStr.replace(/\s+/g, '+').replace(/[^A-Za-z0-9+]/g, "");

	//Now the string is used to call the API or let the user know that nothing was entered
	if (scrubbedStr.length > 0) {
		getResults(scrubbedStr);
	} else {
		alert("Sorry. I couldn't run the search with that input. Try using alphanumeric characters (anything from A-z and 0-9).");
	}
}

function getResults(str){
	preResults.innerHTML = "<p>Article titles that start with: " + searchStr + "</p>";
	results.innerHTML = '';

	var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageterms&generator=prefixsearch&redirects=1&wbptterms=description&gpssearch=" + str + "&gpslimit=10";

	$.getJSON(apiUrl, function(json){
		//try { -- Need to figure this out again. Sometimes says 'no results when there are results'

		//This strips away everything I don't need so I can focus on the pages that result from the search
			var pagesOnlyJson = json.query.pages;

			for (var key in pagesOnlyJson) {
				var titles = pagesOnlyJson[key].title;
				var link = "https://en.wikipedia.org/wiki/" + titles;
				var introText = pagesOnlyJson[key].terms.description[0];//can't read this for undefined
				// results seems really long
				results.innerHTML += "<div class='article'> <a href='" + link + "'" + "target='_blank'>" + titles + "</a>" + "<br><p>" + introText + "</p>" + "</div>";
				//fullContent.innerHTML = JSON.stringify(pagesOnlyJson); //start display \n and end display at \n. [[Article titles]]
			}
			//results.innerHTML = '<p>' + JSON.stringify(pagesOnlyJson[key].title) + '</p>';

		/*} catch (e) {
			preResults.innerHTML = "Nope";
			results.innerHTML = "<p>No articles found starting with: " + document.getElementById("searchField").value + "</p>";
		}*/
	})
}


var results = document.getElementById("results");


