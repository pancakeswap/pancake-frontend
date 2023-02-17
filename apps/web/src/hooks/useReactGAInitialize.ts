import ReactGA from 'react-ga'
import { useEffect } from 'react'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export const useReactGAInitialize = () => {
  useEffect(() => {
    // @ts-ignore
    if (!window?.ga) ReactGA.initialize(GA_TRACKING_ID)
  }, [])
}
