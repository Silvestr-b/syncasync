import { expect } from 'chai'
import { SyncPromise } from '../SyncPromise'
import { isSyncPromise, isRealPromise } from './utils'


describe('StaticMethods', () => {
   describe('.all', () => {

      it('argument is value', (done) => {
         const promise = SyncPromise.all([5])
            .then(result => {
               expect(result).to.be.eql([5])
            })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('argument is resolved SyncPromise', (done) => {
         const promise = SyncPromise.all([SyncPromise.resolve(5)])
            .then(result => {
               expect(result).to.be.eql([5])
            })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('argument is rejected SyncPromise', (done) => {
         const promise = SyncPromise.all([SyncPromise.reject(5)])
            .then(null, err => {
               expect(err).to.be.eql(5)
            })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('argument is resolved Promise', (done) => {
         const promise = SyncPromise.all([Promise.resolve(5)])
            .then(result => {
               expect(result).to.be.eql([5])
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

      it('argument is rejected Promise', (done) => {
         const promise = SyncPromise.all([Promise.reject(5)])
            .then(null, err => {
               expect(err).to.be.eql(5)
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

      it('random type arguments without Promise', (done) => {
         const promise = SyncPromise.all(['FakeString', null, 10, SyncPromise.resolve(5)])
            .then(result => {
               expect(result).to.be.eql(['FakeString', null, 10, 5])
            })
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('random type arguments with Promise', (done) => {
         const promise = SyncPromise.all(['FakeString', null, 10, Promise.resolve(5)])
            .then(result => {
               expect(result).to.be.eql(['FakeString', null, 10, 5])
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

   })

   describe('.resolve', () => {
      it('with Value', (done) => {
         const promise = SyncPromise.resolve(5)
            .then(result => {
               expect(result).to.be.eql(5)
               done()
            })
         expect(isSyncPromise(promise)).to.be.true
      })

      it('with resolved Promise', (done) => {
         const promise = SyncPromise.resolve(Promise.resolve(5))
            .then(result => {
               expect(result).to.be.eql(5)
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

      it('with rejected Promise', (done) => {
         const promise = SyncPromise.resolve(Promise.reject(5))
            .then(null, err => {
               expect(err).to.be.eql(5)
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

      it('with resolved SyncPromise', (done) => {
         const promise = SyncPromise.resolve(SyncPromise.resolve(5))
            .then(result => {
               expect(result).to.be.eql(5)
               done()
            })
         expect(isSyncPromise(promise)).to.be.true
      })

      it('with rejected SyncPromise', (done) => {
         const promise = SyncPromise.resolve(SyncPromise.reject(5))
            .then(null, err => {
               expect(err).to.be.eql(5)
               done()
            })
         expect(isSyncPromise(promise)).to.be.true
      })
   })

   describe('.reject', () => {
      it('with Value', (done) => {
         const promise = SyncPromise.reject(5)
            .then(null, err => {
               expect(err).to.be.eql(5)
               done()
            })
         expect(isSyncPromise(promise)).to.be.true
      })

      it('with resolved Promise', (done) => {
         const resolvedPromise = Promise.resolve(5);
         const promise = SyncPromise.reject(resolvedPromise)
            .then(null, err => {
               expect(err).to.be.eql(resolvedPromise)
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

      it('with rejected Promise', (done) => {
         const rejectedPromise = Promise.reject(5);
         const promise = SyncPromise.reject(rejectedPromise)
            .then(null, (err: Promise<any>) => {
               expect(err).to.be.eql(rejectedPromise)
               err.catch(err => err)
               done()
            })
         expect(isRealPromise(promise)).to.be.true
      })

      it('with resolved SyncPromise', (done) => {
         const resolvedPromise = SyncPromise.resolve(5);
         const promise = SyncPromise.reject(resolvedPromise)
            .then(null, err => {
               expect(err).to.be.eql(resolvedPromise)
               done()
            })
         expect(isSyncPromise(promise)).to.be.true
      })

      it('with rejected SyncPromise', (done) => {
         const rejectedPromise = SyncPromise.reject(5);
         const promise = SyncPromise.reject(rejectedPromise)
            .then(null, (err: Promise<any>) => {
               expect(err).to.be.eql(rejectedPromise)
               err.catch(err => err)
               done()
            })
         expect(isSyncPromise(promise)).to.be.true
      })
   })
})