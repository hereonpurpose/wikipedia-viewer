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

	var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageterms&list=&generator=search&redirects=1&wbptterms=description&gsrsearch=" + str + "&gpslimit=10";

	$.getJSON(apiUrl, function(json){

		//This strips away everything I don't need so I can focus on the pages that result from the search			
		var pagesOnlyJson = json.query.pages;

		if (!json.hasOwnProperty('continue')){ // and therefore has no 'pages' to return
			preResults.innerHTML = "<p>No articles found starting with: " + searchStr + "</p>";
		} else {
			for (var key in pagesOnlyJson) {
				var titles = pagesOnlyJson[key].title;
				var link = "https://en.wikipedia.org/wiki/" + titles;
				
				// Writes results with link and, if available, a description
				if (!json.query.pages[key].hasOwnProperty('terms')){
					results.innerHTML += "<div class='article'><a href='" + link + "'" + "target='_blank'><div>" + titles + "</div></a></div>";

				} else {
					var introText = pagesOnlyJson[key].terms.description[0];
					results.innerHTML += "<div class='article'><a href='" + link + "'" + "target='_blank'><div>" + titles + "<p>" + introText + "</p></div></a></div>";

				}
			}
		}
	})
}