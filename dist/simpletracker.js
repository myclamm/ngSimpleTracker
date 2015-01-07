angular.module('userTracker',[])
	.run(function(dataHandler){
		//Send user path history to server every 15 seconds
		setInterval(function(){
			dataHandler.sendToDatabase()
		},15000)
	})
	.provider('dataHandler',{
		//Allow developer to configure 'postRoute' via angular.module.config
		postRoute: '/addToPath',
		//Inject $http module and define Service Logic
		$get: function($http){
				var postRoute = this.postRoute;
				//These objects are used to save state during calls to the server, 
				//so we don't miss user events that occur DURING asynchronous requests
				var tempStorage = [];
				var eventsWhileSending = false;
				var currentlySending = false;
				//Expose the Service API
				return {
					//Clears user's path history
					clearStorage: function(){
						localStorage.setItem('trackedPath',[])
					},
					//Adds event to user's path history (invoked when DOM ele is clicked)
					addToPath: function(eventName,url){
						//If an event occurs DURING an unresolved server request,
						//save the event in temporary storage until later
						if(currentlySending){
							tempStorage.push({
								event: eventName,
								absUrl: url,
								date: new Date() 
							})
							eventsWhileSending = true;
						} else {	
							var tempArray = JSON.parse(localStorage.getItem('trackedPath')) || [];
							tempArray.push({
								event: eventName,
								absUrl: url,
								date: new Date() 
							})
							localStorage.setItem('trackedPath',JSON.stringify(tempArray));
						}
					},
					//Sends user's path history to database along with cookie data
					sendToDatabase: function(){
						console.log(postRoute,localStorage.getItem('trackedPath'))
						var userPath = localStorage.getItem('trackedPath')
						currentlySending = true;
						$http.post(postRoute,{
							path: userPath,
							sessionData: document.cookie,
						})
						.success(this.clearsUserPathButSavesEventsThatOccurredDuringAsyncCall)
						.error(this.doesNotClearUserPathIfTheresAnError)
					},
					//Callback for $http success 
					storesEventsThatOccurredDuringAsyncCall: function(data){
						this.clearStorage();
						if(eventsWhileSending){
							var eventsDuringAsyncCall = JSON.stringify(tempStorage)
							localStorage.setItem('trackedPath',eventsDuringAsyncCall)
							tempStorage = [];
						}
						currentlySending = false;
						eventsWhileSending = false;
					},
					//Callback for $http error
					doesNotClearUserPathIfTheresAnError: function(data,status){
						console.log('Error updating user path: ',data,status)
						if(eventsWhileSending){
							var tempArray = JSON.parse(localStorage.getItem('trackedPath')).concat(tempStorage)
							localStorage.setItem('trackedPath',JSON.stringify(tempArray))
							tempStorage = [];
						}
						currentlySending = false;
						eventsWhileSending = false;
					}
				}
			}
	})
	//Add the 'tracker' attribute on any HTML tag to begin tracking it as a 'click' event. 
	//Use the 'eventName=' attribute to name the event
	.directive('tracker',function($location,dataHandler){
		return {
			restrict: 'A',
			link: function(scope,ele,attrs,c){
				ele.bind('click',function(){
					dataHandler.addToPath(attrs.eventName,$location.absUrl());
				})
			}
		}
	})