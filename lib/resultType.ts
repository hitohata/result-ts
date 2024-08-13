export type Result<T, E> = IOk<T> | IErr<E>;
export const Ok = <T>(value: T): Result<T, never> => new OK<T>(value);
export const ok = Ok;
export const Err = <E>(error: E): Result<never, E> => new ERR<E>(error);
export const err = Err;

interface IOk<T> {
	/**
	 * Return true if the result is ok.
	 */
	ok: true;
	/**
	 * Return true if the result is err.
	 */
	err: false;
	/**
	 * Return a value, a normal case value.
	 */
	value: T;
	/**
	 * Return a normal case value.
	 * Then the result is err, this function raise error.
	 * Do not use in the production environment.
	 */
	unwrap(): T;
	/**
	 * Return a normal case value.
	 * Then the result is err, this function returns an argument.
	 */
	unwrapOrElse(defaultValue: any): T;
	/**
	 * Return an  abnormal case value.
	 * Then the result is ok, this function raise error.
	 * Do not use in the production environment.
	 */
	unwrapError(): never;
}

interface IErr<E> {
	/**
	 * Return true if the result is ok.
	 */
	ok: false;
	/**
	 * Return true if the result is err.
	 */
	err: true;
	/**
	 * Return an error, an abnormal case value.
	 */
	error: E;
	/**
	 * Return a normal case value.
	 * Then the result is err, this function raise error.
	 * Do not use in the production environment.
	 */
	unwrap(): never;
	/**
	 * Return a normal case value.
	 * Then the result is err, this function returns an argument.
	 */
	unwrapOrElse(DefaultValue: any): any;
	/**
	* Return an  abnormal case value.
	* Then the result is ok, this function raise error.
	* Do not use in the production environment.
	*/
	unwrapError(): E;
}

class OK<T> implements IOk<T> {
	public readonly ok: true;
	public readonly err: false;
	public readonly value: T;

	constructor(value: T) {
		this.ok = true;
		this.err = false;
		this.value = value;
	}

	/**
	 * Return a value without a type gard.
	 */
	unwrap(): T {
		return this.value;
	}

	/**
	 * return a value.
	 * @param defaultValue
	 */
	unwrapOrElse(defaultValue: T): T {
		return this.value;
	}

	/**
	 * This method must throw an error.
	 * @throws Error
	 */
	unwrapError(): never {
		throw Error("This result is OK");
	}
}

class ERR<E> implements IErr<E> {
	readonly ok: false;
	readonly err: true;
	readonly error: E;

	constructor(error: E) {
		this.ok = false;
		this.err = true;
		this.error = error;
	}

	/**
	 * This function throw an error.
	 * @throws Error
	 */
	unwrap(): never {
		throw Error("This result is error");
	}

	/**
	 * Returns a default value that passed as an argument.
	 * @param defaultValue
	 */
	unwrapOrElse(defaultValue: any): any {
		return defaultValue;
	}

	/**
	 * Return an error.
	 */
	unwrapError(): E {
		return this.error;
	}
}

/**
 * get the Result lists from a list of argument.
 * Then return a Result.
 * The error of result is the first error of the list of argument.
 * If the result doesn't contain an error, return Ok(null).
 * Using this, you can use unwrap after this check function.
 * @param results
 */
export const hasError = <E>(results: Result<any, E>[]): Result<null, E> => {
	for (const result of results) {
		if (!result.ok) {
			return Err(result.error);
		}
	}

	return Ok(null);
};
