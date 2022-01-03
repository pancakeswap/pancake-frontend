import React from 'react'
import Token from 'views/info/Tokens/TokenPage'
import { GetStaticProps } from 'next'
import { isAddress } from 'utils'
import { InfoPageLayout } from 'views/Info'

const TokenPage = ({ address }: { address: string }) => {
  return <Token routeAddress={address} />
}

TokenPage.getLayout = InfoPageLayout

export default TokenPage

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const address = params?.address

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  if (!isAddress(String(address).toLowerCase())) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      address,
    },
  }
}
