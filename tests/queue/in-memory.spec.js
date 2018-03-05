const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const queue = require('../../src/queue/inmemory-queue');

describe('Given inmemory queue',()=>{

  let clock;
  beforeEach(()=>{
    clock = sinon.useFakeTimers();
  });
  afterEach(()=>{
    queue.clearAll();
    clock.restore();
  });

  describe('When an item is queued',()=>{
    describe('Then an worker reads it',()=>{
      it('Should not be available for the next worker, until the visiblity timesout',()=>{
        const q = queue.create({ name: 'queue', visiblityTimeout: 1000});
        const assignedTo = 'worker1';
        const item = { id: 1};
        return q.add(item)
        .then(()=>{
          return q.read(assignedTo);
        })
        .then((itemRead)=>{
          expect(itemRead.id).to.equal(item.id);
          expect(itemRead.assignedTo).to.equal(assignedTo);
          return q.read('worker2');
        })
        .then((nextItem)=>{
          expect(nextItem).to.not.exist;
        });
      });

      describe('But the visibility timeout expires',()=>{
        it('Should be available for the next worker',()=>{
          const visiblityTimeout = 1000;
          const q = queue.create({ name: 'queue', visiblityTimeout: visiblityTimeout});
          const worker1 = 'worker1';
          const worker2 = 'worker2';
          const item = { id: 1};
          return q.add(item)
          .then(()=>{
            return q.read(worker1);
          })
          .then((itemRead)=>{
            expect(itemRead.id).to.equal(item.id);
            expect(itemRead.assignedTo).to.equal(worker1);
            clock.tick(visiblityTimeout+1);
            return q.read(worker2);
          })
          .then((readAgain)=>{
            expect(readAgain.id).to.equal(item.id);
            expect(readAgain.assignedTo).to.equal(worker2);
          });
        });
      });

      describe('Then the worker deletes it',()=>{
        it('Should not be available to the next worker',()=>{
          const q = queue.create({ name: 'queue', visiblityTimeout: 1000});
          const assignedTo = 'worker1';
          const item = { id: 1};
          return q.add(item)
          .then(()=>{
            return q.read(assignedTo);
          })
          .then((itemRead)=>{
            expect(itemRead.id).to.equal(item.id);
            expect(itemRead.assignedTo).to.equal(assignedTo);
            return q.delete(itemRead.id, assignedTo);
          })
          .then((deleted)=>{
            expect(deleted).to.be.true;
            return q.read('worker2');
          })
          .then((nextItem)=>{
            expect(nextItem).to.not.exist;
          });
        });
      });

      describe('Then other worker tries to deletes it',()=>{
        it('Should not allow it',()=>{
          const q = queue.create({ name: 'queue', visiblityTimeout: 1000});
          const assignedTo = 'worker1';
          const otherWorker = 'worker2';
          const item = { id: 1};
          return q.add(item)
          .then(()=>{
            return q.read(assignedTo);
          })
          .then((itemRead)=>{
            expect(itemRead.id).to.equal(item.id);
            expect(itemRead.assignedTo).to.equal(assignedTo);
            return q.delete(itemRead.id, otherWorker);
          })
          .then((deleted)=>{
            expect(deleted).to.be.false;
            return q.delete(item.id, assignedTo);
          })
          .then((deleted)=>{
            expect(deleted).to.be.true;
          })
        });
      });
    });

    it('It should be possible to get the queue and read the item',()=>{
      const queueName = 'thisQueue';
      const q = queue.create({ name: queueName, visiblityTimeout: 1000});
      const assignedTo = 'worker1';
      const item = { id: 1};
      return q.add(item)
      .then(()=>{
        return queue.get(queueName);
      })
      .then((queueGot)=>{
        return queueGot.read(assignedTo);
      })
      .then((itemRead)=>{
        expect(itemRead.id).to.equal(item.id);
        expect(itemRead.assignedTo).to.equal(assignedTo);
      });
    });
  });
});
