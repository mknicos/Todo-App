//acceptance tests, task.js
/* jshint expr: true */
/* globals before, beforeEach : true */

'use strict';

var Priority, p1, p2, p3, Task, obj1, obj3, obj2;


process.env.DBNAME = 'todo-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var Priority, Task;

describe('tasks', function(){
  before(function(done){
      var connect = require('../../app/lib/mongodb-connection-pool');
      connect('todo-test', function(){
        Priority = global.nss.Priority;
        Task = global.nss.Task;
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
              obj2 = {name:'trash', dueDate: '2014/02/26', isComplete: false, tags: ['home', 'outside'], priority: ID2};
              obj3 = {name:'homework', dueDate: 'Feb 2nd, 2014', isComplete: true, tags: ['work', 'school'], priority: ID3};
              done();
            });
          });
        });
      });
    });

  describe('POST /tasks', function(){
    it('should create a new task', function(done){
      request(app)
      .post('/tasks')
      .send(obj1)
      .end(function(err,res){
        expect(res.body.name).to.equal(obj1.name);
        expect(res.body.dueDate).to.equal('2014-02-25T00:00:00.000Z');
        expect(res.body._id).to.have.length(24);
        done();
      });
    });
  });

  describe('GET /tasks', function(){
    it('should return all the tasks in the db', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      var t3 = new Task(obj3);
      t1.save(function(){
        t2.save(function(){
          t3.save(function(){
            request(app)
            .get('/tasks')
            .end(function(err,res){
              expect(res.body.tasks).to.have.length(3);
              expect(res.body.tasks[0].name).to.be.ok;
              expect(res.body.tasks[0]._id).to.have.length(24);
              done();
            });
          });
        });
      });
    });
  });

  describe('GET /tasks/:id', function(){
    it('should return the specified task from the database', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          request(app)
          .get('/tasks/'+t1._id.toString())
          .end(function(err,res){
            console.log(res.body);
            expect(res.body._id).to.equal(t1._id.toString());
            expect(res.body.name).to.equal(t1.name);
            done();
          });
        });
      });
    });
  });

  describe('DELETE /tasks/id', function(){
    it('should delete a specific priority from the database', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          request(app)
          .del('/tasks/' + t1._id.toString())
          .end(function(err, res){
            expect(res.body.count).to.equal(1);
            done();
          });
        });
      });
    });
  });

  describe('PUT /tasks', function(){
    it('should update a specific priority in the database', function(done){
      var t1 = new Task(obj1);
      var t2 = new Task(obj2);
      t1.save(function(){
        t2.save(function(){
          t1.name = 'Something';
          console.log(t1);
          request(app)
          .put('/tasks')
          .send(t1)
          .end(function(err, res){
            console.log(res.body);
            expect(res.body._id).to.equal(t1._id.toString());
            expect(res.body.name).to.equal('Something');
            done();
          });
        });
      });
    });
  });


});
