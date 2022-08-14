// This document contains the advanced functionality for the apps


/*Reference: 
The code provided in class for CEGE0043 by Claire Ellul served as a prototype for the code to be found in this file. This code by Claire Ellul can be found in the 
following GitHub repositories: https://github.com/ucl-geospatial/cege0043-2020-examples-app; https://github.com/ucl-geospatial/cege0043-apps-ucessie. 
Since a large proportion of the code in this file came from this source, it will not be further referenced in this file, but instead, unless stated otherwise, 
one can assume that the code in this file was adapted or reproduced from the repositories above. 
(In a small number of cases where no reference is given and the specific code did not originate from these repositories, it can be assumed the code was produced by the developer who wrote these files, 
using only said developer's own knowledge.)
*/

var questionLayerThisWeek;

function loadQuestionsThisWeek() {
	var dataAddress= "/api/questionsAddedWithinLastWeek";
	var layerURL = baseComputerAddress + dataAddress;

  $.ajax({
     url: layerURL,
     crossDomain: true,
     success: function(result){
      console.log(result);
	  	questionLayerThisWeek = L.geoJson(result,{
    	pointToLayer: function (feature, latlng) {
        var htmlString = "<div id='popup'"+feature.properties.id +"><h2>" + feature.properties.question_title + "</h2><br>";
        htmlString = htmlString + "<h3>"+feature.properties.question_text + "</h3><br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br>";
        // htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
        htmlString = htmlString + "<div id=answer"+feature.properties.id+" hidden>"+feature.properties.correct_answer+"</div>";
        htmlString = htmlString + "</div>";
        console.log(htmlString);
        console.log(latlng);
        return L.marker(latlng, {icon:MarkerPurple}).bindPopup(htmlString);},
    }).addTo(mymap);}
  });
};


function removeQuestionsThisWeek() {
		if (mymap.hasLayer(questionLayerThisWeek)=== false) {alert("Cannot remove map layer as it does not exist");}
		else {alert("Map layer with question points from last week will be removed");mymap.removeLayer(questionLayerThisWeek);}
};




function loadDifficultQuestions() {
	var dataAddress = "/api/fiveDifficultQuestions";
	var layerURL = baseComputerAddress + dataAddress;

	$.ajax({
		dataType: "json",
		url: layerURL, 
		crossDomain: true, 
		success: function(result){
			$(result.features).each(function(key, result) {console.log(result)});
			data1 = result.array_to_json;
			question_title_1 = data1[0].question_title;
			question_text_1 = data1[0].question_text;

			question_title_2 = data1[1].question_title;
			question_text_2 = data1[1].question_text;

			question_title_3 = data1[2].question_title;
			question_text_3 = data1[2].question_text;
			
			question_title_4 = data1[3].question_title;
			question_text_4 = data1[3].question_text;

			question_title_5 = data1[4].question_title;
			question_text_5 = data1[4].question_text;

			var alert_str = "5 most difficult questions" + "\n"+ "\n" + "\n";
			alert_str = alert_str + "1) " + question_title_1 + ':' + "\n" + "-->  " + question_text_1 + "\n"+ "\n" + "2) " + question_title_2 + ':' + "\n" +"-->  " +question_text_2 + "\n"+ "\n";
			alert_str = alert_str + "3) " + question_title_3 + ':' + "\n" +"-->  " +question_text_3 + "\n"+ "\n" + "4) " + question_title_4 + ':' + "\n" +"-->  "+question_text_4 + "\n" + "\n";
			alert_str = alert_str + "5) " + question_title_5 + ':' + "\n" +"-->  "+question_text_5;
			alert(alert_str);
		}
		});
};





function correctAnswers() {
	var dataAddress= "/api/userQuestions/"+your_user_id+" ";
	var layerURL = baseComputerAddress + dataAddress;

	var data;
	var correctAnswers;

	$.ajax({
		dataType: "json",
		url: layerURL, 
		crossDomain: true, 
		success: function(result){
			$(result.features).each(function(key, result) {console.log(result)});
			data = result[0].array_to_json;
			number = data[0].num_questions;
			alert('Number of questions you have answered correctly: ' + number);
		}
		});
};




function getRanking() {
	var dataAddress= "/api/userRanking/"+your_user_id+" ";
	var layerURL = baseComputerAddress + dataAddress;

	$.ajax({
		dataType: "json",
		url: layerURL, 
		crossDomain: true, 
		success: function(result){
			$(result.features).each(function(key, result) {console.log(result)});
			data = result.array_to_json;
			ranking = data[0].rank;
			alert('Your updated rank: ' + ranking);
}
});
};




var closestQuestions;

