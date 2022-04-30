import { FC, ReactNode } from 'react'
import Farms, { FarmsContext } from './Farms'

export const FarmsPageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <Farms>{children}</Farms>
}

export { FarmsContext }
