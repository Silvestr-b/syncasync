import { SyncPromise } from '../SyncPromise'
import { expect } from 'chai'


function isRealPromise(value: any) {
   return value && value.then && typeof value.then === 'function' && !(value instanceof SyncPromise)
}

function isSyncPromise(value: any) {
   return value instanceof SyncPromise
}


export { isRealPromise, isSyncPromise } 