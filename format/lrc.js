module.exports = {
	c_srt_lrc: function(fileContents,convertOptions){
		return c_srt_lrc(fileContents,convertOptions);
	},
	c_srt_lrc_time: function(inputLine){
		return c_srt_lrc_time(fileContents);
	},
	c_lrc_generic: function(fileContents,convertOptions){
		return c_lrc_generic(fileContents,convertOptions);
	}
};

var utils = require("../utils");
var srt = require("./srt");


// Convert SRT to LRC
function c_srt_lrc(fileContents,convertOptions){
	var insertDummy = convertOptions.get_lrc_dummyforempty();
	
	var inputLines = fileContents.split("\n");
	var timeLines = [];
	var outputLines = [];
	
	for(i = 0; i < inputLines.length; i++){
		if(inputLines[i].indexOf("-->") > -1)
			timeLines.push(inputLines[i]);
	}
	
	outputLines.push("[00:00.000] ~");
	
	var i = 0;
	for(i = 0; i < inputLines.length; i++){
		if(inputLines[i].indexOf("-->") == -1)
			continue;
		
		//console.log("begintime is " + srt.srt_begin_time(inputLines[i]));
		//console.log("parsed time is " + c_srt_lrc_time(srt.srt_begin_time(inputLines[i])));
		var outputLine = c_srt_lrc_time(srt.srt_begin_time(inputLines[i]));
		
		var lineCounter = 1;
		while(isNaN(inputLines[i+lineCounter]) && inputLines[i+lineCounter] != undefined){
			outputLine += " " + inputLines[i+lineCounter];
			lineCounter++;
			
			if(lineCounter > 50){
				console.error("lrc.js: unable to convert file. Is the input file malformed?");
				return;
			}
		}
		outputLines.push(outputLine);
		
		// check if there is missing time in between
		var timeLineIndex = utils.getIndexForItem(inputLines[i], timeLines);
		if(timeLineIndex + 1 < timeLines.length){
			// a next timeline exists
			if(srt.srt_end_time(timeLines[timeLineIndex]) != srt.srt_begin_time(timeLines[timeLineIndex + 1])){
				outputLine = c_srt_lrc_time(srt.srt_end_time(timeLines[timeLineIndex])) + " ~";
				outputLines.push(outputLine);
			}
			
		}
		
	}
	return outputLines.join("\n");
}

// Convert SRT time to LRC time
function c_srt_lrc_time(timeOnly){
	var time = timeOnly.replace(",", ".");
	time = time.substring(3);
	time = "[" + time + "]";
	return time;
}

// Convert LRC time to generic time
// timeOnly = one part (beginning or end)
function c_lrc_generic_time(inputLine){
	var endOfTimeIndex = inputLine.indexOf("]");
	var timeOnly = "00:" + inputLine.substring(1, endOfTimeIndex);
	return timeOnly;
}

function c_srt_lrc_text(inputLine){
	var endOfTimeIndex = inputLine.indexOf("]");
	return inputLine.substring(endOfTimeIndex+1).trim();
}

// TODO: guess a proper end time
//////////////////////////////////////////
function c_lrc_generic(fileContents,convertOptions){
	var inputLines = fileContents.split("\n");
	var outputLines = [];
	var timeLineCounter = 0;
	var nextTime = "";
	var i = 0;
	for(i = 1; i < inputLines.length; i++){
		if(inputLines[i].indexOf("[") == -1){
			// just copy everything that is not preceded by a time
			outputLines.push(c_srt_lrc_text(inputLines[i]));
			continue;
		}
				
		timeLineCounter++;
		var cleanText = c_srt_lrc_text(inputLines[i]);
		
		if(cleanText == "~")
			continue;
		
		if(timeLineCounter > 1)
			outputLines.push("");
		outputLines.push(timeLineCounter);
		// make SRT time format
		try{
			nextTime = c_lrc_generic_time(inputLines[i+1]);
		}catch(e){
			nextTime = addSeconds(c_lrc_generic_time(inputLines[i]), 4);
		}
		outputLines.push(c_lrc_generic_time(formatTime(inputLines[i])) + " --> " + formatTime(nextTime));
		outputLines.push(c_srt_lrc_text(inputLines[i]));
	}
	return outputLines.join("\n");
}

function addSeconds(time, numberOfSeconds){
	var timeSplit = time.split(":");
	
	var numberOfMinutes = 0; // number of minutes to add
	var numberOfHours = 0; // number of hours to add
	
	if(timeSplit.length == 3){
		// includes hours
		var seconds = parseTimePartAsInt(timeSplit[2]);
		seconds += numberOfSeconds;
		if(seconds >= 59){
			numberOfMinutes = seconds / 60;
			seconds = seconds % 60;
		}
				
		var minutes = parseTimePartAsInt(timeSplit[1]);
		minutes += numberOfMinutes;
		if(minutes >= 59){
			numberOfHours = minutes / 60;
			minutes = minutes % 60;
		}
		
		var hours = parseTimePartAsInt(timeSplit[0]);
		if(hours + numberOfHours > 99){
			console.warn("WARN lrc.js addSeconds: number of hours is greater than 99");
		}else{
			hours += numberOfHours;
		}
		return padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
	}
	if(timeSplit.length == 2){
		// no hours
	}
	return timeSplit.length;
	
}

function parseTimePartAsInt(timePart){
	if(timePart.indexOf("0") == 0){
		return parseInt(timePart.substring(1));
	}
	return parseInt(timePart);
}

function padZero(timePart){
	var timePartText = timePart+"";
	if(timePartText.length == 1)
		timePartText = "0"+timePartText;
		
	return timePartText;
}

function formatTime(time){
	
		
	if(time.indexOf(".") > -1){
		time = time.replace(".", ",");
	}
	
	if(time.indexOf(",") == -1){
		time += ",000";
	}
	
	return time;
}
