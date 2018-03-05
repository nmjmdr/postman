const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const service = require('../../src/api/services/mail');

describe('Given mail service',()=>{
  let sandbox = sinon.sandbox.create();
  afterEach(()=>{
    sandbox.restore();
  });

  describe('When a batch of mails is to be delivered',()=>{
    describe('Then deliver is invoked',()=>{
      it('Should return for each mail an unique flake-id and queue the messages',()=>{
        const queue = {
          add: sandbox.stub().returns(Promise.resolve(true))
        }
        const mailService = service.create(queue);
        const mails = [ { message: "message-1" }, { message: "message-2" } ];
        return mailService.deliver(mails)
        .then((ids)=>{
          expect(ids.length).to.be.equal(mails.length);
          expect(ids[0]).to.be.not.equal(ids[1]);
          expect(queue.add.getCalls(0).length).to.be.equal(mails.length);
          expect(queue.add.getCalls(0)[0].args[0]).to.be.deep.equal(mails[0]);
          expect(queue.add.getCalls(0)[1].args[0]).to.be.deep.equal(mails[1]);
        })
      });
    });
  });
});
