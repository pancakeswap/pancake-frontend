import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { getPancakeSquadContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import { BigNumber } from '@ethersproject/bignumber'
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
          [currentMaxSupply],
          [currentMaxPerAddress],
          [currentPricePerTicket],
          [currentMaxPerTransaction],
          [currentTotalTicketsDistributed],
          [currentSaleStatus],
          [currentStartTimestamp],
        ] = await multicallv2(nftSaleAbi, calls)

        const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()

        setCallback({
          maxSupply: currentMaxSupply.toNumber(),
          maxPerAddress: currentMaxPerAddress.toNumber(),
          pricePerTicket: BigNumber.from(currentPricePerTicket),
          maxPerTransaction: currentMaxPerTransaction.toNumber(),
          totalTicketsDistributed: currentTotalTicketsDistributed.toNumber(),
          saleStatus: currentSaleStatus,
          startTimestamp: Number(currentStartTimestamp.toString().padEnd(13, '0')),
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
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
