import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getPancakeSquadContract } from 'utils/contractHelpers'
import { nftSaleABI } from 'config/abi/nftSale'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'

const useEventInfos = ({ refreshCounter, setCallback }) => {
  useEffect(() => {
    const fetchEventInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress()
        const pancakeSquadContract = getPancakeSquadContract()

        const calls = (
          [
            'maxSupply',
            'maxPerAddress',
            'pricePerTicket',
            'maxPerTransaction',
            'totalTicketsDistributed',
            'currentStatus',
            'startTimestamp',
          ] as const
        ).map(
          (method) =>
            ({
              abi: nftSaleABI,
              address: nftSaleAddress,
              functionName: method,
            } as const),
        )

        const client = publicClient({ chainId: ChainId.BSC })

        const [
          currentMaxSupply,
          currentMaxPerAddress,
          currentPricePerTicket,
          currentMaxPerTransaction,
          currentTotalTicketsDistributed,
          currentSaleStatus,
          currentStartTimestamp,
        ] = await client.multicall({
          contracts: calls,
          allowFailure: false,
        })

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

    if (nftSaleABI.length > 0) {
      fetchEventInfos()
    }
  }, [refreshCounter, setCallback])
}

export default useEventInfos
