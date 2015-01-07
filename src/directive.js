//Add the 'tracker' attribute on any HTML tag to begin tracking it as a 'click' event. 
//Use the 'eventName=' attribute to name the event
App.directive('tracker',function($location,dataHandler){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs,c){
			ele.bind('click',function(){
				dataHandler.addToPath(attrs.eventName,$location.absUrl());
			})
		}
	}
})