import { useEffect } from 'react'
import history from 'routerHistory'

const useScrollOnRouteChange = () => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    })

    return () => unlisten()
  }, [])
}

export default useScrollOnRouteChange
