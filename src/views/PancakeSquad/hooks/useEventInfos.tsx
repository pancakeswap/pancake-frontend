import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getPancakeSquadContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import { BigNumber } from 'ethers'
import nftSaleAbi from 'config/abi/nftSale.json'

const useEventInfos = ({ refreshCounter, setCallback }) => {
  useEffect(() => {
    const fetchEventInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress()
        const pancakeSquadContract = getPancakeSquadContract()

        const calls = [
          'maxSupply',
          'maxPerAddress',
          'pricePerTicket',
          'maxPerTransaction',
          'totalTicketsDistributed',
          'currentStatus',
          'startTimestamp',
        ].map((method) => ({
          address: nftSaleAddress,
          name: method,
        }))

        const [
          currentMaxSupply,
          currentMaxPerAddress,
          currentPricePerTicket,
          curentMaxPerTransaction,
          currentTotalTicketsDistributed,
          currentSaleStatus,
          currentStartTimestamp,
        ] = await multicallv2(nftSaleAbi, calls)

        const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()

        setCallback({
          maxSupply: currentMaxSupply[0].toNumber(),
          maxPerAddress: currentMaxPerAddress[0].toNumber(),
          pricePerTicket: BigNumber.from(currentPricePerTicket[0]),
          maxPerTransaction: curentMaxPerTransaction[0].toNumber(),
          totalTicketsDistributed: currentTotalTicketsDistributed[0].toNumber(),
          saleStatus: currentSaleStatus[0],
          startTimestamp: Number(currentStartTimestamp[0].toString().padEnd(13, '0')),
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }

    fetchEventInfos()
  }, [refreshCounter, setCallback])
}

export default useEventInfos
