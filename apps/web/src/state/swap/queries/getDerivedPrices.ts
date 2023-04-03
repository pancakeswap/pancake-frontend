import { gql } from 'graphql-request'
import { Block } from 'state/info/types'

export const getTVL = (tokenAddress: string, isV3?: boolean) => gql`
  query DerivedTokenPriceTVL {
    token(id: "${tokenAddress}") {
      totalValueLocked: ${isV3 ? 'totalValueLocked' : 'totalLiquidity'}
      }
    }
`

export const getDerivedPrices = (tokenAddress: string, blocks: Block[]) =>
  blocks.map(
    (block) => `
    t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number}}) {
        derivedUSD
      }
    `,
  )

export const getDerivedPricesQueryConstructor = (subqueries: string[]) => {
  return gql`
      query derivedTokenPriceData {
        ${subqueries}
      }
    `
}
