import React, { createContext, Dispatch, useState } from 'react'
import SwiperCore from 'swiper'

interface Context {
  swiper: SwiperCore
  setSwiper: Dispatch<React.SetStateAction<SwiperCore>>
}

export const SwiperContext = createContext<Context>(undefined)

const SwiperProvider = ({ children }) => {
  const [swiper, setSwiper] = useState<SwiperCore>(null)

  return <SwiperContext.Provider value={{ swiper, setSwiper }}>{children}</SwiperContext.Provider>
}

export default SwiperProvider
