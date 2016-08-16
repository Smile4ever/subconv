module.exports = {
	srt_end_time: function(timeLine){
		return srt_end_time(timeLine);
	},
	srt_begin_time: function(timeLine){
		return srt_begin_time(timeLine);
	}
};

function srt_end_time(timeLine){
	var indexOfSeperator = timeLine.indexOf("-->");
	var time = timeLine.substring(indexOfSeperator + 4).trim();
	return time;
}

function srt_begin_time(timeLine){
	var indexOfSeperator = timeLine.indexOf("-->");
	var time = timeLine.substring(0, indexOfSeperator).trim();
	return time;
}
