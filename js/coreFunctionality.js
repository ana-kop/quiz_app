// This file contains the core functionality for the apps


/*Reference: 
The code provided in class for CEGE0043 by Claire Ellul served as a prototype for the code to be found in this file. This code by Claire Ellul can be found in the 
following GitHub repositories: https://github.com/ucl-geospatial/cege0043-2020-examples-app; https://github.com/ucl-geospatial/cege0043-apps-ucessie. 
Since a large proportion of the code in this file came from this source, it will not be further referenced in this file, but instead, unless stated otherwise, 
one can assume that the code in this file was adapted or reproduced from the repositories above. 
(In a small number of cases where no reference is given and the specific code did not originate from these repositories, it can be assumed the code was produced by the developer who wrote these files, 
using only said developer's own knowledge.)
*/


var width;
var formLayer;

function setMapClickEvent() { // get the window width
mymap.setView([51.522449,-0.13263], 11)
width = $(window).width();


if (width < 767) { //the quiz – 767px is defined as 'small' by bootstrap
// cancel the map onclick event using off .. 
loadUnansweredQuestions();
trackLocation();
mymap.off('click',onMapClick);
mymap.closePopup(); 
	if (mymap.hasLayer(formLayer)=== true) {removeYourQuestions();}; //
	if (mymap.hasLayer(questionLayerThisWeek)=== true) {removeQuestionsThisWeek();};
	if (mymap.hasLayer(allQuestions)=== true) {removeAllQuestions();};
}

else { // the questions page
// the on click functionality of the MAP should pop up a blank questions form 
loadYourQuestions();
mymap.on('click', onMapClick);
mymap.closePopup();
	if (mymap.hasLayer(unansweredQuestions)=== true) {removeUnansweredQuestions();}; //
	if (mymap.hasLayer(closestQuestions)=== true) {removeFiveClosestQuestions();};
	if (mymap.hasLayer(lastQuestions)=== true) {removeLastQuestions();};
} 
};




var Lat;
var Lon;

function onMapClick(e) {
ll = e.latlng;
Lat = ll.lat;
Lon = ll.lng;
console.log("Click location: " + Lat + ', ' + Lon);
var formHTML = questionSettingForm();
popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()+"<br>"+formHTML).openOn(mymap);
}




//http://pojo.sodhanalibrary.com/ConvertToVariable
function questionSettingForm() {
var myvar = '<h1>Question Setting Form </h1>'+
''+
'<div>'+
''+
'<label for="question_title">Question Title: </label><input type="text" size="25" id="question_title" required/><br/>'+
'<label for="question_text">Question: </label><input type="text" size="25" id="question_text" required/><br/>'+
'<label for="answer_1">Enter choice 1: </label><input type="text" size="25" id="answer_1" required/><br />'+
'<label for="answer_2">Enter choice 2: </label><input type="text" size="25" id="answer_2" required/><br />'+
'<label for="answer_3">Enter choice 3: </label><input type="text" size="25" id="answer_3" required/><br />'+
'<label for="answer_4">Enter choice 4: </label><input type="text" size="25" id="answer_4" required/><br />'+
'<label for="correct_answer">Enter correct answer number (1, 2, 3 or 4):  </label><input type="number" size="25" id="correct_answer" min="1" max="4" /><br /><br />'+
''+
'<div id="latitudeDIV">Latitude: '+Lat+'</div>'+
'<div id="longitudeDIV">Longitude: '+Lon+'</div>'+
''+
'<p>Click here to save quiz question</p>'+
'<button id="saveQuestion" onclick="saveQuizQuestion()">Save Quiz Question</button> <br /> <br />'+
''+
'<label for="deleteQuestionID">Enter ID of the record to delete:</label><input type="text" size="25" id="deleteQuestionID"/><br />'+
''+
'<p>Click here to delete the record</p>'+
'<button id="deleteQuestion" onclick="deleteQuizQuestion()">Delete Quiz Question</button> <br /> <br />'+
''+
''+
'</div>';
return myvar; }





function saveQuizQuestion() {
	var question_title = document.getElementById("question_title").value;
	var question_text = document.getElementById("question_text").value;
	var answer_1 = document.getElementById("answer_1").value;
	var answer_2 = document.getElementById("answer_2").value;
	var answer_3 = document.getElementById("answer_3").value;
	var answer_4 = document.getElementById("answer_4").value;
	var correct_answer = document.getElementById("correct_answer").value;
	
	var postString = "question_title="+question_title +"&question_text="+question_text+"&answer_1="+answer_1+"&answer_2="+answer_2+"&answer_3="+answer_3+"&answer_4="+answer_4+"&correct_answer="+correct_answer;
	
	// now get the geometry values
	postString = postString + "&latitude=" + Lat + "&longitude=" + Lon;

	//make sure the question form is filled and choose the correct answer
	if (question_title=='' || question_text=='' || answer_1=='' || answer_2=='' || answer_3=='' || answer_4=='')
	   {alert("Please fill in all the required fields");
		return false}
	if (correct_answer!='1' && correct_answer!='2' && correct_answer!='3' && correct_answer!='4')
		{alert("Please enter a number between 1 and 4 for the correct answer field");
		return false}

	var serviceUrl =  document.location.origin + "/api/insertQuizPoint";

   	$.ajax({
    url: serviceUrl,
    crossDomain: true,
    type: "POST",
    data: postString,
    success: function(data){console.log(data); questionSaved(data); mymap.closePopup();} 
    });
};



