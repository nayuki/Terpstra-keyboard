/*

QueryData.js

A function to parse data from a query string

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates an object containing data parsed from the specified query string. The
 * parameters are:
 *
 * queryString        - the query string to parse. The query string may start
 *                      with a question mark, spaces may be encoded either as
 *                      plus signs or the escape sequence '%20', and both
 *                      ampersands and semicolons are permitted as separators.
 *                      This optional parameter defaults to query string from
 *                      the page URL.
 * preserveDuplicates - true if duplicate values should be preserved by storing
 *                      an array of values, and false if duplicates should
 *                      overwrite earler occurrences. This optional parameter
 *                      defaults to false.
 */
function QueryData(queryString?: string, preserveDuplicates?: boolean): Map<string,string|Array<string>> {
	let result = new Map<string,string|Array<string>>();
	
	// if a query string wasn't specified, use the query string from the URL
	if (queryString == undefined)
		queryString = location.search ? location.search : "";
	
	// remove the leading question mark from the query string if it is present
	if (queryString.charAt(0) == "?")
		queryString = queryString.substring(1);
	
	// check whether the query string is empty
	if (queryString.length > 0) {
		
		// replace plus signs in the query string with spaces
		queryString = queryString.replace(/\+/g, " ");
		
		// split the query string around ampersands and semicolons
		const queryComponents: Array<string> = queryString.split(/[&;]/g);
		
		// loop over the query string components
		for (const component of queryComponents) {
			
			// extract this component's key-value pair
			const keyValuePair: Array<string> = component.split("=");
			const key: string          = decodeURIComponent(keyValuePair[0]);
			const value: string        = keyValuePair.length > 1
			                 ? decodeURIComponent(keyValuePair[1])
			                 : "";
			
			// check whether duplicates should be preserved
			if (preserveDuplicates) {
				
				// create the value array if necessary and store the value
				if (!result.has(key))
					result.set(key, []);
				let arr = result.get(key);
				if (!Array.isArray(arr))
					throw new Error("Assertion error");
				arr.push(value);
				
			} else {
				
				// store the value
				result.set(key, value);
				
			}
		}
	}
	
	return result;
}



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



function mapGetMaybe<K,V>(map: Map<K,V>, key: K): Maybe<V> {
	if (!map.has(key))
		return new None<V>();
	const val: V|undefined = map.get(key);
	if (val === undefined)
		throw new Error("Assertion error");
	return new Some<V>(val);
}
