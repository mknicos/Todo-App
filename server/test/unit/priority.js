/* jshint expr:true */
/* globals before, beforeEach : true */

'use strict';
var expect = require('chai').expect;
var Priority;



describe('Priority', function(){

  before(function(done){
    var connect = require('../../app/lib/mongodb-connection-pool');
    connect('todo-test', function(){
      Priority = global.nss.Priority;
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err,result){
      done();
    });
  });

  describe('new', function(){
    it('should create a new Priority', function(){
      var obj = {name:'High', value:'10'};
      var p1 = new Priority(obj);

      expect(p1).to.be.instanceof(Priority);
      expect(p1).to.have.property('name').and.equal('High');
      expect(p1).to.have.property('value').and.deep.equal(10);
    });
  });

  describe('#save', function(){
    it('should save a Priority object into the database', function(done){
      var obj = {name:'High', value:'10'};
      var p1 = new Priority(obj);
      p1.save(function(err){
        expect(err).to.be.null;
        expect(p1).to.be.instanceof(Priority);
        expect(p1.name).to.equal('High');
        expect(p1.value).to.deep.equal(10);
        expect(p1).to.have.property('_id').and.be.ok;
        done();
      });
    });

    it('should not create duplicate priorities based on name', function(done){
      var p1 = new Priority({name:'High', value:'10'});
      var p2 = new Priority({name:'Medium', value:'5'});
      var p3 = new Priority({name:'High', value:'10'});
      p1.save(function(){
        p2.save(function(){
          p3.save(function(err){
            expect(err).to.be.instanceof(Error);
            expect(p3._id).to.be.undefined;
            done();
          });
        });
      });
    });

    it('should update an existing priority', function(done){
      var p1 = new Priority({name:'Medium', value:'10'});
      p1.save(function(err){
        p1.value = '5';
        p1.save(function(){
          expect(err).to.be.null;
          expect(p1).to.be.instanceof(Priority);
          Priority.findByName('Medium', function(savedPriority){
            expect(savedPriority).to.not.be.null;
            Priority.findAll(function(priorities){
              expect(priorities).to.have.length(1);
              done();
            });
          });
        });
      });
    });

  });

  describe('.findAll', function(){
    it('should return all Priorities in the DB', function(done){
      var p1 = new Priority({name:'High', value:'10'});
      var p2 = new Priority({name:'Medium', value:'5'});
      var p3 = new Priority({name:'Low', value:'1'});
      p1.save(function(){
        p2.save(function(){
          p3.save(function(){
            Priority.findAll(function(priorities){
              expect(priorities).to.have.length(3);
              done();
            });
          });
        });
      });
    });
  });

  describe('.findByName', function(){
    it('should find the Priority by its name', function(done){
      var p1 = new Priority({name:'High', value:'10'});
      var p2 = new Priority({name:'Medium', value:'5'});
      var p3 = new Priority({name:'Low', value:'1'});
      p1.save(function(){
        p2.save(function(){
          p3.save(function(){
            Priority.findByName('Medium', function(foundPriority){
              expect(foundPriority).to.be.instanceof(Priority);
              expect(foundPriority.name).to.equal('Medium');
              done();
            });
          });
        });
      });
    });
  });

  describe('.findByID', function(){
    it('should find the Priority by its ID', function(done){
      var p1 = new Priority({name:'High', value:'10'});
      var p2 = new Priority({name:'Medium', value:'5'});
      var p3 = new Priority({name:'Low', value:'1'});
      p1.save(function(){
        p2.save(function(){
          p3.save(function(){
            var id = p1._id.toString();
            Priority.findByID(id, function(foundPriority){
              expect(foundPriority).to.be.instanceof(Priority);
              expect(foundPriority.name).to.equal('High');
              expect(foundPriority._id.toString()).to.equal(id);
              done();
            });
          });
        });
      });
    });
  });

  describe('.deleteByID', function(){
    it('should delete the priority by its id from the datbase', function(done){
      var p1 = new Priority({name:'High', value:'10'});
      var p2 = new Priority({name:'Medium', value:'5'});
      var p3 = new Priority({name:'Low', value:'1'});

      p1.save(function(){
        p2.save(function(){
          var id = p2._id.toString();
          p3.save(function(){
            Priority.deleteByID(id, function(numberRemoved){
              Priority.findByID(id, function(foundPriority){
                expect(numberRemoved).to.equal(1);
                expect(foundPriority).to.be.null;
                done();
              });
            });
          });
        });
      });
    });
  });

});
