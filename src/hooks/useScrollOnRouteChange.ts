import { useEffect } from 'react'
import history from 'routerHistory'

const useScrollOnRouteChange = () => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      setTimeout(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      }, 50)
    })

    return () => unlisten()
  }, [])
}

export default useScrollOnRouteChange
