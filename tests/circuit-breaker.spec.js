const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const circuitbreaker = require('../src/circuit-breaker');

describe('Given circuit-breaker',()=>{
  let sandbox = sinon.sandbox.create();
  afterEach(()=>{
    sandbox.restore();
  });

  describe('When it is setup with a primary and a secondary',()=>{
    describe('Then invoked, with primary having no errors',()=>{
      it('Should invoke the primary',()=>{
        const primaryReturn = 100;
        const secondaryReturn = 200;
        const primary = sandbox.stub().returns(Promise.resolve(primaryReturn));
        const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
        const cb = circuitbreaker.create(primary, secondary, (stats)=>{
          return false
        });

        return cb([1])
        .then((r)=>{
          expect(r.result).to.be.equal(primaryReturn);
          expect(r.invoked).to.be.equal(primary);
        });
      })
    });

    describe('Then invoked, with primary having errors',()=>{
      it('Should invoke the secondary',()=>{
        const primaryReturn = 100;
        const secondaryReturn = 200;
        const primary = sandbox.stub().returns(Promise.reject("Error"));
        const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
        const cb = circuitbreaker.create(primary, secondary, (stats)=>{
          return false
        });

        return cb([1])
        .then((r)=>{
          expect(primary.called).to.be.true;
          expect(r.result).to.be.equal(secondaryReturn);
          expect(r.invoked).to.be.equal(secondary);
        });
      })
    });

    describe('Then invoked, with primary having errors',()=>{
      describe('Then for subsquent invocations',()=>{
        it('Should keep invoking the secondary',()=>{
          const primaryReturn = 100;
          const secondaryReturn = 200;
          const primary = sandbox.stub().returns(Promise.reject("Error"));
          const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
          const cb = circuitbreaker.create(primary, secondary, (stats)=>{
            return false
          });

          let promises = [];
          promises.push(cb([1])
          .then((r)=>{
            expect(primary.called).to.be.true;
            expect(r.result).to.be.equal(secondaryReturn);
            expect(r.invoked).to.be.equal(secondary);
          }));

          for(i=0;i<10;i++) {
            promises.push(cb([1])
            .then((r)=>{
              expect(r.result).to.be.equal(secondaryReturn);
              expect(r.invoked).to.be.equal(secondary);
            }));
          }
          return Promise.all(promises);
        })
      });
    });

    describe('When set a prove policy to try primary',()=>{
      describe('Then invoked, with primary having errors',()=>{
        describe('Then for subsquent invocations',()=>{
          it('Should try invoking the primary when the probe policy asks to probe primary',()=>{
            const primaryReturn = 100;
            const secondaryReturn = 200;
            let calls = 0;
            const primary = ()=>{
              calls++;
              if(calls > 1) {
                return Promise.resolve(primaryReturn);
              } else {
                return Promise.reject("Error");
              }
            }
            const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
            const cb = circuitbreaker.create(primary, secondary, (stats)=>{
              return stats.callsToSecondary > 1;
            });

            let promises = [];
            promises.push(cb([1])
            .then((r)=>{
              expect(r.result).to.be.equal(secondaryReturn);
              expect(r.invoked).to.be.equal(secondary);
            }));

            promises.push(cb([1])
            .then((r)=>{
              expect(r.result).to.be.equal(primaryReturn);
              expect(r.invoked).to.be.equal(primary);
            }));

            return Promise.all(promises);
          })
        });
      });
    });

    describe('When set a prove policy to try primary',()=>{
      describe('Then invoked, with primary having errors',()=>{
        describe('Then for subsquent invocations',()=>{
          describe('Then it should probe primary and when it still fails',()=>{
            it('Should invoke the secondary',()=>{
              const primaryReturn = 100;
              const secondaryReturn = 200;
              const primary = sandbox.stub().returns(Promise.reject('Error'));
              const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
              const cb = circuitbreaker.create(primary, secondary, (stats)=>{
                return stats.callsToSecondary > 1;
              });

              let promises = [];
              promises.push(cb([1])
              .then((r)=>{
                expect(r.result).to.be.equal(secondaryReturn);
                expect(r.invoked).to.be.equal(secondary);
              }));

              promises.push(cb([1])
              .then((r)=>{
                expect(r.result).to.be.equal(secondaryReturn);
                expect(r.invoked).to.be.equal(secondary);
              }));

              return Promise.all(promises);
            })
          })
        });
      });
    });
  });
});
