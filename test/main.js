describe('Simple Tracker', function(){
	var ele, scope, dataHandler;
	beforeEach(module('userTracker'));
	beforeEach(inject(function($compile, $rootScope,_dataHandler_){
		var store = {}
		scope = $rootScope;
		dataHandler = _dataHandler_
		spyOn(dataHandler,'addToPath')
		spyOn(localStorage,'getItem').and.callFake(function(key){
			return store[key];
		})
		spyOn(localStorage,'setItem').and.callFake(function(key){
			return store[key] = value+'';
		})
		ele = jQuery("<div tracker eventname='billy'></div>");
		$compile(ele)(scope);
		scope.$apply();
	}))

	it('should invoke addToPath', function(){
		ele.click()
		expect(dataHandler.addToPath).toHaveBeenCalled()
	})

	it('should set localStorage', function(){
		ele.click()
		// var eventName = localStorage.getItem('trackedPath')
		expect(localStorage.setItem).toHaveBeenCalled()
		// localStorage.setItem('trackedPath',[])
	})
})