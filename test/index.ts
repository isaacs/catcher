import t from 'tap'
import { catcher, catchWrap } from '../src/index.js'

function thrower(): undefined
function thrower(s: string): boolean
function thrower(s?: string) {
  if (s === undefined) return s
  if (s === '') throw new Error('empty string!')
  return s.length % 2 === 1
}

t.test('catcher()', t => {
  t.equal(catcher(thrower), undefined)
  t.equal(
    catcher(() => thrower(''), 123),
    123
  )
  t.equal(
    catcher(() => thrower('123'), 123),
    true
  )
  t.end()
})

t.test('catchWrap', t => {
  const orUndefined = catchWrap(thrower)
  const or99 = catchWrap(thrower, 99)
  t.equal(orUndefined(), undefined)
  t.equal(orUndefined(''), undefined)
  t.equal(orUndefined('123'), true)
  t.equal(or99(), undefined)
  t.equal(or99(''), 99)
  t.equal(or99('123'), true)
  t.end()
})

t.test(
  'preserve stack if Error.stackTraceLimit not a number',
  async t => {
    const stl = Error.stackTraceLimit
    //@ts-expect-error
    Error.stackTraceLimit = 'blorp'
    const { catcher } = await import('../dist/esm/index.js')
    Error.stackTraceLimit = stl
    const foo = () => {
      try {
        bar()
      } catch (er) {
        t.match(String((er as Error).stack), /bar/, 'got a stack')
        throw er
      }
    }
    const bar = () => {
      throw new Error('do not delete me!')
    }
    t.equal(catcher(foo, 420), 420)
  }
)
