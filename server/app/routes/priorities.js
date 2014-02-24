'use strict';

var Priority;

exports.create = function(req, res){
  Priority = global.nss.Priority;

  var p1 = new Priority(req.body);
  p1.save(function(){
    res.send(p1);
  });
};

exports.index = function(req, res){
  Priority = global.nss.Priority;

  Priority.findAll(function(records){
    res.send({priorities:records});
  });
};

exports.show = function(req, res){
  Priority = global.nss.Priority;

  Priority.findByID(req.params.id, function(record){
    res.send(record);
  });
};

exports.update = function(req, res){
  Priority = global.nss.Priority;
  console.log('REQ.BODY>>>>>>');
  console.log(req.body);

  var priority = new Priority(req.body);
  console.log(req.body);
  console.log('req.body ^^^^^^^');
  priority.save(function(){
    res.send(priority);
  });
};

exports.destroy = function(req, res){
  Priority = global.nss.Priority;

  Priority.deleteByID(req.params.id, function(count){
    res.send({count:count});
  });
};
