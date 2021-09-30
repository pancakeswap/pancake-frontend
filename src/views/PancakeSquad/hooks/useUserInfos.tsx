import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getPancakeSquadContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import nftSaleAbi from 'config/abi/nftSale.json'

const useUserInfos = ({ account, lastBlockNumber, setCallback }) => {
  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress()
        const pancakeSquadContract = getPancakeSquadContract()

        const calls = [
          'canClaimForGen0',
          'numberTicketsForGen0',
          'numberTicketsUsedForGen0',
          'viewNumberTicketsOfUser',
          'ticketsOfUserBySize',
        ].map((method) => ({
          address: nftSaleAddress,
          name: method,
          params: method === 'ticketsOfUserBySize' ? [account, 0, 600] : [account],
        }))

        const [
          currentCanClaimForGen0,
          currentNumberTicketsForGen0,
          currentNumberTicketsUsedForGen0,
          currentNumberTicketsOfUser,
          currentTicketsOfUser,
        ] = await multicallv2(nftSaleAbi, calls)

        const currentNumberTokensOfUser = await pancakeSquadContract.balanceOf(account)

        setCallback({
          canClaimForGen0: currentCanClaimForGen0[0],
          numberTicketsForGen0: currentNumberTicketsForGen0[0].toNumber(),
          numberTicketsUsedForGen0: currentNumberTicketsUsedForGen0[0].toNumber(),
          numberTicketsOfUser: currentNumberTicketsOfUser[0].toNumber(),
          ticketsOfUser: currentTicketsOfUser[0][0],
          numberTokensOfUser: currentNumberTokensOfUser.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }
    fetchUserInfos()
  }, [account, lastBlockNumber, setCallback])
}

export default useUserInfos
