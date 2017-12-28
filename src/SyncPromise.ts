

enum STATES {
   PENDING = 'PENDING',
   RESOLVED = 'RESOLVED',
   REJECTED = 'REJECTED'
}

enum RESULT_TYPES {
   PROMISE = 'PROMISE',
   SYNCPROMISE = 'SYNCPROMISE',
   VALUE = 'VALUE'
}


class SyncPromise<T> implements Promise<T> {

   readonly [Symbol.toStringTag]: 'Promise';
   private state: STATES = STATES.PENDING;
   private result: T | Promise<T>;
   private resultType: RESULT_TYPES;
   private isSyncPromise = true;

   constructor(
      executor?: (
         resolve: (value: T | Promise<T>) => void,
         reject: (reason: T | Promise<T>) => void
      ) => void
   ) {
      executor && this.executeExecutor(executor)
   }

   private executeExecutor(executor: any){
      try {
         executor(this.resolve, this.reject)
      } catch (err) {
         this.reject(err)
      }
   }

   then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
      
      if (this.state === STATES.RESOLVED) {
         if(this.resultType === RESULT_TYPES.VALUE){
            return SyncPromise.resolve(onfulfilled ? this.executeSync(onfulfilled, <T>this.result) : <any>this.result)
         }

         if (this.resultType === RESULT_TYPES.SYNCPROMISE) {
            return (<SyncPromise<T>>this.result).then(val => {
               return (onfulfilled ? this.executeSync(onfulfilled, val) : <any>val)
            }, err => {
               return (onrejected ? this.executeSync(onrejected, err) : <any>err)
            })
         }

         if (this.resultType === RESULT_TYPES.PROMISE) {
            return (<Promise<T>>this.result).then(val => {
               return (onfulfilled ? this.executeAsync(onfulfilled, val) : <any>val)
            }, err => {
               return (onrejected ? this.executeAsync(onrejected, err) : <any>err)
            })
         }  
         
      }

      if (this.state === STATES.REJECTED) {
         if(this.resultType === RESULT_TYPES.VALUE){
            if (onrejected) {
               return SyncPromise.resolve(this.executeSync(onrejected, this.result))
            } else {
               return SyncPromise.reject(<any>this.result)
            }
         }

         if (this.resultType === RESULT_TYPES.SYNCPROMISE) {
            return SyncPromise.resolve(onrejected ? this.executeSync(onrejected, this.result) : <any>this.result)
         }

         if (this.resultType === RESULT_TYPES.PROMISE) {
            return Promise.resolve(onrejected ? this.executeAsync(onrejected, this.result) : <any>this.result)
         }
        
      }
     
      return <any>this
   }

   catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
      return this.then(null, onrejected)
   }

   private executeAsync(cb: any, value: any){
      try {
         return cb(value)
      } catch (err) {
         return Promise.reject(err)
      }
   }

   private executeSync(cb: any, value: any){
      try {
         return cb(value)
      } catch (err) {
         return SyncPromise.reject(err)
      }
   }

   private resolve = (result: T | Promise<T>) => {
      if (this.state !== STATES.PENDING) return this
      this.state = STATES.RESOLVED;
      this.setResult(result);
      return this
   }

   private reject = (reason: T | Promise<T>) => {
      if (this.state !== STATES.PENDING) return this
      this.state = STATES.REJECTED;
      this.setResult(reason);
      return this
   }

   private setResult(value: any){
      if(!value || !value.then){
         this.resultType = RESULT_TYPES.VALUE
      } else {
         if(value.isSyncPromise){
            this.resultType = RESULT_TYPES.SYNCPROMISE
         } else {
            this.resultType = RESULT_TYPES.PROMISE
         }
      }
      
      this.result = value;
   }

   // Variants of overload
   static all<T1, T2, T3, T4, T5>(values: [Promise<T1> | T1, Promise<T2> | T2, Promise<T3> | T3, Promise<T4> | T4, Promise<T5> | T5]): Promise<[T1, T2, T3, T4, T5]>;
   static all<T1, T2, T3, T4>(values: [Promise<T1> | T1, Promise<T2> | T2, Promise<T3> | T3, Promise<T4> | T4]): Promise<[T1, T2, T3, T4]>;
   static all<T1, T2, T3>(values: [Promise<T1> | T1, Promise<T2> | T2, Promise<T3> | T3]): Promise<[T1, T2, T3]>;
   static all<T1, T2>(values: [Promise<T1> | T1, Promise<T2> | T2]): Promise<[T1, T2]>;
   static all<T1>(values: [Promise<T1> | T1]): Promise<[T1]>;
   static all(values: any[]): Promise<any[]>;

   // Default realization
   static all(values: any[]): Promise<any[]> {
      const promises: Promise<any>[] = [];
      const results: any[] = [];   

      for (let i = 0; i < values.length; i++) {
         const value = values[i];

         if (!value || !value.then) {
            results[i] = value
         } else {
            if (value.isSyncPromise) {
               if (value.state === STATES.RESOLVED) {
                  results[i] = value.result
               } else
               if (value.state === STATES.REJECTED) {
                  return SyncPromise.reject(value.result)
               }
            } else {
               value.then((result: any) => {
                  results[i] = result;
               }, (err: any) => {
                  promises.push(SyncPromise.reject(err));
               });

               promises.push(value);
            }
         }
      }

      if (promises.length > 0) {
         return Promise.all(promises).then(() => results)
      } else {
         return new SyncPromise<any[]>().resolve(results)
      }
   }

   static resolve<T>(value: T | Promise<T>) {
      if (value && (<Promise<T>>value).then) {
         return <Promise<T>>value
      }
      return new SyncPromise<T>().resolve(value)
   }

   static reject<T>(reason: T | Promise<T>) {
      if (SyncPromise.isRealPromise(reason)) {
         return <Promise<T>>Promise.reject(reason)
      }
      return new SyncPromise<T>((resolve, reject) => reject(reason))
   }

   static isPromise(value: any) {
      return value && value.then
   }
   
   static isRealPromise(value: any) {
      return value && value.then && !value.isSyncPromise
   }

   static isSyncPromise(value: any) {
      return value && value.isSyncPromise
   }

}


export { SyncPromise }