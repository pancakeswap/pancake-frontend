import React from 'react'
import Token from 'views/Info/Tokens/TokenPage'
import { GetStaticPaths, GetStaticProps } from 'next'
import { isAddress } from 'utils'
import { InfoPageLayout } from 'views/Info'

const TokenPage = ({ address }: { address: string }) => {
  if (!address) {
    return null
  }

  return <Token routeAddress={address} />
}

TokenPage.Layout = InfoPageLayout

export default TokenPage

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const address = params?.address

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  if (!address || !isAddress(String(address).toLowerCase())) {
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
