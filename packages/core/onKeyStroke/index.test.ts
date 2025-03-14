import type { Ref } from 'vue'
import type { KeyStrokeEventName } from './index'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { onKeyStroke } from './index'

describe('onKeyStroke', () => {
  let element: Ref<HTMLElement>
  let callBackFn: any

  beforeEach(() => {
    element = shallowRef(document.createElement('div'))
    callBackFn = vi.fn()
  })

  function createKeyEvent(key: string, type: KeyStrokeEventName, repeat = false) {
    const ev = new KeyboardEvent(type, { key, repeat })
    element.value.dispatchEvent(ev)
  }

  it('listen to single key', () => {
    onKeyStroke('A', callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('listen to multi keys', () => {
    onKeyStroke(['A', 'B', 'C'], callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    createKeyEvent('D', 'keydown')
    expect(callBackFn).toBeCalledTimes(3)
  })

  it('use function filter', () => {
    const filter = (event: KeyboardEvent) => {
      return event.key === 'A'
    }
    onKeyStroke(filter, callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('listen to all keys by boolean', () => {
    onKeyStroke(true, callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    createKeyEvent('D', 'keydown')
    createKeyEvent('E', 'keydown')
    expect(callBackFn).toBeCalledTimes(5)
  })

  it('listen to all keys by constructor', () => {
    onKeyStroke(callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    createKeyEvent('D', 'keydown')
    createKeyEvent('E', 'keydown')
    expect(callBackFn).toBeCalledTimes(5)
  })

  it('listen to keypress', () => {
    onKeyStroke('A', callBackFn, { target: element, eventName: 'keypress' })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('A', 'keypress')
    createKeyEvent('B', 'keypress')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('ignore repeated events', () => {
    onKeyStroke('A', callBackFn, { target: element, dedupe: true })
    createKeyEvent('A', 'keydown', false)
    createKeyEvent('A', 'keydown', true)
    createKeyEvent('A', 'keydown', true)
    createKeyEvent('A', 'keydown', true)
    expect(callBackFn).toBeCalledTimes(1)
  })
})
