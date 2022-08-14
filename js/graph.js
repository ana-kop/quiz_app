// This file contains functions required for making graphs available in the 2 apps.


/*Reference: 
The code provided in class for CEGE0043 by Claire Ellul served as a prototype for the code to be found in this file. This code by Claire Ellul can be found in the 
following GitHub repositories: https://github.com/ucl-geospatial/cege0043-2020-examples-app; https://github.com/ucl-geospatial/cege0043-apps-ucessie. 
Since a large proportion of the code in this file came from this source, it will not be further referenced in this file, but instead, unless stated otherwise, 
one can assume that the code in this file was adapted or reproduced from the repositories above. 
(In a small number of cases where no reference is given and the specific code did not originate from these repositories, it can be assumed the code was produced by the developer who wrote these files, 
using only said developer's own knowledge.)
*/


function loadTopScorersGraph() { document.getElementById("graphWrapper").style.top = "15%";

    var widtha = document.getElementById("graphWrapper").offsetWidth;
    var heighta = document.getElementById("graphWrapper").offsetHeight;
    console.log(widtha+" "+heighta);
    document.getElementById("graphWrapper").innerHTML=document.getElementById("graphWrapper").innerHTML+'<div  class="h-75 w-75"><svg width="'+widtha+'" height="'+heighta+'" id="svg1"></svg></div>'

	const svg     = d3.select("#svg1"),
	      margin  = {top: 20, right: 40, bottom: 60, left: 50},
	      width   = svg.attr("width") - margin.left - margin.right,
	      height  = svg.attr("height") - margin.top  - margin.bottom,
	      x       = d3.scaleBand().rangeRound([0, width]).padding(0.2),
	      y       = d3.scaleLinear().rangeRound([height, 0]),
	      g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

	      	var dataAddress = "/api/topFiveScorers";
			var layerURL = baseComputerAddress + dataAddress;

	d3.json(layerURL).then(data => {
	  data = data.array_to_json;
	  x.domain(data.map(d => d.user_id));
	  y.domain([0, d3.max(data, d => d.rank)]);

	  g.append("g")
	      .attr("class", "axis axis-x")
	      .attr("transform", `translate(0,${height})`)
	      .call(d3.axisBottom(x));

	  g.append("g")
	      .attr("class", "axis axis-y")
	      .call(d3.axisLeft(y).ticks(10).tickSize(8));

	  g.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", d => x(d.user_id))
	      .attr("y", d => y(d.rank))
	      .attr("width", x.bandwidth())
	      .attr("height", d => height - y(d.rank));
	})
	.catch(err => {
	  svg.append("text")         
	        .attr("y", 20)
	        .attr("text-anchor", "left")  
	        .style("font-size", "20px") 
	        .style("font-weight", "bold")  
	        .text(`Couldn't open the data file: "${err}".`)
	})
};


//https://stackoverflow.com/questions/34066752/sort-object-of-weekdays-like-sunday-monday-saturday
function loadParticipationAllGraph() { document.getElementById("graphWrapper").style.top = "15%";

    var widtha = document.getElementById("graphWrapper").offsetWidth;
    var heighta = document.getElementById("graphWrapper").offsetHeight;
    console.log(widtha+" "+heighta);
    document.getElementById("graphWrapper").innerHTML=document.getElementById("graphWrapper").innerHTML+'<div  class="h-75 w-75"><svg width="'+widtha+'" height="'+heighta+'" id="svg1"></svg></div>'

	const svg     = d3.select("#svg1"),
	      margin  = {top: 20, right: 40, bottom: 60, left: 50},
	      width   = svg.attr("width") - margin.left - margin.right,
	      height  = svg.attr("height") - margin.top  - margin.bottom,
	      x       = d3.scaleBand().rangeRound([0, width]).padding(0.2),
	      y       = d3.scaleLinear().rangeRound([height, 0]),
	      g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);


	      	var dataAddress = "/api/dailyParticipationRatesAll";
			var layerURL = baseComputerAddress + dataAddress;

	d3.json(layerURL).then(data => {
	  data = data.array_to_json;
	  console.log(data);
  	  x.domain(data.map(d => d.day));
	  y.domain([0, d3.max(data, d => d.questions_answered)]);

	  g.append("g")
	      .attr("class", "axis axis-x")
	      .attr("transform", `translate(0,${height})`)
	      .call(d3.axisBottom(x));

	  g.append("g")
	      .attr("class", "axis axis-y")
	      .call(d3.axisLeft(y).ticks(10).tickSize(8));

	  //two seperate bars for two parameters
	  g.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", d => x(d.day))
	      .attr("y", d => y(d.questions_answered))
	      .attr("width", x.bandwidth()/2)
	      .attr("height", d => height - y(d.questions_answered))
	      .attr("fill", "#ff8c1a");

	  g.selectAll(".rect")
	    .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", d => x(d.day) + x.bandwidth()/2)
	      .attr("y", d => y(d.questions_correct))
	      .attr("width", x.bandwidth()/2)
	      .attr("height", d => height - y(d.questions_correct))
	      .attr("fill", "#009900");     
	})
	.catch(err => {
	  svg.append("text")         
	        .attr("y", 20)
	        .attr("text-anchor", "left")  
	        .style("font-size", "20px") 
	        .style("font-weight", "bold")  
	        .text(`Couldn't open the data file: "${err}".`);
	});

