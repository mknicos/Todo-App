// Route, tasks.js//
'use strict';
var Task;

exports.create = function(req, res){
  init();

  var t1 = new Task(req.body);
  t1.save(function(){
    res.send(t1);
  });
};

exports.index = function(req, res){
  init();

  Task.findAll(function(records){
    res.send({tasks:records});
  });
};

exports.show = function(req, res){
  init();

  Task.findById(req.params.id, function(record){
    res.send(record);
  });
};

exports.destroy = function(req, res){
  init();

  Task.deleteById(req.params.id, function(count){
    res.send({count:count});
  });
};

exports.update = function(req, res){
  init();

  var t1 = new Task(req.body);
  t1.save(function(){
    res.send(t1);
  });
};

exports.filter = function(req, res){
  init();
  var limit = 5;
  if(req.query.isComplete === 'true'){
    req.query.isComplete = true;
  }else if(req.query.isComplete === 'false'){
    req.query.isComplete = false;
  }
  if(!req.query.limit){
    req.query.limit = limit;
  }
  if(!req.query.page){
    req.query.page = 1;
  }
  console.log('req.query:');
  console.log(req.query);
  Task.findByFilter(req.query, function(records){
    res.send({tasks:records});
  });
};

function init(){
  Task = global.nss.Task;
}
