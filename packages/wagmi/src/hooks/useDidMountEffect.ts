import { useEffect, useRef } from 'react'

const useDidMountEffect = (func: () => void, checkObject: any) => {
  const isFirstRun = useRef(true)
  const prevParams = useRef(checkObject)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (prevParams.current !== undefined && checkObject !== prevParams.current) {
      func()
    }

    prevParams.current = checkObject
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkObject])
}

export default useDidMountEffect
