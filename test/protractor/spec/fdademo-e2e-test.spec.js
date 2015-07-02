
//Developers : Anush Varma
//File : Protractor Spec File
//Version : 1.0.0
//Date : 06/24/2015


/*global
 beforeEach: false,
 browser: false,
 by: false,
 describe: false,
 expect: false,
 it: false,
 protractor: false
 */

describe('FDA Demo Integration Tests: Test Suite 1', function () {
    beforeEach(function () {
	return browser.ignoreSynchronization = true;
    });

    it('Verify navigation to Home Page', function () {
	browser.get('');
    });
});


describe('FDA Demo Integration Tests: Test Suite 2', function () {
    'use strict';

    beforeEach(function () {
	browser.ignoreSynchronization = false;	
    });

   it('Verify navigation to Map View', function () {
        browser.get('search/#/');
	var natFoodNo = browser.findElement(by.binding('nationalFoodNumbers'));
	natFoodNo.getText().then(function (text) {
    		console.log('nationalFoodNumbers = '+ text);
		expect(text).toNotBe(null);
	});

	var natDrugNo = browser.findElement(by.binding('nationalDrugNumbers'));
	natDrugNo.getText().then(function (text) {
    		console.log('nationalDrugNumbers = '+ text);
		expect(text).toNotBe(null);
	});

	var natDeviceNo = browser.findElement(by.binding('nationalDeviceNumbers'));
	natDeviceNo.getText().then(function (text) {
    		console.log('nationalDeviceNumbers = '+ text);
		expect(text).toNotBe(null);
	});
    });

    it('Verify navigation to List View', function () {
        browser.get('search/#/listSearch');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        expect(element.getText()).toBe('');

        browser.findElements(by.repeater('y in searchCriteria.states')).then(function(states) {
	    var noOfStates = states.length;
	    console.log(noOfStates);
	    expect(noOfStates).toBeGreaterThan(0);
   
	});
        
    });

});

