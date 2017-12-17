import { expect } from 'chai'
import * as sinon from 'sinon'
import { SyncPromise } from '../SyncPromise'
import { isRealPromise, isSyncPromise } from './utils'


describe('InstanceMethods', () => {
   describe('.then', () => {
      let spy: sinon.SinonSpy;

      beforeEach(() => {
         spy = sinon.spy();
      })

      describe('by resolved', () => {

         it('When resolved with value, should call "onfulfilled" with that value', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(spy)
               .then(() => expect(spy.calledWith(5)).to.be.true)
               .then(() => done())
         })

         it('Should call "onfulfilled" with value of Promise when resolved with resolved Promise', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(Promise.resolve(5))
            })
               .then(spy)
               .then(() => expect(spy.calledWith(5)).to.be.true)
               .then(() => done())
         })

         it('Should call "onrejected" with value of Promise when resolved with rejected Promise', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(Promise.reject(5))
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(5)).to.be.true)
               .then(() => done())
         })

         it('Should call "onfulfilled" with value of SyncPromise when resolved with resolved SyncPromise', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(SyncPromise.resolve(5))
            })
               .then(spy)
               .then(() => expect(spy.calledWith(5)).to.be.true)
               .then(() => done())
         })

         it('Should call "onrejected" with value of SyncPromise when resolved with rejected SyncPromise', done => {
            new SyncPromise<number>((resolve, reject) => {
               resolve(SyncPromise.reject(5))
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(5)).to.be.true)
               .then(() => done())
         })
      })

      describe('by rejected', () => {

         it('reject with value', done => {
            new SyncPromise<number>((resolve, reject) => {
               reject(5)
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(5)).to.be.true)
               .then(() => done())
         })

         it('reject with resolved Promise', done => {
            const resolvedPromise = Promise.resolve(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(resolvedPromise)
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(resolvedPromise)).to.be.true)
               .then(() => done())
         })

         it('reject with rejected Promise', done => {
            const spy = sinon.spy((err: Promise<any>) => err.catch(err => err));
            const rejectedPromise = Promise.reject(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(rejectedPromise)
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(rejectedPromise)).to.be.true)
               .then(() => done())
         })

         it('reject with resolved SyncPromise', done => {
            const resolvedSyncPromise = SyncPromise.resolve(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(resolvedSyncPromise)
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(resolvedSyncPromise)).to.be.true)
               .then(() => done())
         })

         it('reject with rejected SyncPromise', done => {
            const spy = sinon.spy((err: Promise<any>) => err.catch(err => err));
            const rejectedSyncPromise = SyncPromise.reject(5);
            new SyncPromise<number>((resolve, reject) => {
               reject(rejectedSyncPromise)
            })
               .then(null, spy)
               .then(() => expect(spy.calledWith(rejectedSyncPromise)).to.be.true)
               .then(() => done())
         })

      })

   })

   describe('fluent interface', () => {
      describe('chain from resolved', () => {
         let spy1: sinon.SinonSpy;
         let spy2: sinon.SinonSpy;
         let notCallableSpy: sinon.SinonSpy

         beforeEach(() => {
            spy1 = sinon.spy((res: any) => res);
            spy2 = sinon.spy((res: any) => res);
            notCallableSpy = sinon.spy();
         })

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

            it('with error callbacks', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
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

            it('with catch', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .catch(err => err)
                  .catch(err => err)
                  .then(result => {
                     expect(result).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('with catch and error callbacks', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(result => result, err => err)
                  .catch(err => err)
                  .catch(err => err)
                  .then(result => {
                     expect(result).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('with null as success callback', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(result => result, err => err)
                  .then(null, err => err)
                  .then(result => {
                     expect(result).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

         })

      })

      describe('chain from rejected', () => {
         describe('pass error', () => {
            it('without success callbacks', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  reject(5)
               })
                  .then(null, err => {
                     expect(err).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('with success callbacks', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  reject(5)
               })
                  .then(result => result)
                  .then(result => result)
                  .then(null, err => {
                     // Он не вызывает это!
                     expect(err).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('with catch', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  reject(5)
               })
                  .then(result => result)
                  .then(result => result)
                  .catch(err => {
                     expect(err).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })
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


