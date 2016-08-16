module.exports = {
	getIndexForItem: function(item,collection){
		return getIndexForItem(item,collection);
	},
	splitTime: function(timeLine, splitOn){
		return splitTime(timeLine, splitOn);
	}
};

function getIndexForItem(item,collection){
	var i = 0;
	for(i = 0; i < collection.length; i++){
		if(collection[i] == item){
			return i;
		}
	}
}

function splitTime(timeLine,splitOn){
	var timeArray = timeLine.split(splitOn);
	timeArray[0] = timeArray[0].trim();
	timeArray[1] = timeArray[1].trim();
	return timeArray;
}

