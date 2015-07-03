### Applicaiton is build using [NodeJS](https://nodejs.org/), [Express](http://expressjs.com/), [Angurlar](https://angular.io/),[Grunt](http://gruntjs.com/), [Protractor](https://angular.github.io/protractor/#/),[Selenium](http://www.seleniumhq.org/), [Mocha](http://mochajs.org/)  and other ...

Instruction to install and run applicaiton on other mechine

Prerequisites is to install NodeJS (min version 0.10.18) on operation system. 

<code>
git clone https://github.com/venuduggireddy/vfdademo.git vfdademo
cd vfdademo
node app.js // default port is 80
</code>

To run the app in a different port 


### [Grunt](http://gruntjs.com/) Tasks:

Grunt Scripts support the continuous integration, multiple tasks were designed and made available to Jenkins; like buildTask, unitTest, integrationTest ... The implementation of tasks requires a number of dependencies that can be loaded and installed using the following commands : </br>
 
 <code>npm install grunt-contrib-copy --save-dev</code>        // install contrib-copy </br>
 <code>npm install grunt-contrib-clean --save-dev </code>      // install contrib-clean </br>
 <code>npm install grunt-contrib-compress --save-dev </code>   // install contrib-compress </br>
 <code>npm install grunt-mocha-test --save-dev </code>          //install contrib-test  </br> 
 <code>npm install grunt-zip --save-dev </code>                 //install contrib-zip  </br>
 <code>npm install grunt-properties-reader --save-dev </code>    // install properties-reader </br>
 <code>npm install grunt-protractor-runner --save-dev </code>    // install protractor-runner </br>
 
 ### Following Grunt tasks are availabe
  
These are the main tasks that are exposed to Jenkins: </br>
* buildTask : <code> grunt buildTask</code> </br>
This task does the clean up, creates the necessary directories and starts the build ,then once the archive file is created it will be placed in the dist folder </br>
 
* unitTest : <code> grunt unitTest </code> </br>
the task will run the unit test , please note that  the unit test is implemented by using [Mocha Framework](http://mochajs.org/) </br>

* intergationTest : <code> grunt intergationTest </code> </br>
the task will run the integration test which is implemented by using [Protractor Framework](https://angular.github.io/protractor/#/) ,  a Framework that internally uses [Selenium](http://www.seleniumhq.org/) Server</br>
 

For generating API doucumentation we used [apidocjs](http://apidocjs.com/)

<code>npm install apidoc -g</code>

<code>grunt apidoc</code>


