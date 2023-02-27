import Farms, { FarmsContext } from './Farms'

export const FarmsPageLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <Farms>{children}</Farms>
}

export { FarmsContext }
