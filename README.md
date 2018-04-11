# GT ThriftShop RESTful Web Service (Back End)

## Release Notes - Version 1.0:

### New Features:

* User Interface has been overhauled to make it more responsive (support more screen sizes)
* Users can now explicitly make an offer on an item listing
* A new settings screen allows users to unblock users that they have previously blocked
* Item listings can now have multiple images
* The item listings feed can now be filtered by category
* Users can now manage and close their listings

### Bug Fixes

None

### Known Bugs and Defects

None

## Install Guide

### Pre-requisites

* Node.js is needed to run the project. The node installer can be downloaded at https://nodejs.org/en/download/
* The project also needs a MongoDB database to connect to
  * For running locally, the free community server can be downloaded at https://www.mongodb.com/download-center#community
  * For production, you can use MongoDB Atlas, https://www.mongodb.com/cloud/atlas
* You will need a Gmail account that will be used to send account verification and password reset emails. You can create one at https://accounts.google.com/SignUp?hl=en

### Dependencies

Node Package Manager handles all of this project's dependencies. Running "npm install" in the main project directory will automatically install all neccesary dependencies.

### Download Instructions

* The code can be downloaded as a .zip from the project's repository at https://github.com/matthewkohlhaas/GTThriftShopWS
\
* This project's repository can also be cloned by running "git clone https://github.com/matthewkohlhaas/GTThriftShopWS.git"
* If you don't have git, an installer can be downloaded at https://git-scm.com/downloads

### How to Run Locally

* Before running the Web Service, an isnatnace of MongoDB must be running
* Run "mongod.exe" (it should be located in C:\Program Files\MongoDB\Server\3.6\bin or wherever you installed it)
* The MongoDB database server should now be running locally on your machine at the default port, 27017
* Open a terminal in the main project directory and run "npm install" (This only has to be done once)
* In the same terminal run "node server"
* The web server should now be running locally at http://localhost:1337

* With the database running, You can manage its contents easily using MongoDB Compass which can be downloaded at https://www.mongodb.com/download-center#compass
* With the web service running, you can make HTTP requests to it using Postman whcih can be downloaded at https://www.getpostman.com/apps

### How to Prepare the Project for Deployment

First, you must set the variables in "config/env/production.js." This lets the web service know information specific to deployment. Set "port" to the port number that this web service will be running on when deployed, eg. 1337. Next, you must set "db" to the address that your MongoDB will be running from, eg. 'mongodb://db1.example.net:27017.' More information about setting this string can be found at https://docs.mongodb.com/manual/reference/connection-string/. Finally, you must set "uiUrl" to the URL that the user interface application will be deplyed to, eg. 'gtthriftshop.com' (do not include 'https://' or a '/' at the end).

The next thing that has to be done is setting up the secret configuration file. This will contain sensitive information that is specific to deployment. First, make a copy of "secret.config.sample.json" and rename it to "secret.config.json." In this file, set "secret" to any lengthy string of characters and/or symbols of your choice. This will be used when encrypting/decryrpting information to make it more secure. Next, set "emailUsername" and "emailPassword" to the email address and the password of the gmail account that will be used to send account verification and password reset emails. In order for the Gmail account to be able to send automated emails you must visit https://myaccount.google.com/lesssecureapps and allow less secure apps.

Before deploying the project, it needs a MongoDB database to connect to. The easist way to do this is through MongoDB's atlas service at https://www.mongodb.com/cloud/atlas. A comprohensive offical guide for MongoDB Atlas can be found at https://docs.atlas.mongodb.com/getting-started/.

### How to Deploy

To deploy the project, you can use a cloud platform such as Amazon AWS or Heroku. Heroku has an official step-by-step guide for deploying using the platform. It can be found at https://devcenter.heroku.com/articles/getting-started-with-nodejs. A similar tutorial for deploying to AWS EC2 can be found at https://devcenter.heroku.com/articles/getting-started-with-nodejs.

### Troubleshooting

When running the web service, you may encounter the error message, "Error: Cannot find module." Make sure to install all neccesary dependencies by opening a terminal in the main project directory and running "npm install." If the problem persists, delete the folder, "Node Modules," if it exists and try again.

If your Gmail account is failing to send automated emails for this web service, make sure that you have enabled less secured apps at https://myaccount.google.com/lesssecureapps.
