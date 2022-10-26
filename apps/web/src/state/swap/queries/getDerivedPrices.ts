import { gql } from 'graphql-request'
import { Block } from 'state/info/types'

export const getDerivedPrices = (tokenAddress: string, blocks: Block[]) =>
  blocks.map(
    (block) => `
    t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
        derivedBNB
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
