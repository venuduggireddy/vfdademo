
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

describe('FDA Demo Integration Tests:', function () {
    'use strict';

    beforeEach(function () {
      // Load up a view and wait for it to be done with its rendering and epicycles.
      // return browser.ignoreSynchronization = true;
    });

    it('Verify navigation to Search Page', function () {
        browser.get('search/#/');
        var element = browser.findElement(by.css('[ng-click="searchData()"]'));
        expect(element.isDisplayed()).toBe(true);
        expect(element.getText()).toBe('Search');
    });


    it('Verify Search Criteria: Map View', function () {
	browser.get('search/#/');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.startDate'));
        expect(element.isDisplayed()).toBe(true);
 	var element = browser.findElement(by.model('searchCriteria.endDate'));
        expect(element.isDisplayed()).toBe(true);
	var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        expect(element.isDisplayed()).toBe(true);
    });

    it('Verify Search Results - Map View', function () {
	var searchString = 'cumin';

	browser.get('search/#/');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        element.sendKeys(searchString)

        var searchButton = browser.findElement(by.css('[ng-click="searchData()"]'));
        searchButton.click();

        browser.waitForAngular();
	var summary = browser.findElements(by.repeater('x in searchCriteria.selectedRecall'));

        console.log('Search String Entered ='+searchString);

     	summary.then(function(result){
            console.log('summary count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

	var natFoodNo = browser.findElement(by.binding('nationalFoodNumbers'));
	natFoodNo.getText().then(function (text) {
    		console.log('nationalFoodNumbers = '+ text);
		// expect(text).toBeGreaterThan(0);
		// expect(text).toNotEqual('[0]');
		expect(text).toNotBe(null);
	});

	var natDrugNo = browser.findElement(by.binding('nationalDrugNumbers'));
	natDrugNo.getText().then(function (text) {
    		console.log('nationalDrugNumbers = '+ text);
		// expect(text).toBeLessThan(1);
		// expect(text).toEqual('[0]');
		expect(text).toNotBe(null);
	});

	var natDeviceNo = browser.findElement(by.binding('nationalDeviceNumbers'));
	natDeviceNo.getText().then(function (text) {
    		console.log('nationalDeviceNumbers = '+ text);
		// expect(text).toBeLessThan(1);
		// expect(text).toEqual('[0]');
		expect(text).toNotBe(null);
	});

    });

    it('Verify Search - List View', function () {
	browser.get('search/#/listSearch');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.startDate'));
        expect(element.isDisplayed()).toBe(true);
 	var element = browser.findElement(by.model('searchCriteria.endDate'));
        expect(element.isDisplayed()).toBe(true);
	var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        expect(element.isDisplayed()).toBe(true);
    });


    it('Verify Search Results - List View', function () {
	var searchString = 'cumin';

	browser.get('search/#/listSearch');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        element.sendKeys(searchString);

        var searchButton = browser.findElement(by.css('[ng-click="searchData()"]'));
        searchButton.click();

        browser.waitForAngular();

        var statesSelected = browser.findElements(by.repeater('y in searchCriteria.states'));
        var recallItems = browser.findElements(by.repeater('x in searchCriteria.selectedRecall'));
	var serachResults = browser.findElements(by.repeater('y in products.results'));

        console.log('Search String Entered ='+searchString);

        statesSelected.then(function(result){
            console.log('States selected count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

        recallItems.then(function(result){
            console.log('Recall Type selected Count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

	serachResults.then(function(result){
            console.log('Search Result count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

	var totalCount = browser.findElement(by.binding('products.meta.results.total'));
	totalCount.getText().then(function (text) {
    		console.log('totalCount = '+ text);
		// expect(text).toNotEqual('[0]');
		expect(text).toNotBe(null);
	});

    });

});

