"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const SyncPromise_1 = require("../SyncPromise");
const sinon = require("sinon");
describe('StaticMethods', () => {
    let spy;
    let notCallableSpy;
    beforeEach(() => {
        spy = sinon.spy();
        notCallableSpy = sinon.spy();
    });
    describe('.all', () => {
        it('When passed argument is array which do not has Promise, should return SyncPromise', done => {
            const promise = SyncPromise_1.SyncPromise.all(['FakeString', null, 10, SyncPromise_1.SyncPromise.resolve(5)]);
            chai_1.expect(promise).to.be.instanceof(SyncPromise_1.SyncPromise);
            promise.then(() => done());
        });
        it('When passed argument is array which has Promise, should return Promise', done => {
            const promise = SyncPromise_1.SyncPromise.all(['FakeString', null, 10, SyncPromise_1.SyncPromise.resolve(5), Promise.resolve(10)]);
            chai_1.expect(promise).to.be.instanceof(Promise);
            promise.then(() => done());
        });
        it('When passed argument is array with value, should be resolved with array which has that value', done => {
            SyncPromise_1.SyncPromise.all([5])
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith([5])).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is array with resolved SyncPromise, should be resolved with array which has value of that SyncPromise', done => {
            SyncPromise_1.SyncPromise.all([1, SyncPromise_1.SyncPromise.resolve(5), 10])
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith([1, 5, 10])).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is array with rejected SyncPromise, should be rejected with value of that SyncPromise', done => {
            SyncPromise_1.SyncPromise.all([1, SyncPromise_1.SyncPromise.reject(5), 10])
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is array with resolved Promise, should be resolved with array which has value of that Promise', done => {
            SyncPromise_1.SyncPromise.all([1, Promise.resolve(5), 10])
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith([1, 5, 10])).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is array with rejected Promise, should be rejected with value of that Promise', done => {
            SyncPromise_1.SyncPromise.all([1, Promise.reject(5), 10])
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is array with many any type items, should be resolved with array which has that values and values of Promises', done => {
            const fakeObject = {}, fakeArray = [];
            SyncPromise_1.SyncPromise.all(['FakeString', null, 10, fakeObject, fakeArray, SyncPromise_1.SyncPromise.resolve(5), Promise.resolve(10)])
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith(['FakeString', null, 10, fakeObject, fakeArray, 5, 10])).to.be.true;
                chai_1.expect(spy.firstCall.args[0][3]).to.be.equal(fakeObject);
                chai_1.expect(spy.firstCall.args[0][4]).to.be.equal(fakeArray);
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
    });
    describe('.resolve', () => {
        it('When passed argument is not a Promise, should return SyncPromise', done => {
            const promise = SyncPromise_1.SyncPromise.resolve('FakeString');
            chai_1.expect(promise).to.be.instanceof(SyncPromise_1.SyncPromise);
            promise.then(() => done());
        });
        it('When passed argument is  Promise, should return Promise', done => {
            const promise = SyncPromise_1.SyncPromise.resolve(Promise.resolve(10));
            chai_1.expect(promise).to.be.instanceof(Promise);
            promise.then(() => done());
        });
        it('When passed argument is value, should be resolved with that value', done => {
            SyncPromise_1.SyncPromise.resolve(5)
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is resolved Promise, should be resolved with value of that Promise', done => {
            SyncPromise_1.SyncPromise.resolve(Promise.resolve(5))
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is rejected Promise, should be rejected with value of that Promise', done => {
            SyncPromise_1.SyncPromise.resolve(Promise.reject(5))
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is resolved SyncPromise, should be resolved with value of that SyncPromise', done => {
            SyncPromise_1.SyncPromise.resolve(SyncPromise_1.SyncPromise.resolve(5))
                .then(spy, notCallableSpy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is rejected SyncPromise, should be rejected with value of that SyncPromise', done => {
            SyncPromise_1.SyncPromise.resolve(SyncPromise_1.SyncPromise.reject(5))
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
    });
    describe('.reject', () => {
        it('When passed argument is not a Promise, should return SyncPromise', done => {
            const promise = SyncPromise_1.SyncPromise.reject('FakeString');
            chai_1.expect(promise).to.be.instanceof(SyncPromise_1.SyncPromise);
            promise.then(null, () => done());
        });
        it('When passed argument is Promise, should return Promise', done => {
            const promise = SyncPromise_1.SyncPromise.reject(Promise.resolve(10));
            chai_1.expect(promise).to.be.instanceof(Promise);
            promise.then(null, () => done());
        });
        it('When passed argument is value, should be rejected with that value', done => {
            SyncPromise_1.SyncPromise.reject(5)
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(5)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is resolved Promise, should be rejected with that Promise', done => {
            const resolvedPromise = Promise.resolve(5);
            SyncPromise_1.SyncPromise.reject(resolvedPromise)
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(resolvedPromise)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is rejected Promise, should be rejected with that Promise', done => {
            const spy = sinon.spy((err) => err.catch(err => err));
            const rejectedPromise = Promise.reject(5);
            SyncPromise_1.SyncPromise.reject(rejectedPromise)
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(rejectedPromise)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is resolved SyncPromise, should be rejected with that SyncPromise', done => {
            const resolvedPromise = SyncPromise_1.SyncPromise.resolve(5);
            SyncPromise_1.SyncPromise.reject(resolvedPromise)
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(resolvedPromise)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
        it('When passed argument is rejected SyncPromise, should be rejected with that SyncPromise', done => {
            const spy = sinon.spy((err) => err.catch(err => err));
            const rejectedPromise = SyncPromise_1.SyncPromise.reject(5);
            SyncPromise_1.SyncPromise.reject(rejectedPromise)
                .then(notCallableSpy, spy)
                .then(() => {
                chai_1.expect(spy.calledWith(rejectedPromise)).to.be.true;
                chai_1.expect(notCallableSpy.notCalled).to.be.true;
            })
                .then(() => done());
        });
    });
});
