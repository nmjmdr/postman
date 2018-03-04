const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mailFlow = require('../../src/mailer/flow');
const postbox = require('../../src/mailer/flow');
const ledger = require('../../src/ledger');
const gaurd = require('../../src/gaurd');

describe('Given that the mail process flow is created',()=>{
  let sandbox = sinon.sandbox.create();
  afterEach(()=>{
    sandbox.restore();
  });
  const dependencies = {
    queue: sandbox.stub(),
    gaurd: sandbox.stub(gaurd),
    ledger: sandbox.stub(ledger),
    postbox: sandbox.stub(postbox),
  }
  
  const flow = mailFlow.create(dependencies);

  describe('When an email is queued',()=>{
    it('Should pick read it from the queue',()=>{

    });
  });
});
