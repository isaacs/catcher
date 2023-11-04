const stlProp = Object.getOwnPropertyDescriptor(
  Error,
  'stackTraceLimit'
)
const hasSTL =
  stlProp && stlProp.writable && typeof stlProp.value === 'number'

/**
 * Run the supplied arity-zero function, and if it throws an error, return the
 * `caughtValue` instead (or `undefined` if not provided).
 *
 * This is *only* safe to do when we know that nothing at any point in the call
 * stack relies on the `Error.stack` property, and only *worth* doing in hot
 * paths where a function is expected to throw often (for example, calling
 * `statSync` on many paths to find the first one that exists).
 */
export function catcher<F extends (...a: any[]) => any>(
  fn: F
): FindReturnType<OverloadMap<F>, []> | undefined
export function catcher<F extends (...a: any[]) => any, E>(
  fn: F,
  caughtValue: E
): FindReturnType<OverloadMap<F>, []> | E
export function catcher<F extends (...a: any[]) => any, E>(
  fn: F,
  caughtValue?: E
) {
  const originalStackTraceLimit = Error.stackTraceLimit
  /* c8 ignore next */
  if (hasSTL) Error.stackTraceLimit = 0
  try {
    return fn()
  } catch {
    return caughtValue
    /* c8 ignore next */
  } finally {
    /* c8 ignore next */
    if (hasSTL) Error.stackTraceLimit = originalStackTraceLimit
  }
}

/**
 * Wrap the supplied function, returning a function that is the equivalent of
 * calling it with {@link catcher}.
 *
 * Returned function will preserve up to 10 overload signatures, adding the
 * return type of the `caughtValue` (or `undefined` if not provided).
 */
export function catchWrap<F extends (...a: any[]) => any>(
  fn: F
): AddReturnType<F, undefined>
export function catchWrap<F extends (...a: any[]) => any, E>(
  fn: F,
  caughtValue: E
): AddReturnType<F, E>
export function catchWrap<
  F extends (...a: any[]) => any,
  E = undefined
>(fn: F, caughtValue?: E) {
  return <P extends unknown[]>(
    ...a: P
  ): FindReturnType<OverloadMap<F>, P> | E =>
    catcher(() => fn(...a), caughtValue) as
      | FindReturnType<OverloadMap<F>, P>
      | E
}

// What follows below is some type gymnastics required to preserve the set of
// signatures in the function interface when it has multiple overloads.

/**
 * Turn an overload function into a `[Parameters,ReturnType][]` list. Always
 * contains 10 entries, any that do not correspond to a defined function
 * signature are sometimes `[never, unknown]`. and sometimes just fail to
 * extend. Haven't figured out why it works sometimes one way and sometimes
 * another. These are filtered out in the subsequent step if it matches the
 * first type.
 */
