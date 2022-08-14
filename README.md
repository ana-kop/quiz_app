# Documentation for the Apps

This is a technical guide for the 2 apps - a browser-based question setting app and a mobile-based quiz answering app - created for the CEGE0043 final assessment.

These apps help the user to create a new question about a location, add possible answers and upload questions to a database on the web server. By using this app, the location of a question could be input by either clicking on a point on a Leaflet map or manually typing latitudes and longitudes. This app is also able to retrieve existed questions of certain characteristics and information of users from the database.


### Table of Contents
1. System Requirements 
2. Deployment
3. Testing
4. File description
5. Code reference


### 1. System Requirements
In order to enable the full functionality of this app, a browser that supports geolocation access via http connection is required. Some browsers (such as Safari) block geolocation access via http connection. As a result, the app cannot locate and zoom into user positions if it is opened in those browsers. Therefore, it is recommended to use Chrome(Version 73.0.3683.75 or above) or Firefox(Version 65.0.2 or above) for this app.

This app requires to make connections to a Ubuntu Server (Virtual Machine). You could use BitVise, Pycharm (Version 2018.3.5 Professional Edition) or other SSH software to connect to the Ubuntu Server. If you have a Mac computer, a good choice is to use the Cyberduck app from the App Store.

If you are going to use this app outside the UCL campus (i.e. where you are not connected to Eduroam), make sure you are connected to UCL VPN by following the instructions
at https://www.ucl.ac.uk/isd/services/get-connected/ucl-virtual-private-network-vpn.

### 2. Deployment
Procedures to deploy this app:
1. Open a terminal window for the Ubuntu server and enter your password.
2. Type the following command:
`cd /home/studentuser`
3. Create a certs folder in the this directory, and add a file called postGISConnection.js in this folder, which is structured as follows:
```
    host: [your host IP address],
    user: [your user id],
    database: ucfscde,
    password: [your password],
    port: 5432
```
    
4. Clone the source code of this question setting app from Github by typing the following two commands (where studentuser is your UCL id):
```
cd /home/studentuser/code
git clone https://github.com/ana-kop/quiz_app -b master
```
5. Clone the source code of the corresponding Node JS server from Github by typing the following two commands (where studentuser is your UCL id):
```
cd /home/studentuser/code
git clone https://github.com/ana-kop/quiz_api -b master
```
3. Start the Node JS server by typing the following commands in the terminal:
```
cd /home/studentuser/code/quiz_api
pm2 start dataAPI.js
```
4. Make sure the Node JS server is successfully started. If any error occurs, you could enter the debug mode through the command line window by typing
```
cd /home/studentuser/code/quiz_api
node dataAPI.js
```

### 3. Testing
Procedures to test this app:
1. Make sure your device is connected to UCL Wifi or UCL VPN.
2. Make sure the Node JS server is active.
3. In a browser that supports geolocation access via http connection (such as Chrome or Firefox), type the following address to use the question setting app: `https://[your IP address]/app/bootStrap.html`
4. While testing the functionality of this map, use of Inspect or Developer mode -> Javascript console of the browser to see if any error occurs.

### 4. File descriptions
The files associated with the two Apps are located in several sub-folders.

~/quiz_app:
* bootStrap.html: The main html file of this app, through which user could use all the question setting functionality and quiz functionality. This html contains several divs.

