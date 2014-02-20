/* jshint unused:false */
'use strict';

module.exports = Task;
var tasks = global.nss.db.collection('tasks');
var Mongo = require('mongodb');

function Task(task){
  this._id = task._id;
  this.name = task.name;
  this.dueDate = task.dueDate;
  this.isComplete = task.isComplete || false;
  this.tags = task.tags || [];
  this.priority = task.priority;
}

Task.prototype.save = function(fn){
  var self = this;
  tasks.save(self, function(err, record){
    fn(err);
  });
};

Task.findAll = function(fn){
  tasks.find().toArray(function(err,records){
    fn(records);
  });
};

Task.findById = function(Id,fn){
  var _id = Mongo.ObjectID(Id);
  tasks.findOne({_id:_id}, function(err,record){
    fn(record ? new Task(record) : null);
  });
};

Task.findByComplete = function(bool, fn){
  tasks.find({isComplete:bool}).toArray(function(err,records){
    fn(records);
  });
};


Task.findByPriority = function(priorityId, fn){
  tasks.find({priority:priorityId}).toArray(function(err,records){
    fn(records);
  });
};

Task.deleteById = function(Id, fn){
  var _id = Mongo.ObjectID(Id);
  tasks.remove({_id:_id}, function(err,count){
    fn(count);
  });
};

Task.findByTag = function(tag, fn){
  tasks.find({tags: tag}).toArray(function(err, records){
    fn(records);
  });
};
