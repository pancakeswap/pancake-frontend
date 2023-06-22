import { RefObject } from 'react'

export function getRefValue<C>(ref: RefObject<C>) {
  return ref.current as C
}
