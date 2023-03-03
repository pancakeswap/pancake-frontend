import { useEffect } from 'react'

const useUserAgent = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-useragent', navigator.userAgent)
    alert(navigator.userAgent)
  }, [])
}

export default useUserAgent
