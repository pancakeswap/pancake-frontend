import { request, gql } from 'graphql-request'
import { BITQUERY_API } from 'config/constants/endpoints'

export const getUsersAndTrades = async (): Promise<{ addressCount: number; txCount: number }> => {
  try {
    const response = await request(
      BITQUERY_API,
      gql`
        query getLotteries {
          ethereum(network: bsc) {
            dexTrades(
              exchangeAddress: { is: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73" }
              date: { since: "2021-06-26" }
            ) {
              Address_cnt: count(uniq: senders)
              Tx_count: count(uniq: txs)
            }
          }
        }
      `,
    )
    const { Address_cnt: addressCount, Tx_count: txCount } = response?.ethereum?.dexTrades[0]
    return { addressCount, txCount }
  } catch (error) {
    console.error(error)
    return { addressCount: null, txCount: null }
  }
}