function deleteQuizQuestion() {
	var deleteID = document.getElementById("deleteQuestionID").value;
	var deleteString = "id="+deleteID;
	var serviceUrl =  document.location.origin + "/api/deleteQuestion";
	$.ajax({
	    url: serviceUrl,
	    crossDomain: true,
	    type: "POST",
	    success: function(data){console.log(data); questionDeleted(data);},
	    data: deleteString });
};






// ANSWER FORM
// keep the layer global so that we can automatically pop up a
// pop-up menu on a point if necessary
// we can also use this to determine distance for the proximity alert

function loadYourQuestions() {
	var dataAddress= "/api/geoJSONUserId/"+your_user_id+" "; 
	var layerURL = baseComputerAddress + dataAddress;

  $.ajax({
     url: layerURL,
     //"https://developer.cege.ucl.ac.uk:"+ httpsPortNumberAPI + "/getGeoJSON/quizquestions/"+ httpsPortNumberAPI ,
     crossDomain: true,
     success: function(result){
      console.log(result);
 		// load the geoJSON layer
	  formLayer = L.geoJson(result,
    	{ // use point to layer to create the points
      pointToLayer: function (feature, latlng) {
        // in this case, we build an HTML DIV string
        // using the values in the data
        var htmlString = "<div id='popup'"+feature.properties.id +"><h2>" + feature.properties.question_title + "</h2><br>";
        htmlString = htmlString + "<h3>"+feature.properties.question_text + "</h3><br>";
        // unique id for each answer
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
        htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br>";
        htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
        // now include a hidden element with the answer
        // in this case the answer is alwasy the first choice
        // for the assignment this will of course vary - you can use feature.properties.correct_answer
        htmlString = htmlString + "<div id=answer"+feature.properties.id+" hidden>"+feature.properties.correct_answer+"</div>";
        htmlString = htmlString + "</div>";
        console.log(htmlString);
        console.log(latlng);
        return L.marker(latlng, {icon:MarkerBlue}).bindPopup(htmlString);},
    }).addTo(mymap);
    }
  });
};


function removeYourQuestions() {
	if (mymap.hasLayer(formLayer)=== false) {console.log("Form layer does not exist; proceed.");}
	else {mymap.removeLayer(formLayer);}
};






function checkAnswer(questionID) {
  // get the answer from the hidden div
  // NB - do this BEFORE you close the pop-up as when you close the pop-up the DIV is destroyed
  if (width < 767) { 
		  var answer = document.getElementById("answer"+questionID).innerHTML;
		  console.log(answer)
		  // now check the question radio buttons
		  var correctAnswer = false;
		  var answerSelected = 0;
		  for (var i=1; i < 5; i++) {
		    if (document.getElementById(questionID+"_"+i).checked){answerSelected = i;}
		    if ((document.getElementById(questionID+"_"+i).checked) && (i == answer)) {
		    	alert ("Your answer is correct!"); correctAnswer = true; 
		    	unansweredQuestions.eachLayer(function(layer) {
		       	if (layer.feature.properties.id == questionID){
				layer.setIcon(MarkerGreen);
				layer.addTo(mymap);}   });
		    } }

		    if (correctAnswer === false) {
		      alert("Your answer is wrong");
		      unansweredQuestions.eachLayer(function(layer) {
				        if (layer.feature.properties.id == questionID){
				             layer.setIcon(MarkerRed);
				             layer.addTo(mymap);}  });
		    } 

		    // now close the popup
		    mymap.closePopup();

		    // the code to upload the answer to the server would go here
		    postString = "&question_id="+questionID;
		    postString = postString+"&answer_selected="+answerSelected;
		    postString = postString+"&correct_answer="+answer;

		    var serviceUrl = document.location.origin + "/api/insertQuizAnswers";

		   	$.ajax({
		    url: serviceUrl,
		    crossDomain: true,
		    type: "POST",
		    data: postString,
		    success: function(data){console.log(data);} });

		    correctAnswers();
		    getRanking();

		}
		else {mymap.closePopup(); alert("Your answer has not been submitted." + "\n" + "\n" + "You cannot answer questions in Question Setting mode. Please use Quiz mode to answer questions on smaller screen.");}

};





function questionSaved(data) {
	alert("AJAX response: " + "\n" +  "\n" + JSON.stringify(data));
}


function questionDeleted(data){
    alert("AJAX response: " + "\n" +  "\n" + JSON.stringify(data));
}





function helpQuestionSetting() {
	window.open('https://128.16.82.46/app/help_question_setting.html');
};

function helpQuiz() {
	window.open('https://128.16.82.46/app/help_quiz.html');
};