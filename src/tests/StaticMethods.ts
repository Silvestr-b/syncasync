import { expect } from 'chai'
import { SyncPromise } from '../SyncPromise'
import { isSyncPromise, isRealPromise } from './utils'


describe('StaticMethods', () => {
   describe('.all', () => {

      it('When passed array do not has Promise, should return SyncPromise', done => {
         const promise = SyncPromise.all(['FakeString', null, 10, SyncPromise.resolve(5)])
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('When passed array has Promise, should return Promise', done => {
         const promise = SyncPromise.all(['FakeString', null, 10, SyncPromise.resolve(5), Promise.resolve(10)])
         expect(isRealPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('When passed array with value, should be resolved with array which has that value', done => {
         SyncPromise.all([5])
            .then(result => {
               expect(result).to.be.eql([5])
            })
            .then(() => done())
      })

      it('When passed array with resolved SyncPromise, should be resolved with array which has value of that SyncPromise', done => {
         SyncPromise.all([1, SyncPromise.resolve(5), 10])
            .then(result => {
               expect(result).to.be.eql([1, 5, 10])
            })
            .then(() => done())
      })

      it('When passed array with rejected SyncPromise, should be rejected with value of that SyncPromise', done => {
         SyncPromise.all([1, SyncPromise.reject(5), 10])
            .then(null, err => {
               expect(err).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed array with resolved Promise, should be resolved with array which has value of that Promise', done => {
         SyncPromise.all([1, Promise.resolve(5), 10])
            .then(result => {
               expect(result).to.be.eql([1, 5, 10])
            })
            .then(() => done())
      })

      it('When passed array with rejected Promise, should be rejected with value of that Promise', done => {
         SyncPromise.all([1, Promise.reject(5), 10])
            .then(null, err => {
               expect(err).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed array with many any type items, should be resolved with array which has that values and values of Promises', done => {
         const fakeObject = {}, fakeArray: any[] = [];
         SyncPromise.all(['FakeString', null, 10, fakeArray, fakeObject, SyncPromise.resolve(5), Promise.resolve(10)])
            .then(result => {
               expect(result).to.be.eql(['FakeString', null, 10, fakeArray, fakeObject, 5, 10])
            })
            .then(() => done())
      })

   })

   describe('.resolve', () => {

      it('When passed value is not a Promise, should return SyncPromise', done => {
         const promise = SyncPromise.resolve('FakeString')
         expect(isSyncPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('When passed value is Promise, should return Promise', done => {
         const promise = SyncPromise.resolve(Promise.resolve(10))
         expect(isRealPromise(promise)).to.be.true
         promise.then(() => done())
      })

      it('When passed value, should be resolved with that value', done => {
         SyncPromise.resolve(5)
            .then(result => {
               expect(result).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed resolved Promise, should be resolved with value of that Promise', done => {
         SyncPromise.resolve(Promise.resolve(5))
            .then(result => {
               expect(result).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed rejected Promise, should be rejected with value of that Promise', done => {
         SyncPromise.resolve(Promise.reject(5))
            .then(null, err => {
               expect(err).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed resolved SyncPromise, should be resolved with value of that SyncPromise', done => {
         SyncPromise.resolve(SyncPromise.resolve(5))
            .then(result => {
               expect(result).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed rejected SyncPromise, should be rejected with value of that SyncPromise', done => {
         SyncPromise.resolve(SyncPromise.reject(5))
            .then(null, err => {
               expect(err).to.be.eql(5)
            })
            .then(() => done())
      })
      
   })

   describe('.reject', () => {

      it('When passed value is not a Promise, should return SyncPromise', done => {
         const promise = SyncPromise.reject('FakeString')
         expect(isSyncPromise(promise)).to.be.true
         promise.then(null, () => done())
      })

      it('When passed value is Promise, should return Promise', done => {
         const promise = SyncPromise.reject(Promise.resolve(10))
         expect(isRealPromise(promise)).to.be.true
         promise.then(null, () => done())
      })

      it('When passed value, should be rejected with that value', done => {
         SyncPromise.reject(5)
            .then(null, err => {
               expect(err).to.be.eql(5)
            })
            .then(() => done())
      })

      it('When passed resolved Promise, should be rejected with that Promise', done => {
         const resolvedPromise = Promise.resolve(5);
         SyncPromise.reject(resolvedPromise)
            .then(null, err => {
               expect(err).to.be.eql(resolvedPromise)
            })
            .then(() => done())
      })

      it('When passed rejected Promise, should be rejected with that Promise', done => {
         const rejectedPromise = Promise.reject(5);
         SyncPromise.reject(rejectedPromise)
            .then(null, (err: Promise<any>) => {
               expect(err).to.be.eql(rejectedPromise)
               err.catch(err => err)
            })
            .then(() => done())
      })

      it('When passed resolved SyncPromise, should be rejected with that SyncPromise', done => {
         const resolvedPromise = SyncPromise.resolve(5);
         SyncPromise.reject(resolvedPromise)
            .then(null, err => {
               expect(err).to.be.eql(resolvedPromise)
            })
            .then(() => done())
      })

      it('When passed rejected SyncPromise, should be rejected with that SyncPromise', done => {
         const rejectedPromise = SyncPromise.reject(5);
         SyncPromise.reject(rejectedPromise)
            .then(null, (err: Promise<any>) => {
               expect(err).to.be.eql(rejectedPromise)
               err.catch(err => err)
            })
            .then(() => done())
      })
      
   })
})