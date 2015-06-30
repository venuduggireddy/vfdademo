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
 <code>npm install grunt-contrib-copy --save-dev</code>        // install contrib-copy
 <code>npm install grunt-contrib-clean --save-dev </code>      // install contrib-clean
 <code>npm install grunt-contrib-compress --save-dev </code>   // install contrib-compress
 <code>npm install grunt-mocha-test --save-dev </code>          //install contrib-test   
 <code>npm install grunt-zip --save-dev </code>                // //install contrib-zip
 <code>npm install grunt-properties-reader --save-dev </code>    // install properties-reader
 <code>npm install grunt-protractor-runner --save-dev </code>    // install protractor-runner 
 
There are three main tasks that are exposed to Jenkins:
1-	buildTask 
This task makes the necessary directory clean up  and start the build , the archive file will be created and placed in the dist folder
<code> grunt buildTask</code>

2-	unitTest
the task will run the unit test , please note that  the unit test is implemented by using Mocha Framework 
<code> grunt unitTest </code>


1-	intergationTest
the task will run the integration test which is implemented by using Protractor Framework ,  a Framework that internally uses Selenium Server 
<code> grunt intergationTest </code>

For API documentation generation we us http://apidocjs.com/.

<code>npm install apidoc -g</code>

<code>grunt apidoc</code>

Need Devops working
