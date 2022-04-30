import { useState, useEffect } from 'react'

/**
 * Use this hook when you want to animate something when it appears on the screen (e.g. when some prop set to true)
 * but when its not on the screen you want it to be fully unmounted and not just hidden or height 0.
 * This is especially useful when you have a table of 100s rows and each row has expandable element that appears on click.
 * If you just set the expanding animation while keeping inactive elements mounted all those 100 elements will load the DOM,
 * and if they all receive updates via props you're looking at 100 DOM updates for hidden elements.
 * This hook "shows" element immediately when the isMounted is true
 * but keeps element mounted for delayTime to let unmounting animation happen, after which you unmount element completely.
 * delayTime should be the same as animation time in most cases.
 */
const useDelayedUnmount = (isMounted: boolean, delayTime: number) => {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (isMounted && !shouldRender) {
      setShouldRender(true)
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime)
    }
    return () => clearTimeout(timeoutId)
  }, [isMounted, delayTime, shouldRender])
  return shouldRender
}

export default useDelayedUnmount
