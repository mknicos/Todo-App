/*jshint unused:false */
'use strict';

module.exports = Priority;
var priorities = global.nss.db.collection('priorities');
var Mongo = require('mongodb');

function Priority(priority){
  this._id = priority._id;
  this.name = priority.name;
  this.value = parseInt(priority.value);
}

Priority.prototype.save = function(fn){
  var self = this;
  if(self._id){
    priorities.save(self, function(err, record){
      fn(err);
    });
  }else{
    Priority.findByName(this.name, function(priority){
      if(!priority){
        priorities.save(self, function(err,record){
          fn(err);
        });
      }else{
        fn(new Error('Duplicate Factory'));
      }
    });
  }
};

Priority.findAll = function(fn){
  priorities.find().toArray(function(err,records){
    fn(records);
  });
};

Priority.findByName = function(name,fn){
  priorities.findOne({name:name}, function(err,record){
    fn(record ? new Priority(record) : null);
  });
};

Priority.findByID = function(ID,fn){
  var _id = Mongo.ObjectID(ID);
  priorities.findOne({_id:_id}, function(err,record){
    fn(record ? new Priority(record) : null);
  });
};

Priority.deleteByID = function(id, fn){
  var _id = Mongo.ObjectID(id);
  priorities.remove({_id:_id}, function(err, count){
    fn(count);
  });
};
