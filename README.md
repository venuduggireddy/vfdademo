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


Grunt Scripts :</br>
Grunt Scripts support the continuous integration, multiple tasks were designed and made available to Jenkins.
The implementation of tasks relies on a number of dependencies that can be loaded and installed using the following commands </br>
 <code>npm install grunt-contrib-copy --save-dev</code>        // install contrib-copy </br>
 <code>npm install grunt-contrib-clean --save-dev </code>      // install contrib-clean </br>
 <code>npm install grunt-contrib-compress --save-dev </code>   // install contrib-compress </br>
 <code>npm install grunt-mocha-test --save-dev </code>          //install contrib-test  </br> 
 <code>npm install grunt-zip --save-dev </code>                 //install contrib-zip  </br>
 <code>npm install grunt-properties-reader --save-dev </code>    // install properties-reader </br>
 <code>npm install grunt-protractor-runner --save-dev </code>    // install protractor-runner </br>
 
There are three main tasks that are exposed to Jenkins: </br>
1-	buildTask : <code> grunt buildTask</code> </br>
This task does the clean up, creates the necessary directories and starts the build ,then once the archive file is created it will be placed in the dist folder </br>
 
2-	unitTest : <code> grunt unitTest </code> </br>
the task will run the unit test , please note that  the unit test is implemented by using Mocha Framework </br>



3-	intergationTest : <code> grunt intergationTest </code> </br>
the task will run the integration test which is implemented by using Protractor Framework ,  a Framework that internally uses Selenium Server</br>
 

For API documentation generation we us http://apidocjs.com/.

<code>npm install apidoc -g</code>

<code>grunt apidoc</code>

Need Devops working
