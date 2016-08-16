#!/usr/bin/env node
var program = require('commander');
var currentFile = "";
var debug = true;
var lrc_insertdummyforempty = false;
var ConvertOptionsJS = require('./ConvertOptions');
var convertOptions = null;
var noOutput = false;

var version = "0.0.1";

program
  .version(version)
  .arguments('<file>')
  .option('-f, --format <format>', 'Mandatory. Output format.')
  .option('-c, --convertoptions <convertoptions>', 'Convert options.')
  .option('-p, --profile <profile>', 'Profile of the output format (version and supported features). If the profile is not specified, the version with the least features is selected.')
  .option('-d, --direct', 'Direct saving.')
  .action(function(file) {
	main(file);
  });
  
program.on('--help', function(){
	console.log("Supported file formats are:");
	console.log("");
	console.log("File format\t\tFile extension\tProfiles");
	console.log("lrc / LyRiCs\t\t.lrc\t\tlrc, lrc-id, lrc-sfe (Walaoke), lrc-ef (A2 Media Player)");
	console.log("SubRip \t\t\t.srt\t\tsrt, subrip-markup");
	console.log("WebVTT \t\t\t.vtt / .srt\twebvtt");

	console.log("");
	console.log("Available convert options:");
	console.log("");
	console.log("lrc_dummyforempty\tInsert empty line between subtitles if there is a pause");
	console.log("webvtt_linenumbers\tPass this option to include line numbers in WebVTT files");
});
  
program.parse(process.argv);

// start point of our application
function main(file){
	console.warn("subconv " + version);
	console.warn("");
	
	var format = program.format;
		
	convertOptions = new ConvertOptionsJS(program.convertoptions);
	currentFile = file;
	readFile(file);
}

function switchConvert(err, fileContents){
	if(err){
		if(debug)
			return console.log(err);
		return console.log("WARNING: Could not read file %s", currentFile);
	}
	var inputFormat = getInputFormat();
	var outputFormat = getOutputFormat();
	
	// TODO: internal representation of the data that is contained in the file format
	
	showDebug("Converting " + currentFile);
	showDebug("Input format: " + inputFormat);
	if(inputFormat == "srt"){
		console.warn("Using the default SubRip parser without profiles.");
	}
	
	switch(inputFormat.toLowerCase()){
		case "lrc":
		case "lyrics":
			var format_lrc = require('./format/lrc');
			fileContents = format_lrc.c_lrc_generic(fileContents,convertOptions);
			break;
		case "vtt":
		case "webvtt":
			var format_webvtt = require('./format/webvtt');
			fileContents = format_webvtt.c_webvtt_generic(fileContents, convertOptions);
		default:
			break;
	}
	
	showDebug("Output format: " + outputFormat);
	switch(outputFormat.toLowerCase()){
		case "lrc":
		case "lyrics":
			var format_lrc = require('./format/lrc');
			handleResult(format_lrc.c_srt_lrc(fileContents,convertOptions));
			break;
		case "vtt":
		case "webvtt":
			var format_webvtt = require('./format/webvtt');
			handleResult(format_webvtt.c_srt_webvtt(fileContents,convertOptions));
			break;
		case "srt":
		case "subrip":
			handleResult(fileContents);
			break;
		default:
			break;
	}
}

///////////////////////////////////////////////////
// File System
///////////////////////////////////////////////////

function readFile(file){
	var fs = require('fs')
	fs.readFile(file, 'utf8', switchConvert);
}

function writeFile(file, fileContents){
	var fs = require('fs');
	
	fs.writeFile(file, fileContents, function(err) {
		if(err) {
			return console.log(err);
		}

		//console.log("The file was saved!");
	}); 
}

///////////////////////////////////////////////////
// Handle output
///////////////////////////////////////////////////
function handleResult(result){
	var outputFileName = getOutputFileName();
	
	if(outputFileName != ""){
		writeFile(outputFileName, result);
	}else{
		if(!noOutput){
			console.log(result);
		}
	}
}
function showDebug(debugInformation){
	if(debug){
		console.warn(debugInformation);
	}
}

///////////////////////////////////////////////////
// "Simple" getters
///////////////////////////////////////////////////
function getInputFormat(){
	var lastDot = currentFile.lastIndexOf(".");
	var extension = currentFile.substring(lastDot + 1);
	return extension;
}

function getOutputFormat(){
	return program.format;
}

function isDirect(){
	return program.direct == true;
}

function getOutputFileName(){
	if(isDirect()){
		var lastDot = currentFile.lastIndexOf(".");
		var outputFileName = currentFile.substring(0, lastDot + 1) + getOutputFormat(); // include the dot
		outputFileName = outputFileName.replace(".en.", ".");
		outputFileName = outputFileName.replace(".en-part.", ".");
		return outputFileName;
	}else{
		return "";
	}
}
