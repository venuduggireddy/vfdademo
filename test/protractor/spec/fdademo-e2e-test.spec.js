
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
	browser.get('search/#/');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        element.sendKeys('pain')

        var searchButton = browser.findElement(by.css('[ng-click="searchData()"]'));
        searchButton.click();

        browser.waitForAngular();
	var serachResults = browser.findElements(by.repeater('y in searchCriteria.selectedRecall'));

        console.log('Search String Entered = Pain');

     	serachResults.then(function(result){
            console.log('Search Result count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

    });

    it('Verify Search - List View: List View', function () {
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
	browser.get('search/#/listSearch');
	browser.waitForAngular();
        var element = browser.findElement(by.model('searchCriteria.keyTerm'));
        element.sendKeys('pain')

        var searchButton = browser.findElement(by.css('[ng-click="searchData()"]'));
        searchButton.click();

        browser.waitForAngular();

        var statesSelected = browser.findElements(by.repeater('y in searchCriteria.states'));
        var recallItems = browser.findElements(by.repeater('x in searchCriteria.selectedRecall'));
	var serachResults = browser.findElements(by.repeater('y in products.results'));

        console.log('Search String Entered = Pain');

        statesSelected.then(function(result){
            console.log('State selected count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

        recallItems.then(function(result){
            console.log('Reaction items count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

	serachResults.then(function(result){
            console.log('Search Result count ='+result.length);
            expect(result.length).toBeGreaterThan(0);
        });

    });

});

