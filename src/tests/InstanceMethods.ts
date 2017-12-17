import { expect } from 'chai'
import * as sinon from 'sinon'
import { SyncPromise } from '../SyncPromise'


describe('InstanceMethods', () => {

   describe('Sync vs Async', () => {

      it('When resolved with value, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(5)
         }).then(result => result, err => err);

         expect(promise).instanceof(SyncPromise)
      })

      it('When resolved with SyncPromise, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(SyncPromise.resolve(5))
         }).then(result => result, err => err);

         expect(promise).instanceof(SyncPromise)
      })

      it('When resolved with Promise, should return Promise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(Promise.resolve(5))
         }).then(result => result, err => err);

         expect(promise).instanceof(Promise)
      })

      it('When rejected with value, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(5)
         }).then(result => result, err => err);

         expect(promise).instanceof(SyncPromise)
      })

      it('When is rejected with SyncPromise, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(SyncPromise.resolve(5))
         }).then(result => result, err => err);

         expect(promise).instanceof(SyncPromise)
      })

      it('When is rejected with Promise, should return Promise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(Promise.resolve(5))
         }).then(result => result, err => err);

         expect(promise).instanceof(Promise)
      })

      it('When throws exception, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            throw 'FakeMessage'
         }).then(result => result, err => err);

         expect(promise).instanceof(SyncPromise)
      })

      it('When "onfulfilled" throws exception, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(5)
         }).then(result => { throw 'FakeMessage' }, err => err);

         expect(promise).instanceof(SyncPromise)
      })

      it('When "onrejected" throws exception, should return SyncPromise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            throw 'FakeMessage'
         }).then(result => result, err => { throw 'FakeMessage' });

         expect(promise).instanceof(SyncPromise)
      })

      it('When one of "onfulfiled" callbacks in chain returns Promise, should return Promise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(5)
         })
            .then(res => res, err => err)
            .then(res => Promise.resolve(5), err => err)
            .then(res => res, err => err)

         expect(promise).instanceof(Promise)
      })

      it('When one of "onrejected" callbacks in chain returns Promise, should return Promise', () => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(5)
         })
            .then(res => res, err => Promise.resolve(5))
            .then(res => res, err => err)

         expect(promise).instanceof(Promise)
      })

   })

   describe('.then', () => {
      let spy: sinon.SinonSpy;
      let notCallableSpy: sinon.SinonSpy

      beforeEach(() => {
         spy = sinon.spy();
         notCallableSpy = sinon.spy();
      })

      describe('by resolved', () => {

         it('When is resolved with value, should pass that value to next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(spy, notCallableSpy)
               .then(() => {
                  expect(spy.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is resolved with resolved Promise, should pass value of that Promise to next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(Promise.resolve(5))
            })
               .then(spy, notCallableSpy)
               .then(() => {
                  expect(spy.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is resolved with rejected Promise, should pass value of that Promise to next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(Promise.reject(5))
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is resolved with resolved SyncPromise, should pass value of that SyncPromise to next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(SyncPromise.resolve(5))
            })
               .then(spy, notCallableSpy)
               .then(() => {
                  expect(spy.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is resolved with rejected SyncPromise, should pass value of that SyncPromise to next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(SyncPromise.reject(5))
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })
      })

      describe('by rejected', () => {

         it('When is rejected with value, should pass that value to next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is rejected with resolved Promise, should pass that Promise to next "onrejected"', done => {
            const resolvedPromise = Promise.resolve(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(resolvedPromise)
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(resolvedPromise)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is rejected with rejected Promise, should pass that Promise to next "onrejected"', done => {
            const spy = sinon.spy((err: Promise<any>) => err.catch(err => err));
            const rejectedPromise = Promise.reject(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(rejectedPromise)
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(rejectedPromise)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is rejected with resolved SyncPromise, should pass that SyncPromise to next "onrejected"', done => {
            const resolvedSyncPromise = SyncPromise.resolve(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(resolvedSyncPromise)
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(resolvedSyncPromise)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When is rejected with rejected SyncPromise, should pass that SyncPromise to next "onrejected"', done => {
            const spy = sinon.spy((err: Promise<any>) => err.catch(err => err));
            const rejectedSyncPromise = SyncPromise.reject(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(rejectedSyncPromise)
            })
               .then(notCallableSpy, spy)
               .then(() => {
                  expect(spy.calledWith(rejectedSyncPromise)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

      })

      describe('by throws exception', () => {

         it('When executor throws value, should pass that value to next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               throw 'FakeError'
            })
               .then(notCallableSpy, spy)
               .then(result => {
                  expect(spy.calledWith('FakeError')).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

      })

      describe('by chain', () => {
         let spy1: sinon.SinonSpy;
         let spy2: sinon.SinonSpy;
         let notCallableSpy: sinon.SinonSpy

         beforeEach(() => {
            spy1 = sinon.spy((res: any) => res);
            spy2 = sinon.spy((res: any) => res);
            notCallableSpy = sinon.spy();
         })

         it('When "onfulfilled" returns a value, should pass that value to next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(spy1, notCallableSpy)
               .then(spy2, notCallableSpy)
               .then(() => {
                  expect(spy1.calledWith(5)).to.be.true
                  expect(spy2.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When "onfulfilled" returns a value and next "onfulfilled" is null, should pass that value to after next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(spy1, notCallableSpy)
               .then(null, notCallableSpy)
               .then(null, notCallableSpy)
               .then(spy2, notCallableSpy)
               .then(() => {
                  expect(spy1.calledWith(5)).to.be.true
                  expect(spy2.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })


         it('When "onfulfilled" throws a value, should pass that value to next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(() => { throw 'FakeMessage' }, notCallableSpy)
               .then(notCallableSpy, spy1)
               .then(() => {
                  expect(spy1.calledWith('FakeMessage')).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When "onfulfilled" throws a value and next "onrejected" is null, should pass that value to after next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(() => { throw 'FakeMessage' }, notCallableSpy)
               .then(notCallableSpy, null)
               .then(notCallableSpy, null)
               .then(notCallableSpy, spy1)
               .then(() => {
                  expect(spy1.calledWith('FakeMessage')).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })


         it('When "onrejected" returns a value, should pass that value to next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(notCallableSpy, spy1)
               .then(spy2, notCallableSpy)
               .then(() => {
                  expect(spy1.calledWith(5)).to.be.true
                  expect(spy2.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When "onrejected" returns a value and next "onfulfilled" is null, should pass that value to after next "onfulfilled"', done => {
            new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(notCallableSpy, spy1)
               .then(null, notCallableSpy)
               .then(null, notCallableSpy)
               .then(spy2, notCallableSpy)
               .then(() => {
                  expect(spy1.calledWith(5)).to.be.true
                  expect(spy2.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })


         it('When "onrejected" throws a value, should pass that value to next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(notCallableSpy, () => { throw 'FakeMessage' })
               .then(notCallableSpy, spy1)
               .then(() => {
                  expect(spy1.calledWith('FakeMessage')).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

         it('When "onrejected" throws a value and next "onrejected" is null, should pass that value to after next "onrejected"', done => {
            new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(notCallableSpy, () => { throw 'FakeMessage' })
               .then(notCallableSpy, null)
               .then(notCallableSpy, null)
               .then(notCallableSpy, spy1)
               .then(() => {
                  expect(spy1.calledWith('FakeMessage')).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

      })

   })

})


