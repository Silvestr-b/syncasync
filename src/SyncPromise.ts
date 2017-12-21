

enum STATES {
   PENDING = 'PENDING',
   RESOLVED = 'RESOLVED',
   REJECTED = 'REJECTED'
}


class SyncPromise<T> implements Promise<T> {

   readonly [Symbol.toStringTag]: 'Promise';
   private state: STATES = STATES.PENDING;
   private result: T | Promise<T>;

   constructor(
      executor: (
         resolve: (value: T | Promise<T>) => void,
         reject: (reason: T | Promise<T>) => void
      ) => void
   ) {
      try {
         executor(this.resolve, this.reject)
      } catch (err) {
         this.reject(err)
      }
   }

   then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {

      if (this.state === STATES.RESOLVED) {
         if (SyncPromise.isRealPromise(this.result)) {
            return (<Promise<T>>this.result).then(val => {
               try {
                  return (onfulfilled ? onfulfilled(val) : <any>val)
               } catch (err) {
                  return Promise.reject(err)
               }
            }, err => {
               try {
                  return (onrejected ? onrejected(err) : <any>err)
               } catch (err) {
                  return Promise.reject(err)
               }
            })
         }

         if (SyncPromise.isSyncPromise(this.result)) {
            return (<SyncPromise<T>>this.result).then(val => {
               try {
                  return (onfulfilled ? onfulfilled(val) : <any>val)
               } catch (err) {
                  return SyncPromise.reject(err)
               }
            }, err => {
               try {
                  return (onrejected ? onrejected(err) : <any>err)
               } catch (err) {
                  return SyncPromise.reject(err)
               }
            })
         }

         try {
            return SyncPromise.resolve(onfulfilled ? onfulfilled(<T>this.result) : <any>this.result)
         } catch (err) {
            return SyncPromise.reject(err)
         }

      }

      if (this.state === STATES.REJECTED) {
         if (SyncPromise.isRealPromise(this.result)) {
            try {
               return Promise.resolve(onrejected ? onrejected(this.result) : <any>this.result)
            } catch (err) {
               return Promise.reject(err)
            }
         }

         if (SyncPromise.isSyncPromise(this.result)) {
            try {
               return SyncPromise.resolve(onrejected ? onrejected(this.result) : <any>this.result)
            } catch (err) {
               return SyncPromise.reject(err)
            }
         }

         try {
            if (onrejected) {
               return SyncPromise.resolve(<any>onrejected(<T>this.result))
            } else {
               return SyncPromise.reject(<any>this.result)
            }
         } catch (err) {
            return SyncPromise.reject(err)
         }

      }

      return <any>this
   }

   catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
      return this.then(null, onrejected)
   }


   private resolve = (result: T | Promise<T>) => {
      if (this.state !== STATES.PENDING) return
      this.state = STATES.RESOLVED;
      this.result = result;
   }

   private reject = (reason: T | Promise<T>) => {
      if (this.state !== STATES.PENDING) return
      this.state = STATES.REJECTED;
      this.result = reason;
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

         if (SyncPromise.isSyncPromise(value) || SyncPromise.isRealPromise(value)) {
            if (value instanceof SyncPromise) {
               if (value.state === "RESOLVED") {
                  results[i] = value.result
               }
               if (value.state === "REJECTED") {
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

         } else {
            results[i] = value
         }
      }

      if (promises.length > 0) {
         return Promise.all(promises).then(() => results)
      } else {
         return SyncPromise.resolve(results)
      }
   }

   static resolve<T>(value: T | Promise<T>) {
      if (SyncPromise.isSyncPromise(value) || SyncPromise.isRealPromise(value)) {
         return <Promise<T>>value
      }
      return new SyncPromise<T>((resolve, reject) => resolve(value))
   }

   static reject<T>(reason: T | Promise<T>) {
      if (SyncPromise.isRealPromise(reason)) {
         return <Promise<T>>Promise.reject(reason)
      }
      return new SyncPromise<T>((resolve, reject) => reject(reason))
   }

   private static isRealPromise(value: any) {
      return value && value.then && typeof value.then === 'function' && !(value instanceof SyncPromise)
   }

   private static isSyncPromise(value: any) {
      return value instanceof SyncPromise
   }

}


export { SyncPromise }