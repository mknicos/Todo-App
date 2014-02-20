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

function init(){
  Task = global.nss.Task;
}
