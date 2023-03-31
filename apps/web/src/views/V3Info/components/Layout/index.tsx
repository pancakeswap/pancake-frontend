import InfoNav from './InfoNav'

export const InfoPageLayout = ({ children }) => {
  return (
    <>
      <InfoNav isStableSwap={false} />
      {children}
    </>
  )
}