* ~/js : Contains Javascript files required by bootStrap.html.
    * startUp.js: contains the functions loaded when the apps are started, as well as some marker variables for the Leaflet map.
    
    | id | description |
    | --- | --- |
    | loadLeafletMap | Loads the Leaflet map component of the webpage. |
    | getUserID | Gets the user id of the current app user, to be used for database querying; initiates a callback to setMapClickEvent() function.  |
    | startUp | Function used in bootStrap.html that calls loadLeafletMap and getUserID functions. |

    * coreFunctionality.js: contains the functions required for the core functionality:
    
    | id | description |
    | --- | --- |
    | setMapClickEvent | Function handling the resize events and loading appropriate question points depending on the screen size; also handles location tracking and on-map-click functionality. | 
    | onMapClick | Functionality for question setting form to pop up when user clicks on the map in large screen mode. | 
    | questionSettingForm | Contains the HTML for the popup form for question setting. | 
    | saveQuizQuestion | Processes the inputs from the question setting form and saves the question to the database. | 
    | deleteQuizQuestion | Deletes a question user previously created from the questions database. |
    | loadYourQuestions |  Shows on the map existing quiz points that you have created (for the question setting component). | 
    | removeYourQuestions | Remove the layer created by the function above. | 
    | checkAnswer | Checks the user's answer, and send the answer back to the API to be saved to the database. | 
    | questionSaved | Returns the stringified AJAX responce when question is saved. | 
    | questionDeleted |  Returns the stringified AJAX responce when question is deleted. |
    | helpQuestionSetting | Redirects the user to the help documentation for the Question Setting component. | 
    | helpQuiz | Redirects the user to the help documentation for the Quiz component. |

    * advancedFunctionality.js: contains the functions required for the advanced functionality:
    
    | id | description |
    | --- | --- |
    | loadQuestionsThisWeek |  Shows on the map all the questions added in the last week (by any user). | 
    | removeQuestionsThisWeek | Remove the layer created by the function above. | 
    | loadDifficultQuestions | Shows a list of the 5 most difficult questions - i.e. where most wrong answers were given. | 
    | correctAnswers | Tells the user how many questions they have answered correctly when they answer a question. | 
    | getRanking | Tells the user their ranking (in comparison to all other users) when they answer a question. | 
    | loadFiveClosestQuestions | Shows the 5 questions closest to the user’s current location, added by any user. | 
    | removeFiveClosestQuestions | Remove the layer created by the function above. | 
    | loadLastQuestions |  Shows the last 5 questions the user answered (colour coded depending on whether they were right/wrong the first time they answered the question). | 
    | removeLastQuestions | Remove the layer created by the function above. | 
    | loadUnansweredQuestions | Ensures that app only shows questions and calculates proximity alerts for questions that the user hasn’t answered correctly. | 
    | removeUnansweredQuestions | Remove the layer created by the function above. | 
    | loadAllQuestions | Loads the layer with all the question points currently in the database (created by anyone). | 
    | removeAllQuestions | Remove the layer created by the function above. | 
    
    * locationTracking.js: contains the location tracking and proximity alert functionality for the apps.
    
    | id | description |
    | --- | --- |
    | trackLocation | Tracks the user’s location automatically when the quiz app starts. |
    | showPosition | Gives user's current position. | 
    | proximityAlerts | Makes a quiz question pop up automatically (proximity alert) when the user is close to the point. | 
    | calculateDistance | Calculates the distance for the proximityAlerts function. | 

    * graph.js: contains the graph functionality for the apps.

    | id | description |
    | --- | --- |
    | loadTopScorersGraph | Loads the graph showing top 5 scorers in the quiz.  |
    | loadParticipationAllGraph | Loads the graph showing daily participation rates for the past week, for all users. |
    | loadParticipationUserGraph | Loads the graph showing daily participation rates for the past week, for your user only. |
    | closeGraph | Function that closes a graph when the 'x' button is clicked. |


* help_quiz.html: The HTML page containing help for users of the Quiz App. 
* help_question_setting.html : The HTML page containing help for users of the Question Setting App. 
* app.js: The Javascript file to launch the Apps.
* package-lock.json: this file is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates. This file is intended to be committed into source repositories.
* ~/css : Contains the files required for setting up styles of bootStrap.html (such as fonts and margins) and incorporating the CSS required for custom icon creation.

### Code reference
* A large proportion of code here is adapted from the examples provided in class for [CEGE0043 Web and Mobile and GIS](https://github.com/ucl-geospatial/cege0043-2020-examples-app) by Claire Ellul, including:
    * Basic structure of bootStrap.html;
    * Functions related to events detector, data downloading, data uploading, data processing, user location tracking, displaying map layers, as well as basic graph functions;
    * Siginificant parts of this README.md file (from the technical-documentation-example file provided with the material for this assignment.)
* The user interface of this app are based on [Material design Lite Dashboard](https://getmdl.io/templates/). 
* The graphs in these apps utilise [D3 JavaScript library](https://d3js.org/); the legends of D3 graphs are adapted from [stackoverflow](https://stackoverflow.com/questions/45941427/d3-stacked-chart-with-json-data); the axis labels of D3 graphs are adapted from [bl.ocks.org](https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e).
* The utility of changing div contents of one .html by contents of another .html provided
by W3 schools.
* Map layers are created using an open-source JavaScript library for mobile-friendly interactive maps [Leaflet](https://leafletjs.com/). 
* The base map data is based on [Open Street Map](https://www.openstreetmap.org/#map=5/54.910/-3.432). 
* The text formatting in help HTML files was created using the an online editor [wordtohtml](https://wordtohtml.net).
* This readme file was created using online [editor](https://dillinger.io)
* Other minor components of the code used for these apps were taken from a number of sources that are referenced in the specific code files.
