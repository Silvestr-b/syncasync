declare class SyncPromise<T> implements Promise<T> {
    readonly [Symbol.toStringTag]: 'Promise';
    private state;
    private result;
    private resultType;
    private isSyncPromise;
    constructor(executor?: (resolve: (value: T | Promise<T>) => void, reject: (reason: T | Promise<T>) => void) => void);
    private executeExecutor(executor);
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    private executeAsync(cb, value);
    private executeSync(cb, value);
    private resolve;
    private reject;
    private setResult(value);
    static all<T1, T2, T3, T4, T5>(values: [Promise<T1> | T1, Promise<T2> | T2, Promise<T3> | T3, Promise<T4> | T4, Promise<T5> | T5]): Promise<[T1, T2, T3, T4, T5]>;
    static all<T1, T2, T3, T4>(values: [Promise<T1> | T1, Promise<T2> | T2, Promise<T3> | T3, Promise<T4> | T4]): Promise<[T1, T2, T3, T4]>;
    static all<T1, T2, T3>(values: [Promise<T1> | T1, Promise<T2> | T2, Promise<T3> | T3]): Promise<[T1, T2, T3]>;
    static all<T1, T2>(values: [Promise<T1> | T1, Promise<T2> | T2]): Promise<[T1, T2]>;
    static all<T1>(values: [Promise<T1> | T1]): Promise<[T1]>;
    static all(values: any[]): Promise<any[]>;
    static resolve<T>(value: T | Promise<T>): Promise<T>;
    static reject<T>(reason: T | Promise<T>): Promise<T>;
    static isPromise(value: any): any;
    static isRealPromise(value: any): boolean;
    static isSyncPromise(value: any): any;
}
export { SyncPromise };
