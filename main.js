$(document).ready(init);

var weatherDataObjectG = {
		State:"",
		City:"",
	  ZIPCode:"",
		currentConditions:"", 
		temperature:"",
		humidity:"",
		forecast:"",
		visibility_mi:""
	};

function init(){
	findCurrentLocation();
	$('#search-location-button').on('click', searchButtonClicked);
}

function findCurrentLocation(){
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
			var stateCityString = state + ',' + ' '+ city;
			$('.input-field').val(stateCityString);
		},
		error:function(err){
			alert(err);
		}
	}); 
}

function searchButtonClicked(){
	var searchInput = $('.input-field').val();
	// Access API 
	setWeatherObject(searchInput);
}

function displayElements(){
	$('.output').empty();
	$currentConditions = $('<div>').addClass('current-conditions-data').text(weatherDataObjectG.currentConditions);
	$temperature = $('<div>').addClass('temp-data').text(weatherDataObjectG.temperature);
	$humidity = $('<div>').addClass('humidty-data').text(weatherDataObjectG.humidity);
	$forecast = $('<div>').addClass('forecast-data').text(weatherDataObjectG.forecast);
	$visibility = $('<div>').addClass('visibility-data').text(weatherDataObjectG.visibility_mi);

	$('.current-conditions-output').append($currentConditions);
	$('.temperature-output').append($temperature);
	$('.humidity-output').append($humidity);
	$('.forecast-output').append($forecast);
	$('.visibility-output').append($visibility);
}

function formatAPI_URL(searchInput){
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
		weatherDataObjectG.State = formattedState; 

		var formattedCity = cityArray[1].split(" ").join("_"); 
		weatherDataObjectG.City = formattedCity;

		formattedStateCity = stateArray[0] + '/' + cityArray[1];

		apiURL = baseURL + formattedStateCity + '.json';
	}

	else if (regExZipCode.test(searchInput) === true){
		apiURL = baseURL + searchInput.toString() + '.json';
		weatherDataObjectG.ZIPCode = searchInput.toString();
	}

	return apiURL; 
}

function setWeatherObject (searchInput){
	var formattedAPI_URL = formatAPI_URL(searchInput);

	$.ajax({
		url: formattedAPI_URL, 
		type:"GET", 
		contenttype:'json',
		success:function(data){
	  	weatherDataObjectG.currentConditions = data.current_observation.weather;
			weatherDataObjectG.temperature = data.current_observation.temperature_string;
			weatherDataObjectG.humidity = data.current_observation.relative_humidity;
			weatherDataObjectG.forecast = data.current_observation.forecast_url;
			weatherDataObjectG.visibility_mi = data.current_observation.visibility_mi;
			displayElements();
		},
		error:function(err){
			alert(err);
		}
	}); 
}