import Token from 'views/Info/Tokens/TokenPage'
import { GetStaticPaths, GetStaticProps } from 'next'
import { InfoPageLayout } from 'views/Info'
import { getTokenStaticPaths, getTokenStaticProps } from 'utils/pageUtils'

const TokenPage = ({ address }: { address: string }) => {
  if (!address) {
    return null
  }

  return <Token routeAddress={address} />
}

TokenPage.Layout = InfoPageLayout
TokenPage.chains = [] // set all

export default TokenPage

export const getStaticPaths: GetStaticPaths = getTokenStaticPaths()

export const getStaticProps: GetStaticProps = getTokenStaticProps()
