const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mailFlow = require('../../src/mailer/flow');

const assignedTo = 'test-worker';

function getStanardDependencies(sandbox) {
  return {
      queue: {
        read: sandbox.stub().returns(Promise.resolve(null)),
        delete: sandbox.stub().returns(Promise.resolve(true))
      },
      gaurd: {
        start: sandbox.stub().returns(Promise.resolve(true)),
        end: sandbox.stub().returns(Promise.resolve(true)),
        waitForPending: sandbox.stub().returns(Promise.resolve(true))
      },
      ledger: {
        record: sandbox.stub().returns(Promise.resolve(true)),
        get: sandbox.stub().returns(Promise.resolve(false))
      },
      postbox: {
        send: sandbox.stub().returns(Promise.resolve({ ok: true}))
      },
      workerId: assignedTo
    }
}

describe('Given that the mail process flow is created',()=>{
  let sandbox = sinon.sandbox.create();
  afterEach(()=>{
    sandbox.restore();
  });

  describe('When an email is queued',()=>{
    describe('Then process is invoked',()=>{
      it('Should read it from the queue',()=>{
        let dependencies = getStanardDependencies(sandbox);
        dependencies.queue.read.returns(Promise.resolve({ id: 123, message: 'mail'}));
        const flow = mailFlow.create(dependencies);
        return flow.process()
        .then((r)=>{
          expect(dependencies.queue.read.called).to.be.true;
          expect(dependencies.queue.read.getCalls(0)[0].args[0]).to.be.equal(assignedTo);
        });
      });

      it('Should check if it has been recorded as already sent',()=>{
        let dependencies = getStanardDependencies(sandbox);
        dependencies.queue.read.returns(Promise.resolve({ id: 123, message: 'mail'}));
        const flow = mailFlow.create(dependencies);
        return flow.process()
        .then((r)=>{
          expect(dependencies.ledger.get.called).to.be.true;
        });
      });

      it('Should follow [gaurd start - send - record - delete - gaurd end] to send mail',()=>{
        let dependencies = getStanardDependencies(sandbox);
        dependencies.queue.read.returns(Promise.resolve({ id: 123, message: 'mail'}));
        const flow = mailFlow.create(dependencies);
        return flow.process()
        .then((r)=>{
          expect(dependencies.gaurd.start.called).to.be.true;
          expect(dependencies.postbox.send.called).to.be.true;
          expect(dependencies.ledger.record.called).to.be.true;
          expect(dependencies.queue.delete.called).to.be.true;
          expect(dependencies.gaurd.end.called).to.be.true;
        });
      });

      describe('When the ledger says there is a record of email sent earlier',()=>{
        it('Should not attempt to send email again',()=>{
          let dependencies = getStanardDependencies(sandbox);
          dependencies.queue.read.returns(Promise.resolve({ id: 123, message: 'mail'}));
          const flow = mailFlow.create(dependencies);
          dependencies.ledger.get.returns(Promise.resolve({ id: 123, message: 'mail', sent: true}));
          return flow.process()
          .then((r)=>{
            expect(dependencies.ledger.get.called).to.be.true;
            expect(dependencies.postbox.send.called).to.be.false;
            expect(dependencies.queue.delete.called).to.be.true;
          });
        });
      });
    });
  });

  describe('When no email is queued',()=>{
    describe('Then process is invoked',()=>{
      it('Should exit from process',()=>{
        let dependencies = getStanardDependencies(sandbox);
        dependencies.queue.read.returns(Promise.resolve(null));
        const flow = mailFlow.create(dependencies);
        return flow.process()
        .then((r)=>{
          expect(dependencies.queue.read.called).to.be.true;
          expect(dependencies.postbox.send.called).to.be.false;
        });
      });
    });
  });

});
