# @isaacs/catcher

Call a function and return a fallback value or undefined if it throws.

Cuts out the performance overhead of creating a stack trace, for
cases where it won't be used anyway.

## USAGE

```js
import { catcher, catchWrap } from '@isaacs/catcher'
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
being wrapped has up to 10 overload signatures, adding the type
of the `caughtValue` (or undefined if not provided) to the return
type of each signature. For example:

```ts
function x(): boolean
function x(s: string): string
function x(s?: string) {
  if (typeof s === 'undefined') return true
  else if (typeof s === 'string') return s
  else throw new Error('not a string or undefined')
}

const wrapped = catchWrap(x, 99)
const b = wrapped()
//    ^? - boolean | 99
const z = wrapped('y')
//    ^? - string | 99
```

See [the typedocs](https://isaacs.github.io/catcher) for detailed
API info.
