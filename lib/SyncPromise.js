"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var STATES;
(function (STATES) {
    STATES["PENDING"] = "PENDING";
    STATES["RESOLVED"] = "RESOLVED";
    STATES["REJECTED"] = "REJECTED";
})(STATES || (STATES = {}));
var RESULT_TYPES;
(function (RESULT_TYPES) {
    RESULT_TYPES["PROMISE"] = "PROMISE";
    RESULT_TYPES["SYNCPROMISE"] = "SYNCPROMISE";
    RESULT_TYPES["VALUE"] = "VALUE";
})(RESULT_TYPES || (RESULT_TYPES = {}));
class SyncPromise {
    constructor(executor) {
        this.state = STATES.PENDING;
        this.isSyncPromise = true;
        this.resolve = (result) => {
            if (this.state !== STATES.PENDING)
                return this;
            this.state = STATES.RESOLVED;
            this.setResult(result);
            return this;
        };
        this.reject = (reason) => {
            if (this.state !== STATES.PENDING)
                return this;
            this.state = STATES.REJECTED;
            this.setResult(reason);
            return this;
        };
        executor && this.executeExecutor(executor);
    }
    executeExecutor(executor) {
        try {
            executor(this.resolve, this.reject);
        }
        catch (err) {
            this.reject(err);
        }
    }
    then(onfulfilled, onrejected) {
        if (this.state === STATES.RESOLVED) {
            if (this.resultType === RESULT_TYPES.VALUE) {
                return SyncPromise.resolve(onfulfilled ? this.executeSync(onfulfilled, this.result) : this.result);
            }
            if (this.resultType === RESULT_TYPES.SYNCPROMISE) {
                return this.result.then(val => {
                    return (onfulfilled ? this.executeSync(onfulfilled, val) : val);
                }, err => {
                    return (onrejected ? this.executeSync(onrejected, err) : err);
                });
            }
            if (this.resultType === RESULT_TYPES.PROMISE) {
                return this.result.then(val => {
                    return (onfulfilled ? this.executeAsync(onfulfilled, val) : val);
                }, err => {
                    return (onrejected ? this.executeAsync(onrejected, err) : err);
                });
            }
        }
        if (this.state === STATES.REJECTED) {
            if (this.resultType === RESULT_TYPES.VALUE) {
                if (onrejected) {
                    return SyncPromise.resolve(this.executeSync(onrejected, this.result));
                }
                else {
                    return SyncPromise.reject(this.result);
                }
            }
            if (this.resultType === RESULT_TYPES.SYNCPROMISE) {
                return SyncPromise.resolve(onrejected ? this.executeSync(onrejected, this.result) : this.result);
            }
            if (this.resultType === RESULT_TYPES.PROMISE) {
                return Promise.resolve(onrejected ? this.executeAsync(onrejected, this.result) : this.result);
            }
        }
        return this;
    }
    catch(onrejected) {
        return this.then(null, onrejected);
    }
    executeAsync(cb, value) {
        try {
            return cb(value);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    executeSync(cb, value) {
        try {
            return cb(value);
        }
        catch (err) {
            return SyncPromise.reject(err);
        }
    }
    setResult(value) {
        if (!value || !value.then) {
            this.resultType = RESULT_TYPES.VALUE;
        }
        else {
            if (value.isSyncPromise) {
                this.resultType = RESULT_TYPES.SYNCPROMISE;
            }
            else {
                this.resultType = RESULT_TYPES.PROMISE;
            }
        }
        this.result = value;
    }
    // Default realization
    static all(values) {
        const promises = [];
        const results = [];
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            if (!value || !value.then) {
                results[i] = value;
            }
            else {
                if (value.isSyncPromise) {
                    if (value.state === STATES.RESOLVED) {
                        results[i] = value.result;
                    }
                    else if (value.state === STATES.REJECTED) {
                        return SyncPromise.reject(value.result);
                    }
                }
                else {
                    value.then((result) => {
                        results[i] = result;
                    }, (err) => {
                        promises.push(SyncPromise.reject(err));
                    });
                    promises.push(value);
                }
            }
        }
        if (promises.length > 0) {
            return Promise.all(promises).then(() => results);
        }
        else {
            return new SyncPromise().resolve(results);
        }
    }
    static resolve(value) {
        if (value && value.then) {
            return value;
        }
        return new SyncPromise().resolve(value);
    }
    static reject(reason) {
        if (SyncPromise.isRealPromise(reason)) {
            return Promise.reject(reason);
        }
        return new SyncPromise((resolve, reject) => reject(reason));
    }
    static isPromise(value) {
        return value && value.then;
    }
    static isRealPromise(value) {
        return value && value.then && !value.isSyncPromise;
    }
    static isSyncPromise(value) {
        return value && value.isSyncPromise;
    }
}
exports.SyncPromise = SyncPromise;
