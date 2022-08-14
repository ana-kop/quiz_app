// This file contains functions required for starting up the apps


/*Reference: 
The code provided in class for CEGE0043 by Claire Ellul served as a prototype for the code to be found in this file. This code by Claire Ellul can be found in the 
following GitHub repositories: https://github.com/ucl-geospatial/cege0043-2020-examples-app; https://github.com/ucl-geospatial/cege0043-apps-ucessie. 
Since a large proportion of the code in this file came from this source, it will not be further referenced in this file, but instead, unless stated otherwise, 
one can assume that the code in this file was adapted or reproduced from the repositories above. 
(In a small number of cases where no reference is given and the specific code did not originate from these repositories, it can be assumed the code was produced by the developer who wrote these files, 
using only said developer's own knowledge.)
*/



var baseComputerAddress = window.location.origin;
var mymap;
var popup = L.popup();




function loadLeafletMap() {
		mymap = L.map('mapcontainer').setView([51.505, -0.09], 13);
		L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data © OpenStreetMap contributors, ' + 'CC-BY-SA, ' + 'Imagery © Mapbox',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
		}).addTo(mymap);
};




var your_user_id;

function getUserID() {
	var dataAddress= "/api/getUserId";
	var layerURL = baseComputerAddress + dataAddress;

	$.ajax({
		dataType: "json",
		url: layerURL, 
		crossDomain: true, 
		success: function(result){
			$(result.features).each(function(key, result) {console.log(result)});
			yourID = result[0].user_id;
			your_user_id = yourID;
			// return your_user_id;
			setMapClickEvent();}
		});
};



function startUp() {
	  loadLeafletMap(); 
      getUserID();
};




// markerColor options available: 
// 'white', 'red','darkred', 'lightred', 'orange', 'beige', 'green', 'darkgreen', 'lightgreen', 'blue', 
// 'darkblue', 'lightblue', 'purple', 'darkpurple', 'pink', 'cadetblue', 'white', 'gray', 'lightgray', 'black'.

var MarkerBlue = L.AwesomeMarkers.icon({icon: 'play',markerColor: 'darkblue'}); //default
var MarkerGreen = L.AwesomeMarkers.icon({ icon: 'play',markerColor: 'darkgreen'}); //correct answers
var MarkerRed = L.AwesomeMarkers.icon({ icon: 'play',markerColor: 'red'}); //wrong answers
var MarkerPurple = L.AwesomeMarkers.icon({ icon: 'play', markerColor: 'purple' }); //added last week
var MarkerPink = L.AwesomeMarkers.icon({ icon: 'play', markerColor: 'pink' }); //closest
var MarkerGrey = L.AwesomeMarkers.icon({ icon: 'play',markerColor: 'gray'}); //all questions
var MarkerOrange = L.AwesomeMarkers.icon({icon: 'play',markerColor: 'orange'}); //unanswered questions