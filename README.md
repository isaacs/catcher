# @isaacs/catcher

Call a function and return a fallback value or undefined if it throws.

Cuts out the performance overhead of creating a stack trace, for
cases where it won't be used anyway.

## USAGE

```js
import { catcher, catchWrap } from '@isaacs/cached'
import { functionThatMightThrow } from 'some-module'

const resultOrUndefined = catcher(functionThatMightThrow)
const resultOr99 = catcher(functionThatMightThrow, 99)

const functionThatDoesNotThrow = catchWrap(functionThatMightThrow)
// this returns undefined rather than throwing
const resultOrUndefined = functionThatDoesNotThrow(123)

const return99onFailure = catchWrap(functionThatMightThrow, 99)
const resultOr99 = return99onFailure(234)
```

Properly supports types for the returned function if the function
being wrapped has up to 10 overload signatures, but the
parameters and return types are each squashed into a single
tuple. For example:

```js
function x(): boolean
function x(s: string): string
function x(s?: string) {
  if (typeof s === 'undefined') return true
  else if (typeof s === 'string') return s
  else throw new Error('not a string or undefined')
}

const wrapped = catchWrap(x, 99)
// wrapped is now (...a: [] | [string]) => boolean | string | 99
```

See [the typedocs](https://isaacs.github.io/catcher) for detailed
API info.
