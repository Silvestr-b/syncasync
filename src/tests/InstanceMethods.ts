import { expect } from 'chai'
import * as sinon from 'sinon'
import { SyncPromise } from '../SyncPromise'
import { isRealPromise, isSyncPromise } from './utils'


describe('InstanceMethods', () => {
   describe('.then', () => {
      let spy: sinon.SinonSpy;
      let notCallableSpy: sinon.SinonSpy

      beforeEach(() => {
         spy = sinon.spy();
         notCallableSpy = sinon.spy();
      })

      describe('by resolved', () => {

         it('When resolved with value, should call "onfulfilled" with that value', done => {
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

         it('Should call "onfulfilled" with value of Promise when resolved with resolved Promise', done => {
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

         it('Should call "onrejected" with value of Promise when resolved with rejected Promise', done => {
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

         it('Should call "onfulfilled" with value of SyncPromise when resolved with resolved SyncPromise', done => {
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

         it('Should call "onrejected" with value of SyncPromise when resolved with rejected SyncPromise', done => {
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

         it('When rejected with value, should call "onrejected" with that value', done => {
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

         it('When rejected with resolved Promise, should call "onrejected" with that Promise', done => {
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

         it('When rejected with rejected Promise, should call "onrejected" with that Promise', done => {
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

         it('When rejected with resolved SyncPromise, should call "onrejected" with that SyncPromise', done => {
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

         it('When rejected with rejected SyncPromise, should call "onrejected" with that SyncPromise', done => {
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

      describe('by throwed', () => {

         it('When executor throw something, should call "onrejected" with that', done => {
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

   })







   describe('fluent interface', () => {
      let spy1: sinon.SinonSpy;
      let spy2: sinon.SinonSpy;
      let notCallableSpy: sinon.SinonSpy

      beforeEach(() => {
         spy1 = sinon.spy((res: any) => res);
         spy2 = sinon.spy((res: any) => res);
         notCallableSpy = sinon.spy();
      })

      describe('chain from resolved', () => {
         describe('pass result', () => {

            it('without error callbacks', done => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(spy1)
                  .then(spy2)
                  .then(() => {
                     expect(spy1.calledWith(5)).to.be.true
                     expect(spy2.calledWith(5)).to.be.true
                  })
                  .then(() => done())
            })

            it('with error callbacks', done => {
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

            it('with catch', done => {
               new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .catch(notCallableSpy)
                  .catch(notCallableSpy)
                  .then(spy1, notCallableSpy)
                  .then(() => {
                     expect(spy1.calledWith(5)).to.be.true
                     expect(notCallableSpy.notCalled).to.be.true
                  })
                  .then(() => done())
            })

            it('with catch and error callbacks', done => {
               new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(spy1, notCallableSpy)
                  .catch(notCallableSpy)
                  .catch(notCallableSpy)
                  .then(spy2, notCallableSpy)
                  .then(result => {
                     expect(spy1.calledWith(5)).to.be.true
                     expect(spy2.calledWith(5)).to.be.true
                     expect(notCallableSpy.notCalled).to.be.true
                  })
                  .then(() => done())
            })

            it('with null as success callback', done => {
               new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(spy1, notCallableSpy)
                  .then(null, notCallableSpy)
                  .then(spy2, notCallableSpy)
                  .then(result => {
                     expect(spy1.calledWith(5)).to.be.true
                     expect(spy2.calledWith(5)).to.be.true
                     expect(notCallableSpy.notCalled).to.be.true
                  })
                  .then(() => done())
            })

         })

      })

      describe('chain from rejected', () => {

         it('When "onrejected" return something, should call next "onfulfilled" with that', done => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(notCallableSpy, spy1)
               .then(spy2, notCallableSpy)
               .then(result => {
                  expect(spy1.calledWith(5)).to.be.true
                  expect(spy2.calledWith(5)).to.be.true
                  expect(notCallableSpy.notCalled).to.be.true
               })
               .then(() => done())
         })

      })

      describe('chain with throws', () => {
         describe('without real Promises', () => {



            it('at the start', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  throw "FakeError"
               })
                  .then(null, err => {
                     expect(err).to.be.equal('FakeError')
                     return err
                  })
                  .then(result => {
                     expect(result).to.be.equal('FakeError')
                  })

               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('at the success callback', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(result => {
                     expect(result).to.be.equal(5)
                     throw "FakeError"
                  })
                  .then(null, err => {
                     expect(err).to.be.equal("FakeError")
                     return 15
                  })
                  .then(result => {
                     expect(result).to.be.equal(15)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('at the error callback', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  reject(5)
               })
                  .then(null, err => {
                     throw "FakeError"
                  })
                  .then(null, err => {
                     expect(err).to.be.equal("FakeError")
                     return 15
                  })
                  .then(result => {
                     expect(result).to.be.equal(15)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

         })

         describe('with real Promises', () => {

            it('at the start', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  throw "FakeError"
               })
                  .then(null, err => {
                     expect(err).to.be.equal('FakeError')
                     return Promise.resolve(5)
                  })
                  .then(result => {
                     expect(result).to.be.equal(5)
                     done()
                  })

               expect(isRealPromise(promise)).to.be.true
            })

            it('at the success callback', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(Promise.resolve(5))
               })
                  .then(result => {
                     expect(result).to.be.equal(5)
                     throw "FakeError"
                  })
                  .then(null, err => {
                     expect(err).to.be.equal("FakeError")
                     return 15
                  })
                  .then(result => {
                     expect(result).to.be.equal(15)
                     done()
                  })
               expect(isRealPromise(promise)).to.be.true
            })

            it('at the error callback', () => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  reject(Promise.resolve(5))
               })
                  .then(null, err => {
                     throw "FakeError"
                  })
                  .then(null, err => {
                     expect(err).to.be.equal("FakeError")
                     return 15
                  })
                  .then(result => {
                     expect(result).to.be.equal(15)
                  })
               expect(isRealPromise(promise)).to.be.true
            })

         })

      })
   })

})


