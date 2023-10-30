// This is used to reduce the performance penalty of Error construction
// when we are throwing away a caught error anyway.
export function catcher<F extends () => any>(
  fn: F
): OverloadReturnType<F> | undefined
export function catcher<F extends () => any, E>(
  fn: F,
  caughtValue: E
): OverloadReturnType<F> | E
export function catcher<F extends () => any, E = undefined>(
  fn: F,
  caughtValue?: E
) {
  const originalStackTraceLimit = Error.stackTraceLimit
  Error.stackTraceLimit = 0
  try {
    return fn()
  } catch {
    return caughtValue
    /* c8 ignore next */
  } finally {
    Error.stackTraceLimit = originalStackTraceLimit
  }
}

export function catchWrap<F extends (...a: any[]) => any>(
  fn: F
): (...a: OverloadParams<F>) => OverloadReturnType<F> | undefined
export function catchWrap<F extends (...a: any[]) => any, E>(
  fn: F,
  caughtValue: E
): (...a: OverloadParams<F>) => OverloadReturnType<F> | E
export function catchWrap<
  F extends (...a: any[]) => any,
  E = undefined
>(fn: F, caughtValue?: E) {
  return (...a: OverloadParams<F>) =>
    catcher(() => fn(...a), caughtValue)
}

/**
 * like ReturnType<F>, but a union of the return types of up to 10 overloads
 *
 * @typeParam F - the (possibly overloaded) function
 */
export type OverloadReturnType<F> = TupleUnion<
  UnarrayArray<FilterTupleUnknown<ORTuple<F>>>
>

/**
 * Get member type from array/tuple type
 */
export type Unarray<A> = A extends (infer V)[] ? V : A

/**
 * Get tuple of member types from array of array types
 */
export type UnarrayArray<L> = L extends [infer H, ...infer T]
  ? H extends unknown[]
    ? T extends unknown[][]
      ? [Unarray<H>, ...UnarrayArray<T>]
      : [Unarray<H>]
    : true
  : L

/**
 * Create a union from a tuple type
 */
export type TupleUnion<L> = L extends [infer H, ...infer T]
  ? H | TupleUnion<T>
  : never

/**
 * Convert all `unknown[]` types in an array type to `never`
 */
export type NeverUnknown<T extends unknown[]> = unknown[] extends T
  ? (T extends {}[] ? true : false) extends true
    ? any[]
    : never
  : T

/**
 * Filter out `unknown[]` types from a tuple by converting them to `never[]`
 */
export type FilterTupleUnknown<L> = L extends [infer H, ...infer T]
  ? H extends unknown[]
    ? T extends unknown[][]
      ? [NeverTupleUnknown<H>, ...FilterTupleUnknown<T>]
      : [NeverTupleUnknown<H>]
    : FilterTupleUnknown<T>
  : L

/**
 * Get overloaded return values as tuple of arrays
 */
export type ORTuple<F> = F extends {
  (...a: any[]): infer A0
  (...a: any[]): infer A1
  (...a: any[]): infer A2
  (...a: any[]): infer A3
  (...a: any[]): infer A4
  (...a: any[]): infer A5
  (...a: any[]): infer A6
  (...a: any[]): infer A7
  (...a: any[]): infer A8
  (...a: any[]): infer A9
}
  ? [A0[], A1[], A2[], A3[], A4[], A5[], A6[], A7[], A8[], A9[]]
  : never

/**
 * Get overloaded Parameters types as 10-tuple. When the function has less
 * than 10 overloaded signatures, the remaining param sets will be set to
 * `unknown`.
 *
 * @internal
 */
export type OverloadParamsTuple<F> = F extends {
  (...a: infer A0): any
  (...a: infer A1): any
  (...a: infer A2): any
  (...a: infer A3): any
  (...a: infer A4): any
  (...a: infer A5): any
  (...a: infer A6): any
  (...a: infer A7): any
  (...a: infer A8): any
  (...a: infer A9): any
}
  ? [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9]
  : never
/**
 * like Parameters<F>, but a union of parameter sets for up to 10 overloads
 */
export type OverloadParams<F> = TupleUnion<
  FilterUnknown<OverloadParamsTuple<F>>
>

/**
 * Convert all `unknown[]` types in an array type to `never[]`
 */
export type NeverTupleUnknown<T extends unknown[]> =
  unknown[] extends T
    ? (T extends {}[] ? true : false) extends true
      ? any[]
      : never[]
    : T

/**
 * Filter out `unknown[]` types from a tuple by converting them to `never`
 */
export type FilterUnknown<L> = L extends [infer H, ...infer T]
  ? H extends unknown[]
    ? T extends unknown[][]
      ? [NeverUnknown<H>, ...FilterUnknown<T>]
      : [NeverUnknown<H>]
    : FilterUnknown<T>
  : L
