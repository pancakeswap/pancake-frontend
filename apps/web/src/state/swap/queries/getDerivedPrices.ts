import { gql } from 'graphql-request'
import { Block } from 'state/info/types'
import {MultiChainName, multiChainQueryMainToken} from "../../info/constant";

export const getDerivedPrices = (tokenAddress: string, blocks: Block[], chainName: MultiChainName) =>
  blocks.map(
    (block) => `
    t${block.timestamp}:tokens(where: {id:"${tokenAddress}"} , block: { number: ${block.number} }, first: 1) { 
        derived${multiChainQueryMainToken[chainName]}
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
