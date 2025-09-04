export type Result<OkType, ErrType> = Ok<OkType> | Err<ErrType>;

export type Ok<TData> = {
	readonly tag: "ok";
	readonly data: TData;
};

export type Err<TError> = {
	readonly tag: "err";
	readonly error: TError;
};

// Result constructors
export const ok = <TData>(data: TData): Ok<TData> => ({
	data,
	tag: "ok",
});

export const err = <TError>(error: TError): Err<TError> => ({
	error,
	tag: "err",
});
