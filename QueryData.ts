abstract class Maybe<T> {
	
	public abstract map<U>(func: (val:T)=>U): Maybe<U>;
	
	public abstract unwrapOr(defaultVal: T): T;
	
}



class Some<T> extends Maybe<T> {
	
	public constructor(
			private value: T) {
		super();
	}
	
	
	public map<U>(func: (val:T)=>U): Maybe<U> {
		return new Some<U>(func(this.value));
	}
	
	
	public unwrapOr(defaultVal: T): T {
		return this.value;
	}
	
}



class None<T> extends Maybe<T> {
	
	public constructor() {
		super();
	}
	
	
	public map<U>(func: (val:T)=>U): Maybe<U> {
		return new None<U>();
	}
	
	
	public unwrapOr(defaultVal: T): T {
		return defaultVal;
	}
	
}



function uspGetMaybe(usp: URLSearchParams, key: string): Maybe<string> {
	const val: string|null = usp.get(key);
	if (val === null)
		throw new None<string>();
	return new Some<string>(val);
}
