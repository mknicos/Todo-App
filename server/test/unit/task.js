/* jshint expr: true */
/*globals before, beforeEach: true */
'use strict';

var expect = require('chai').expect;
var Priority, p1, p2, p3, Task, obj1, obj3, obj2;



describe('Task', function(){
  before(function(done){
    var connect = require('../../app/lib/mongodb-connection-pool');
    connect('todo-test', function(){
      Task = global.nss.Task;
      Priority = global.nss.Priority;
      done();
    });
  });

  beforeEach(function(done){
    p1 = new Priority({name:'High', value:10});
    p2 = new Priority({name:'Low', value:3});
    p3 = new Priority({name:'Medium', value:5});
    global.nss.db.dropDatabase(function(err, result){
      p1.save(function(){
        p2.save(function(){
          p3.save(function(){
            var ID1 = p1._id.toString();
            var ID2 = p2._id.toString();
            var ID3 = p3._id.toString();
            obj1 = {name:'laundry', dueDate: '2014-02-25', isComplete: false, tags: ['home', 'shopping'], priority: ID1};
            obj2 = {name:'trash', dueDate: '2014-03-21', isComplete: false, tags: ['home', 'outside'], priority: ID2};
            obj3 = {name:'homework', dueDate: '2014-03-15', isComplete: true, tags: ['work', 'school'], priority: ID3};
            done();
          });
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new Task', function(){
      var t1 = new Task(obj1);

      expect(t1).to.be.instanceof(Task);
      expect(t1).to.have.property('name').and.equal('laundry');
      expect(t1).to.have.property('isComplete').and.equal(false);
      expect(t1).to.have.property('tags').and.deep.equal(['home', 'shopping']);
      expect(t1.priority).to.equal(p1._id.toString());
    });
  });


  describe('#save', function(){
    it('should save a Task into the database', function(done){
      var t1 = new Task(obj1);

      t1.save(function(err){
        expect(err).to.be.null;
        expect(t1).to.be.instanceof(Task);
        expect(t1).to.have.property('_id').and.be.ok;
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should return all tasks in the db', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          Task.findAll(function(tasks){
            expect(tasks).to.have.length(2);
            done();
          });
        });
      });
    });
  });

  describe('.findById', function(){
    it('should return the specified task from the db', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          var id = t1._id.toString();
          Task.findById(id, function(task){
            expect(task).to.be.instanceof(Task);
            expect(task.name).to.equal(t1.name);
            expect(task._id.toString()).to.equal(id);
            done();
          });
        });
      });
    });
  });

  describe('.findByComplete', function(){
    it('should return the specified task weather complete or not', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      var t3 = new Task(obj3);
      t1.save(function(){
        t2.save(function(){
          t3.save(function(){
            var complete = true;
            Task.findByComplete(complete, function(tasks){
              expect(tasks[0].name).to.equal(t3.name);
              expect(tasks[0]._id.toString()).to.equal(t3._id.toString());
              done();
            });
          });
        });
      });
    });
  });

  describe('.findByPriority', function(){
    it('should return the specified task from the db', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          var pri = t1.priority.toString();
          Task.findByPriority(pri, function(tasks){
            expect(tasks[0].name).to.equal('laundry');
            expect(tasks[0].priority.toString()).to.equal(pri);
            done();
          });
        });
      });
    });
  });

  describe('.deleteById', function(){
    it('should delete the specified task from the db based on ID', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          var Id = t2._id.toString();
          Task.deleteById(Id, function(numberRemoved){
            Task.findById(Id, function(foundTask){
              expect(numberRemoved).to.equal(1);
              expect(foundTask).to.be.null;
              done();
            });
          });
        });
      });
    });
  });

  describe('.findByTag', function(){
    it('should return the specified task from the db based on tag', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      var t3 = new Task(obj3);
      t1.save(function(){
        t2.save(function(){
          t3.save(function(){
            var tag = t1.tags[0];
            console.log(tag);
            Task.findByTag(tag, function(records){
              expect(records).to.have.length(2);
              done();
            });
          });
        });
      });
    });
  });

});