//add legend
		  g.append('g')
		    .attr('transform', "translate(870, 10)")
		    .append('rect')
		    .attr('width', '15px')
		    .attr('height', '15px')
		    .attr('fill', '#ff8c1a');

		  g.append('g')
		    .attr('transform', "translate(870, 40)")
		    .append('rect')
		    .attr('width', '15px')
		    .attr('height', '15px')
		    .attr('fill', '#009900');

		  g.append("text")
		    .attr("y", 20)
		    .attr("x", 900)
		    .style("text-anchor" , "right")
		    .style("font-size", "12px")
		    .text("Answered");

		  g.append("text")
		    .attr("y", 50)
		    .attr("x", 900)
		    .style("text-anchor" , "right")
		    .style("font-size", "12px")
		    .text("Correct");
};



function loadParticipationUserGraph() { 
	document.getElementById("graphWrapper").style.top = "15%";

    var widtha = document.getElementById("graphWrapper").offsetWidth;
    var heighta = document.getElementById("graphWrapper").offsetHeight;
    console.log(widtha+" "+heighta);
    document.getElementById("graphWrapper").innerHTML=document.getElementById("graphWrapper").innerHTML+'<div  class="h-75 w-75"><svg width="'+widtha+'" height="'+heighta+'" id="svg1"></svg></div>';

	const svg     = d3.select("#svg1"),
	      margin  = {top: 20, right: 40, bottom: 60, left: 50},
	      width   = svg.attr("width") - margin.left - margin.right,
	      height  = svg.attr("height") - margin.top  - margin.bottom,
	      x       = d3.scaleBand().rangeRound([0, width]).padding(0.2),
	      y       = d3.scaleLinear().rangeRound([height, 0]),
	      g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

	    var dataAddress = "/api/dailyParticipationRates/"+your_user_id+" ";
		var layerURL = baseComputerAddress + dataAddress;

		d3.json(layerURL).then(data => {
			  data = data.array_to_json;
			  console.log(data);
		  	  x.domain(data.map(d => d.day));
			  y.domain([0, d3.max(data, d => d.questions_answered)]);

		  g.append("g")
		      .attr("class", "axis axis-x")
		      .attr("transform", `translate(0,${height})`)
		      .call(d3.axisBottom(x));

		  g.append("g")
		      .attr("class", "axis axis-y")
		      .call(d3.axisLeft(y).ticks(10).tickSize(8));

		  //two seperate bars for two parameters
		  g.selectAll(".bar")
		    .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", d => x(d.day))
		      .attr("y", d => y(d.questions_answered))
		      .attr("width", x.bandwidth()/2)
		      .attr("height", d => height - y(d.questions_answered))
		      .attr("fill", "#ff8c1a");

		  g.selectAll(".rect")
		    .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", d => x(d.day) + x.bandwidth()/2)
		      .attr("y", d => y(d.questions_correct))
		      .attr("width", x.bandwidth()/2)
		      .attr("height", d => height - y(d.questions_correct))
		      .attr("fill", "#009900");     
		})
		.catch(err => {
		  svg.append("text")         
		        .attr("y", 20)
		        .attr("text-anchor", "left")  
		        .style("font-size", "20px") 
		        .style("font-weight", "bold")  
		        .text(`Couldn't open the data file: "${err}".`);
		});

		//add legend
		  g.append('g')
		    .attr('transform', "translate(870, 10)")
		    .append('rect')
		    .attr('width', '15px')
		    .attr('height', '15px')
		    .attr('fill', '#ff8c1a');

		  g.append('g')
		    .attr('transform', "translate(870, 40)")
		    .append('rect')
		    .attr('width', '15px')
		    .attr('height', '15px')
		    .attr('fill', '#009900');

		  g.append("text")
		    .attr("y", 20)
		    .attr("x", 900)
		    .style("text-anchor" , "right")
		    .style("font-size", "12px")
		    .text("Answered");

		  g.append("text")
		    .attr("y", 50)
		    .attr("x", 900)
		    .style("text-anchor" , "right")
		    .style("font-size", "12px")
		    .text("Correct");
};




function closeGraph() { 
document.getElementById("graphWrapper").innerHTML = '<button type="button" style="position: absolute;right:10px;top:5px;" class="close" aria-label="Close" onclick="closeGraph();"><span  style="margin-right:10px;" aria-hidden="true">&times;</span></button>';
document.getElementById("graphWrapper").style.top = "-9999px"; 
};