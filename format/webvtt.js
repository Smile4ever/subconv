module.exports = {
	c_srt_webvtt: function(fileContents,convertOptions){
		return c_srt_webvtt(fileContents,convertOptions);
	},
	c_srt_webvtt_time: function(inputLine){
		return c_srt_webvtt_time(fileContents);
	},
	c_webvtt_generic: function(fileContents,convertOptions){
		return c_webvtt_generic(fileContents,convertOptions);
	}
};

var srt = require("./srt");
var utils = require("../utils");

// Convert SRT to WebVTT
function c_srt_webvtt(fileContents,convertOptions){
	var webvtt_linenumbers = convertOptions.get_webvtt_linenumbers();
	
	var inputLines = fileContents.split("\n");
	var outputLines = [];
	outputLines.push("WebVTT");
	
	var i = 0;
	for(i = 0; i < inputLines.length; i++){
		if(inputLines[i].indexOf("-->") == -1){
			if(webvtt_linenumbers || (!webvtt_linenumbers && isNaN(inputLines[i]))){
				outputLines.push(c_srt_webvtt_text(inputLines[i]));
			}
			continue;
		}
		
		outputLines.push("");
		// make WebVTT time format
		var outputLine = c_srt_webvtt_time(srt.srt_begin_time(inputLines[i])) + " --> " + c_srt_webvtt_time(srt.srt_end_time(inputLines[i]));
		outputLines.push(outputLine);
	}
	outputLines.push("");
	return outputLines.join("\n");
}

// Convert SRT time to WebVTT time
function c_srt_webvtt_time(inputLine){
	var time = inputLine.replace(/,/g, '.').substring(3);
	return time;
}

// Convert WebVTT time to generic time
function c_webvtt_generic_time(inputLine){
	var time = "00:" + inputLine.replace(/\./g, ',');
	return time;
}

// Convert SRT text to WebVTT text (including markup)
function c_srt_webvtt_text(inputLine){
	return inputLine; // TODO: strip/convert markup
}

////////////////////////////////////////////////////////////////////
// right now, generic is just SRT
// This will change in the future
function c_webvtt_generic(fileContents,convertOptions){
	var inputLines = fileContents.split("\n");
	var outputLines = [];
	var timeLineCounter = 0;
		
	var i = 0;
	for(i = 1; i < inputLines.length; i++){
		if(inputLines[i].indexOf("-->") == -1){
			if(isNaN(inputLines[i])){
				if(inputLines[i] != ""){
					outputLines.push(c_srt_webvtt_text(inputLines[i]));
				}
			}
			continue;
		}
		
		
		timeLineCounter++;
		if(timeLineCounter > 1)
			outputLines.push("");
		outputLines.push(timeLineCounter);
		// make SRT time format
		var timeArray = utils.splitTime(inputLines[i], "-->");
		var outputLine = c_webvtt_generic_time(timeArray[0]) + " --> " + c_webvtt_generic_time(timeArray[1]);
		outputLines.push(outputLine);
	}
	return outputLines.join("\n");
}
