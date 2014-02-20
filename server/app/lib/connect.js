'use strict';
var isInitialized = false;
//mongoClient exports a function that calls back when connection is made
var mongoClient = require('./mongodb-connection-pool');

module.exports = function(req,res,next){
  if(!isInitialized){
    isInitialized = true;
    //process.env.DBNAME is a variable for on-the-fly DB changes
    mongoClient(process.env.DBNAME, function(){
      next();
    });
  }else{
    //next call in app.js pipeline
    next();
  }
};
