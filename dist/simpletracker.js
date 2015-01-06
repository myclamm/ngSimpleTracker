angular.module('userTracker',[])
	.run(function(dataHandler){
		setInterval(function(){
			dataHandler.sendToDatabase()
		},15000)
	})
	.provider('dataHandler',{
		postRoute: '/addToPath',
		$get: function($http){
				var postRoute = this.postRoute;
				var tempStorage = []
				var eventsWhileSending = false;
				var currentlySending = false;
				return {
					clearStorage: function(){
						localStorage.setItem('trackedPath',[])
					},
					addToPath: function(trackname,url){
						if(currentlySending){
							//add to tempStorage
							tempStorage.push({
								event: trackname,
								absUrl: url,
								date: new Date() 
							})
							eventsWhileSending = true;
						} else {	
							var tempArray = JSON.parse(localStorage.getItem('trackedPath')) || [];
							tempArray.push({
								event: trackname,
								absUrl: url,
								date: new Date() 
							})
							localStorage.setItem('trackedPath',JSON.stringify(tempArray));
						}
					},
					sendToDatabase: function(){
						console.log(postRoute,localStorage.getItem('trackedPath'))
						var userPath = localStorage.getItem('trackedPath')
						currentlySending = true;
						$http.post(postRoute,{
							path: userPath,
							sessionData: document.cookie,
						})
						.success(this.storesEventsThatOccurredDuringAsyncCall)
						.error(this.doesNotClearUserPathIfTheresAnError)
					},
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
	.directive('tracker',function($location,dataHandler){
		return {
			restrict: 'A',
			link: function(scope,ele,attrs,c){
				ele.bind('click',function(){
					dataHandler.addToPath(attrs.trackname,$location.absUrl());
					// console.dir(localStorage.getItem('trackedPath'))
					// dataHandler.sendToDatabase()
				})
			}
		}
	})