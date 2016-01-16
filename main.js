$(document).ready(init);

var weatherDataObjectG = {
		State:"",
		City:"",
	  ZIPCode:"",
		currentConditions:"", 
		temperature:"",
		humidity:"",
		forecast:"",
		visibility:""
	};

function init(){
	console.log('in init jquery');
	findCurrentLocation();
	$('#search-location-button').on('click', searchButtonClicked);
}

function findCurrentLocation(){
	console.log('in find current location');
	var locationAPI_URL = 'http://api.wunderground.com/api/fe105b0e14a53aed/geolookup/q/autoip.json';
	var city = "";
	var state = "";

	$.ajax({
		url: locationAPI_URL, 
		type:"GET", 
		contenttype:'json',
		success:function(data){
			city = data.location.city; 
			state = data.location.state;
			console.log('city is: ' + city + ' state is ' + state);
			var stateCityString = state + ',' + ' '+ city;
			$('.input-field').val(stateCityString);
		},
		error:function(err){
			alert(err);
		}
	}); 
}

function searchButtonClicked(){
	console.log('in search button clicked');

	// Get the input value 
	var searchInput = $('.input-field').val();

	// Access API 
	setWeatherObject(searchInput);

}

function displayElements(){
	// Create weather object DOM elements 
	$('.output').empty();

	$currentConditions = $('<div>').addClass('current-conditions-data').text(weatherDataObjectG.currentConditions);
	$temperature = $('<div>').addClass('temp-data').text(weatherDataObjectG.temperature);
	$humidity = $('<div>').addClass('humidty-data').text(weatherDataObjectG.humidity);
	$forecast = $('<div>').addClass('forecast-data').text(weatherDataObjectG.forecast);
	$visibility = $('<div>').addClass('visibility-data').text(weatherDataObjectG.visibility);

	// Display data 
	$('.current-conditions-output').append($currentConditions);
	$('.temperature-output').append($temperature);
	$('.humidity-output').append($humidity);
	$('.forecast-output').append($forecast);
	$('.visibility-output').append($visibility);
}

function formatAPI_URL(searchInput){
	console.log('in formatURL');

	var apiURL = '';
	var baseURL = 'http://api.wunderground.com/api/fe105b0e14a53aed/conditions/q/'; 

	var regExZipCode = /\d*/gi;
	var regExCityState = /[a-zA-Z]/gi;

	// If input is city, state
	if(regExCityState.test(searchInput) === true){
		var regExState = /[A-Z]{2}/;
		var stateArray = searchInput.match(regExState);

		var regExCity = /\, (.*)/;
		var cityArray = searchInput.match(regExCity);

		var formattedState = stateArray[0];
		console.log('formatted State: ', formattedState);

		weatherDataObjectG.State = formattedState; 

		var formattedCity = cityArray[1].split(" ").join("_"); 
		console.log('formatted city: ', formattedCity);

		weatherDataObjectG.City = formattedCity;

		formattedStateCity = stateArray[0] + '/' + cityArray[1];
		console.log('formated string is: ', formattedStateCity);

		apiURL = baseURL + formattedStateCity + '.json';
		console.log('if search input is city', apiURL);
	}

	else if (regExZipCode.test(searchInput) === true){
		apiURL = baseURL + searchInput.toString() + '.json';
		weatherDataObjectG.ZIPCode = searchInput.toString();
		console.log('if search input is a number')
	}

	return apiURL; 
}

function setWeatherObject (searchInput){
console.log('in access API');
	var formattedAPI_URL = formatAPI_URL(searchInput);

	// Obtained information based on given location info 
	$.ajax({
		url: formattedAPI_URL, 
		type:"GET", 
		contenttype:'json',
		success:function(data){
	  	weatherDataObjectG.currentConditions = data.current_observation.weather;
			weatherDataObjectG.temperature = data.current_observation.temperature_string;
			weatherDataObjectG.humidity = data.current_observation.relative_humidity;
			weatherDataObjectG.forecast = data.current_observation.forecast_url;
			weatherDataObjectG.visibility = data.current_observation.visibility_mi;
			displayElements();

			console.log('object', weatherDataObjectG);

		},
		error:function(err){
			alert(err);
		}
	}); 
}