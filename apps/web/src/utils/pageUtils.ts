import { GetStaticPaths, GetStaticProps } from 'next'
import { isAddress } from './index'

export const getTokenStaticPaths = (): GetStaticPaths => {
  return () => {
    return {
      paths: [],
      fallback: true,
    }
  }
}

export const getTokenStaticProps = (): GetStaticProps => {
  return async ({ params }) => {
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
}
