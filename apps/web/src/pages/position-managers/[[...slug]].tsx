import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/position-managers'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { PositionManagers } from 'views/PositionManagers'

const Page = () => <PositionManagers />

Page.chains = SUPPORTED_CHAIN_IDS

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          slug: [],
        },
      },
      {
        params: {
          slug: ['history'],
        },
      },
    ],
    fallback: false,
  }
}

export default Page
