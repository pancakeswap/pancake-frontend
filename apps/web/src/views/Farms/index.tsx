import { FC } from 'react'
import Farms, { FarmsContext } from './Farms'

export const FarmsPageLayout: FC = ({ children }) => {
  return <Farms>{children}</Farms>
}

export { FarmsContext }
