#!/usr/bin/env node
var lrc_dummyforempty = false;
var webvtt_linenumbers = false;

function ConvertOptions(argument) {
	if(!argument)
		return;

  lrc_dummyforempty = argument.indexOf("lrc_dummyforempty") != -1;
  webvtt_linenumbers = argument.indexOf("webvtt_linenumbers") != -1;
}

ConvertOptions.prototype.get_lrc_dummyforempty= function(){
	return lrc_dummyforempty;
}

ConvertOptions.prototype.get_webvtt_linenumbers= function(){
	return webvtt_linenumbers;
}

module.exports = ConvertOptions;