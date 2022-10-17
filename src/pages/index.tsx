import { formatEther } from '@ethersproject/units'
import { FACTORY_ADDRESS } from '@pancakeswap/sdk'
import { getUnixTime, sub } from 'date-fns'
import { gql } from 'graphql-request'
import { GetStaticProps } from 'next'
import { SWRConfig } from 'swr'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { getCakeContract } from 'utils/contractHelpers'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { bitQueryServerClient, infoServerClient } from 'utils/graphql'
import HomeDemo from 'views/HomeDemo'

const IndexPage = () => {
  return (
    <HomeDemo />
  )
}
IndexPage.chains = []



export default IndexPage
