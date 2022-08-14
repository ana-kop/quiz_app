// This file contaains the location tracking and proximity alert functionality for the apps


/*Reference: 
The code provided in class for CEGE0043 by Claire Ellul served as a prototype for the code to be found in this file. This code by Claire Ellul can be found in the 
following GitHub repositories: https://github.com/ucl-geospatial/cege0043-2020-examples-app; https://github.com/ucl-geospatial/cege0043-apps-ucessie. 
Since a large proportion of the code in this file came from this source, it will not be further referenced in this file, but instead, unless stated otherwise, 
one can assume that the code in this file was adapted or reproduced from the repositories above. 
(In a small number of cases where no reference is given and the specific code did not originate from these repositories, it can be assumed the code was produced by the developer who wrote these files, 
using only said developer's own knowledge.)
*/


var geoLocationID;
var trackLocationLayer = [];


function trackLocation() {
		if (navigator.geolocation) {
		geoLocationID = navigator.geolocation.watchPosition(showPosition); } 
		else {
		document.getElementById('Latitude').innerHTML = "Geolocation is not supported by this browser."; }
};



var currentLat;
var currentLon;

function showPosition(position) {
		currentLon = position.coords.longitude;
		currentLat = position.coords.latitude;

		document.getElementById('Latitude').innerHTML = currentLat;
		document.getElementById('Longitude').innerHTML = currentLon; 

		proximityAlerts();
};




function proximityAlerts() { 
	if (width < 767) {
			// take the leaflet formdata layer, go through each point one by one
			// and measure the distance to Warren Street for the closest point show the pop up of that point 
			var minDistance = 100000000000;
			var closestFormPoint = 0;
			// for this example, use the latitude/longitude of warren street 
			// in your assignment replace this with the user's location
			var userlat = document.getElementById("Latitude").innerHTML;
			var userlng = document.getElementById("Longitude").innerHTML;

			unansweredQuestions.eachLayer(function(layer) {
			var distance = calculateDistance(userlat,userlng,layer.getLatLng().lat, layer.getLatLng().lng, 'K'); 
			if (distance < minDistance){minDistance = distance;
			closestFormPoint = layer.feature.properties.id;}
			});
			// for this to be a proximity alert, the minDistance must be closer than a given distance - you can check that here 
			// using an if statement show the popup for the closest point 
			unansweredQuestions.eachLayer(function(layer) {
			if (layer.feature.properties.id == closestFormPoint){layer.openPopup();} });
		}
		else {console.log("proxinmity alerts off")}
};


// Source: https://www.geodatasource.com/developers/javascript
function calculateDistance(lat1,lon1,lat2,lon2,unit){
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180; 
	var radlon1 = Math.PI * lon1/180; 
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit=="K"){dist=dist*1.609344;}// convert miles to km
	if (unit=="N"){dist=dist*0.8684;}// convert miles to nautical miles
	return dist;
};