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
        },(err, fnUsed)=>{
          return true;
        });

        return cb([1])
        .then((r)=>{
          expect(r.result).to.be.equal(primaryReturn);
          expect(r.invoked).to.be.equal(primary);
        });
      })
    });

    describe('Then invoked, with primary having service unavailable errors',()=>{
      it('Should invoke the secondary',()=>{
        const primaryReturn = 100;
        const secondaryReturn = 200;
        const primary = sandbox.stub().returns(Promise.reject("Error"));
        const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
        const cb = circuitbreaker.create(primary, secondary, (stats)=>{
          return false
        },(err, fnUsed)=>{
          return true;
        });

        return cb([1])
        .then((r)=>{
          expect(primary.called).to.be.true;
          expect(r.result).to.be.equal(secondaryReturn);
          expect(r.invoked).to.be.equal(secondary);
        });
      })

      describe('When the secondary also fails',()=>{
        it('Should return an error',()=>{
          const primary = sandbox.stub().returns(Promise.reject("Error"));
          const secondary = sandbox.stub().returns(Promise.reject("Error"));
          const cb = circuitbreaker.create(primary, secondary, (stats)=>{
            return false
          },(err, fnUsed)=>{
            return true;
          });

          return cb([1])
          .catch((err)=>{
            expect(primary.called).to.be.true;
            expect(secondary.called).to.be.true;
            expect(err).to.exist;
          });


        });
      });

      describe('Then for subsquent invocations',()=>{
        it('Should keep invoking the secondary',()=>{
          const primaryReturn = 100;
          const secondaryReturn = 200;
          const primary = sandbox.stub().returns(Promise.reject("Error"));
          const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
          const cb = circuitbreaker.create(primary, secondary, (stats)=>{
            return false
          },(err,fnUsed)=>{
            return true;
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

      describe('Should invoke secondary, but later when secondary encounters an error (probe policy does not matter)',()=>{
        it('Should try and invoke the primary',()=>{
          const primaryReturn = 100;
          const secondaryReturn = 200;
          let calls = 0
          const primary = ()=>{
            calls++
            if(calls > 1) {
              return Promise.resolve(primaryReturn);
            } else {
              return Promise.reject("Error");
            }
          }
          let secondaryCalls = 0;
          const secondary = ()=>{
            secondaryCalls++
            if(secondaryCalls == 1) {
              return Promise.resolve(secondaryReturn);
            } else {
              return Promise.reject("Error");
            }
          }
          const cb = circuitbreaker.create(primary, secondary, (stats)=>{
            return false
          },(err,fnUsed)=>{
            return true;
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

    describe('Then invoked, with primary having NOT as service unavailable errors',()=>{
      it('Should reject',()=>{
        const primaryReturn = 100;
        const secondaryReturn = 200;
        const primary = sandbox.stub().returns(Promise.reject("Error"));
        const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
        const cb = circuitbreaker.create(primary, secondary, (stats)=>{
          return false
        },(err, fnUsed)=>{
          return false;
        });

        return cb([1])
        .catch((err)=>{
          expect(err).to.exist;
        });
      });
    });

    describe('When set a probe policy to try primary',()=>{
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
            },(err, fnUsed)=>{
              return true;
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

        describe('Then it should probe primary and when it still fails',()=>{
          it('Should invoke the secondary',()=>{
            const primaryReturn = 100;
            const secondaryReturn = 200;
            const primary = sandbox.stub().returns(Promise.reject('Error'));
            const secondary = sandbox.stub().returns(Promise.resolve(secondaryReturn));
            const cb = circuitbreaker.create(primary, secondary, (stats)=>{
              return stats.callsToSecondary > 1;
            },(err, fnUsed)=>{
              return true;
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
        });
      });
    });
  });
});
