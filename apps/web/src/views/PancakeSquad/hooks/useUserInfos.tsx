import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getPancakeSquadContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import nftSaleAbi from 'config/abi/nftSale.json'

const useUserInfos = ({ account, refreshCounter, setCallback }) => {
  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress()
        const pancakeSquadContract = getPancakeSquadContract()

        if (account) {
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
          ] = await multicallv2({ abi: nftSaleAbi, calls })

          const currentNumberTokensOfUser = await pancakeSquadContract.read.balanceOf(account)

          setCallback({
            canClaimForGen0: currentCanClaimForGen0,
            numberTicketsForGen0: Number(currentNumberTicketsForGen0),
            numberTicketsUsedForGen0: Number(currentNumberTicketsUsedForGen0),
            numberTicketsOfUser: Number(currentNumberTicketsOfUser),
            ticketsOfUser: currentTicketsOfUser,
            numberTokensOfUser: Number(currentNumberTokensOfUser),
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (nftSaleAbi.length > 0) {
      fetchUserInfos()
    }
  }, [account, refreshCounter, setCallback])
}

export default useUserInfos