function loadFiveClosestQuestions() {
	var lat = document.getElementById("Latitude").innerHTML;
	var lon = document.getElementById("Longitude").innerHTML;

	var dataAddress= "/api/fiveClosestQuestions/"+lon+"/"+lat+" ";
	var layerURL = baseComputerAddress + dataAddress;

  $.ajax({
     url: layerURL,
     crossDomain: true,
     success: function(result){
      console.log(result);
	  	closestQuestions = L.geoJson(result,{ 
      pointToLayer: function (feature, latlng) {
        var htmlString = "<div id='popup'"+feature.properties.id +"><h2>" + feature.properties.question_title + "</h2><br>";
        htmlString = htmlString + "<h3>"+feature.properties.question_text + "</h3><br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br>";
        // htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
        htmlString = htmlString + "<div id=answer"+feature.properties.id+" hidden>"+feature.properties.correct_answer+"</div>";
        htmlString = htmlString + "</div>";
        console.log(htmlString);
        console.log(latlng);
        return L.marker(latlng, {icon:MarkerPink}).bindPopup(htmlString);},
    }).addTo(mymap);}
  });
};


function removeFiveClosestQuestions() {
		if (mymap.hasLayer(closestQuestions)=== false) {alert("Cannot remove map layer as it does not exist");}
		else {alert("Map layer with five closest question points will be removed");mymap.removeLayer(closestQuestions);}
};





var lastQuestions;

function loadLastQuestions() {
	var dataAddress= "/api/lastFiveQuestionsAnswered/"+your_user_id+" ";
	var layerURL = baseComputerAddress + dataAddress;

  $.ajax({
     url: layerURL,
     crossDomain: true,
     success: function(result){
      console.log(result);
	  lastQuestions = L.geoJson(result,{
      pointToLayer: function (feature, latlng) {
        var htmlString = "<div id='popup'"+feature.properties.id +"><h2>" + feature.properties.question_title + "</h2><br>";
        htmlString = htmlString + "<h3>"+feature.properties.question_text + "</h3><br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br>";
        // htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
        htmlString = htmlString + "<div id=answer"+feature.properties.id+" hidden>"+feature.properties.correct_answer+"</div>";
        htmlString = htmlString + "</div>";
        console.log(htmlString);
        console.log(latlng);

 		if(feature.properties.answer_correct == true){
		            	return L.marker(latlng,{icon:MarkerGreen}).bindPopup(htmlString);}
		if(feature.properties.answer_correct == false){
		            	return L.marker(latlng,{icon:MarkerRed}).bindPopup(htmlString);}
    }}).addTo(mymap);}
  });
};


function removeLastQuestions() {
		if (mymap.hasLayer(lastQuestions)=== false) {alert("Cannot remove map layer as it does not exist");}
		else {alert("Map layer with last 5 questions answered will be removed");mymap.removeLayer(lastQuestions);}
};





var unansweredQuestions;

function loadUnansweredQuestions() {
	var dataAddress= "/api/questionsNotAnswered/"+your_user_id+" ";
	var layerURL = baseComputerAddress + dataAddress;

  $.ajax({
     url: layerURL,
     crossDomain: true,
     success: function(result){
	    console.log(result);
		unansweredQuestions = L.geoJson(result,{
    	pointToLayer: function (feature, latlng) {
        var htmlString = "<div id='popup'"+feature.properties.id +"><h2>" + feature.properties.question_title + "</h2><br>";
        htmlString = htmlString + "<h3>"+feature.properties.question_text + "</h3><br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br>";
        htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
        htmlString = htmlString + "<div id=answer"+feature.properties.id+" hidden>"+feature.properties.correct_answer+"</div>";
        htmlString = htmlString + "</div>";
        console.log(htmlString);
        console.log(latlng);
        return L.marker(latlng, {icon:MarkerOrange}).bindPopup(htmlString);},
    }).addTo(mymap);}
  });
};


function removeUnansweredQuestions() {
	if (mymap.hasLayer(unansweredQuestions)=== false) {console.log("Unanswered questions layer does not exist; proceed.");}
	else {mymap.removeLayer(unansweredQuestions);}
};




var allQuestions;

function loadAllQuestions() {
	var dataAddress= "/api/allQuestions/";
	var layerURL = baseComputerAddress + dataAddress;

  $.ajax({
     url: layerURL,
     crossDomain: true,
     success: function(result){
	    console.log(result);
		allQuestions = L.geoJson(result,{
    	pointToLayer: function (feature, latlng) {
        var htmlString = "<div id='popup'"+feature.properties.id +"><h2>" + feature.properties.question_title + "</h2><br>";
        htmlString = htmlString + "<h3>"+feature.properties.question_text + "</h3><br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br>";
        // htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
        htmlString = htmlString + "<div id=answer"+feature.properties.id+" hidden>"+feature.properties.correct_answer+"</div>";
        htmlString = htmlString + "</div>";
        console.log(htmlString);
        console.log(latlng);
        return L.marker(latlng, {icon:MarkerGrey}).bindPopup(htmlString);},
    }).addTo(mymap);}
  });
};


function removeAllQuestions() {
		if (mymap.hasLayer(allQuestions)=== false) {alert("Cannot remove map layer as it does not exist");}
		else {alert("Map layer with all existing question points will be removed");mymap.removeLayer(allQuestions);}
};