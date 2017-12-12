import { expect } from 'chai'
import { SyncPromise } from '../SyncPromise'
import { isRealPromise, isSyncPromise } from './utils'


describe('InstanceMethods', () => {
   describe('Create and resolve', () => {

      it('resolve with value', (done) => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(5)
         }).then(result => {
            expect(result).to.be.equal(5)
         })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('resolve with resolved Promise', (done) => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(Promise.resolve(5))
         }).then(result => {
            expect(result).to.be.equal(5)
            done()
         })
         expect(isRealPromise(promise)).to.be.true
      })

      it('resolve with rejected Promise', (done) => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(Promise.reject(5))
         }).then(null, err => {
            expect(err).to.be.equal(5)
            done()
         })
         expect(isRealPromise(promise)).to.be.true
      })

      it('resolve with resolved SyncPromise', (done) => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(SyncPromise.resolve(5))
         }).then(result => {
            expect(result).to.be.equal(5)
         })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('resolve with rejected SyncPromise', (done) => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            resolve(SyncPromise.reject(5))
         }).then(null, err => {
            expect(err).to.be.equal(5)
         })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

   })

   describe('Create and reject', () => {

      it('reject with value', (done) => {
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(5)
         }).then(null, err => {
            expect(err).to.be.equal(5)
         })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('reject with resolved Promise', (done) => {
         const resolvedPromise = Promise.resolve(5);
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(resolvedPromise)
         }).then(null, err => {
            expect(err).to.be.equal(resolvedPromise)
            done()
         })
         expect(isRealPromise(promise)).to.be.true
      })

      it('reject with rejected Promise', (done) => {
         const rejectedPromise = Promise.reject(5);
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(rejectedPromise)
         }).then(null, (err: typeof rejectedPromise) => {
            err.catch(err => err)
            expect(err).to.be.equal(rejectedPromise)
            done()
         })
         expect(isRealPromise(promise)).to.be.true
      })

      it('reject with resolved SyncPromise', (done) => {
         const resolvedSyncPromise = SyncPromise.resolve(5);
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(resolvedSyncPromise)
         }).then(null, err => {
            expect(err).to.be.equal(resolvedSyncPromise)
         })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('reject with rejected SyncPromise', (done) => {
         const rejectedSyncPromise = SyncPromise.reject(5);
         const promise = new SyncPromise<number>((resolve, reject) => {
            reject(rejectedSyncPromise)
         }).then(null, (err: typeof rejectedSyncPromise) => {
            err.catch(err => err)
            expect(err).to.be.equal(rejectedSyncPromise)
         })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

   })

   describe('Chaining', () => {
      describe('chain from resolved', () => {
         describe('pass result', () => {

            it('without error callbacks', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(result => result)
                  .then(result => result)
                  .then(result => {
                     expect(result).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
            })

            it('with error callbacks', (done) => {
               const promise = new SyncPromise<number>((resolve, reject) => {
                  resolve(5)
               })
                  .then(result => result, err => err)
                  .then(result => result, err => err)
                  .then(result => {
                     expect(result).to.be.equal(5)
                  })
               expect(isSyncPromise(promise)).to.be.true
               promise.then(() => done())
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

      describe('chain with resolved Promise', () => {

         it('at the start', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(Promise.resolve(5))
            })
               .then(result => {
                  expect(result).to.be.equal(5)
                  return result
               })
               .then(result => {
                  expect(result).to.be.equal(5)
                  done()
               })
            expect(isRealPromise(promise)).to.be.true
         })

         it('at the chain', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(result => {
                  expect(result).to.be.equal(5)
                  return Promise.resolve(10)
               })
               .then(result => {
                  expect(result).to.be.equal(10)
                  done()
               })
            expect(isRealPromise(promise)).to.be.true
         })

      })

      describe('chain with rejected Promise', () => {

         it('at the start', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(Promise.reject(5))
            })
               .then(null, err => {
                  expect(err).to.be.equal(5)
                  return err
               })
               .then(result => {
                  expect(result).to.be.equal(5)
                  done()
               })
            expect(isRealPromise(promise)).to.be.true
         })

         it('at the chain', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(result => {
                  return Promise.reject(10)
               })
               .then(null, err => {
                  expect(err).to.be.equal(10)
                  done()
               })
            expect(isRealPromise(promise)).to.be.true
         })

      })

      describe('chain with resolved SyncPromise', () => {

         it('at the start', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(SyncPromise.resolve(5))
            })
               .then(result => {
                  expect(result).to.be.equal(5)
                  return result
               })
               .then(result => {
                  expect(result).to.be.equal(5)
               })
            expect(isSyncPromise(promise)).to.be.true
            promise.then(() => done())
         })

         it('at the chain', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(result => {
                  expect(result).to.be.equal(5)
                  return SyncPromise.resolve(10)
               })
               .then(result => {
                  expect(result).to.be.equal(10)
               })
            expect(isSyncPromise(promise)).to.be.true
            promise.then(() => done())
         })

      })

      describe('chain with rejected SyncPromise', () => {

         it('at the start', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(SyncPromise.reject(5))
            })
               .then(null, err => {
                  expect(err).to.be.equal(5)
                  return err
               })
               .then(result => {
                  expect(result).to.be.equal(5)
               })
            expect(isSyncPromise(promise)).to.be.true
            promise.then(() => done())
         })

         it('at the chain', (done) => {
            const promise = new SyncPromise<number>((resolve, reject) => {
               resolve(5)
            })
               .then(result => {
                  expect(result).to.be.equal(5)
                  return SyncPromise.reject(10)
               })
               .then(null, err => {
                  expect(err).to.be.equal(10)
                  return 15
               })
               .then(result => {
                  expect(result).to.be.equal(15)
               })
            expect(isSyncPromise(promise)).to.be.true
            promise.then(() => done())
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


