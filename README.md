# vfdademo
Demo app for testing cool new technologies using NodeJS, Express, Angurlar and other ...

pre:
nodejs
npm
bower

npm init
npm install --save express
npm install --save-dev  grunt
npm install --save request


Grunt Scripts :
Grunt Scripts support the continuous integration, multiple tasks were designed and made available to Jenkins.
The implementation of tasks relies on a number of dependencies that can be loaded and installed using the following commands :
npm install grunt-contrib-copy --save-dev        // install contrib-copy
npm install grunt-contrib-clean --save-dev       // install contrib-clean
npm install grunt-contrib-compress --save-dev    // install contrib-compress
npm install grunt-mocha-test --save-dev          //install contrib-test   
npm install grunt-zip --save-dev                 // //install contrib-zip
npm install grunt-properties-reader --save-dev    // install properties-reader
npm install grunt-protractor-runner --save-dev    // install protractor-runner 

There are three main tasks that are exposed to Jenkins:

1-	buildTask 
This task makes the necessary directory clean up  and start the build , the archive file will be created and placed in the dist folder
Command : grunt buildTask

2-	unitTest
the task will run the unit test , please note that  the unit test is implemented by using Mocha Framework 
Command : grunt unitTest


1-	intergationTest
the task will run the integration test which is implemented by using Protractor Framework ,  a Framework that internally uses Selenium Server 
Command : grunt intergationTest

For API documentation generation we us http://apidocjs.com/.

<code>npm install apidoc -g</code>

<code>grunt apidoc</code>

Need Devops working
