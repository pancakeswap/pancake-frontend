import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getPancakeSquadContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
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
          currentMaxPerTransaction,
          currentTotalTicketsDistributed,
          currentSaleStatus,
          currentStartTimestamp,
        ] = await multicallv2({ abi: nftSaleAbi, calls })

        const currentTotalSupplyMinted = await pancakeSquadContract.read.totalSupply()

        setCallback({
          maxSupply: Number(currentMaxSupply),
          maxPerAddress: Number(currentMaxPerAddress),
          pricePerTicket: currentPricePerTicket,
          maxPerTransaction: Number(currentMaxPerTransaction),
          totalTicketsDistributed: Number(currentTotalTicketsDistributed),
          saleStatus: currentSaleStatus,
          startTimestamp: Number(currentStartTimestamp.toString().padEnd(13, '0')),
          totalSupplyMinted: Number(currentTotalSupplyMinted),
        })
      } catch (e) {
        console.error(e)
      }
    }

    if (nftSaleAbi.length > 0) {
      fetchEventInfos()
    }
  }, [refreshCounter, setCallback])
}

export default useEventInfos
