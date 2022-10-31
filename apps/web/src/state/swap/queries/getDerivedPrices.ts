import { gql } from 'graphql-request'
import { Block } from 'state/info/types'

export const getDerivedPrices = (tokenAddress: string, blocks: Block[]) =>
  blocks.map(
    (block) => `
    t${block.timestamp}:tokens(where: {id:"${tokenAddress}"} , block: { number: ${block.number} }, first: 1) { 
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
