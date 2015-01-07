angular.module('userTracker',[])
	.run(function(dataHandler){
		//Send user path history to server every 15 seconds
		setInterval(function(){
			dataHandler.sendToDatabase()
		},15000)
	})