export type OverloadMapRaw<F> = F extends {
  (...a: infer A0): infer R0
  (...a: infer A1): infer R1
  (...a: infer A2): infer R2
  (...a: infer A3): infer R3
  (...a: infer A4): infer R4
  (...a: infer A5): infer R5
  (...a: infer A6): infer R6
  (...a: infer A7): infer R7
  (...a: infer A8): infer R8
  (...a: infer A9): infer R9
}
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3],
      [NeverUnknown<A4>, R4],
      [NeverUnknown<A5>, R5],
      [NeverUnknown<A6>, R6],
      [NeverUnknown<A7>, R7],
      [NeverUnknown<A8>, R8],
      [NeverUnknown<A9>, R9]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
      (...a: infer A3): infer R3
      (...a: infer A4): infer R4
      (...a: infer A5): infer R5
      (...a: infer A6): infer R6
      (...a: infer A7): infer R7
      (...a: infer A8): infer R8
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3],
      [NeverUnknown<A4>, R4],
      [NeverUnknown<A5>, R5],
      [NeverUnknown<A6>, R6],
      [NeverUnknown<A7>, R7],
      [NeverUnknown<A8>, R8]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
      (...a: infer A3): infer R3
      (...a: infer A4): infer R4
      (...a: infer A5): infer R5
      (...a: infer A6): infer R6
      (...a: infer A7): infer R7
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3],
      [NeverUnknown<A4>, R4],
      [NeverUnknown<A5>, R5],
      [NeverUnknown<A6>, R6],
      [NeverUnknown<A7>, R7]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
      (...a: infer A3): infer R3
      (...a: infer A4): infer R4
      (...a: infer A5): infer R5
      (...a: infer A6): infer R6
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3],
      [NeverUnknown<A4>, R4],
      [NeverUnknown<A5>, R5],
      [NeverUnknown<A6>, R6]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
      (...a: infer A3): infer R3
      (...a: infer A4): infer R4
      (...a: infer A5): infer R5
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3],
      [NeverUnknown<A4>, R4],
      [NeverUnknown<A5>, R5]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
      (...a: infer A3): infer R3
      (...a: infer A4): infer R4
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3],
      [NeverUnknown<A4>, R4]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
      (...a: infer A3): infer R3
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2],
      [NeverUnknown<A3>, R3]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
      (...a: infer A2): infer R2
    }
  ? [
      [NeverUnknown<A0>, R0],
      [NeverUnknown<A1>, R1],
      [NeverUnknown<A2>, R2]
    ]
  : F extends {
      (...a: infer A0): infer R0
      (...a: infer A1): infer R1
    }
  ? [[NeverUnknown<A0>, R0], [NeverUnknown<A1>, R1]]
  : F extends (...a: infer A0) => infer R0
  ? [[NeverUnknown<A0>, R0]]
  : never

/**
 * The same as {@link OverloadMapRaw}, but with the `[never, unknown]`
 * entries filtered out.
 */
export type OverloadMap<F extends (...a: any[]) => any> =
  FilterNeverMap<OverloadMapRaw<F>>

/**
 * Filter [never,unknown] out of a list
 */
export type FilterNeverMap<L> = L extends [h: infer H, ...t: infer T]
  ? [never, unknown] extends H
    ? FilterNeverMap<T>
    : [H, ...FilterNeverMap<T>]
  : []

/**
 * Look up the return type for a Parameters tuple from the
 * filtered overload map
 */
export type FindReturnType<M, P extends unknown[]> = M extends [
  h: infer H,
  ...t: infer T
]
  ? H extends [P, infer R]
    ? R
    : FindReturnType<T, P>
  : never

/**
 * Add a given return type to all entries in an overload map
 */
export type AddReturnTypeToOverloadMap<L, A = undefined> = L extends [
  infer H,
  ...infer T
]
  ? H extends [unknown[], unknown]
    ? [[H[0], H[1] | A], ...AddReturnTypeToOverloadMap<T, A>]
    : []
  : []

/**
 * Add a given return type to all function signatures of a function type
 */
type AddReturnType<
  F extends (...a: any) => any,
  A = undefined
> = MakeOverloadFunction<
  AddReturnTypeToOverloadMap<OverloadMap<F>, A>
>

/**
 * Convert a filtered overload map back into a function type
 */
type MakeOverloadFunction<L extends [unknown[], unknown][]> =
  L extends [infer H, ...infer T]
    ? H extends [unknown[], unknown]
      ? {
          (...p: H[0]): H[1]
        } & (T extends [unknown[], unknown][]
          ? MakeOverloadFunction<T>
          : {})
      : {}
    : {}

/**
 * Convert all `unknown[]` types in an array type to `never`
 *
 * The `(...? true: false) extends true` prevents it filtering out
 * `any[]`, the only other type that `unknown[]` extends.
 */
export type NeverUnknown<T extends unknown[]> = unknown[] extends T
  ? (T extends {}[] ? true : false) extends true
    ? any[]
    : never
  : T
