import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { useNftSaleContract, usePancakeSquadContract, useProfile as useProfileContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { formatBigNumber } from 'utils/formatBalance'
import BunniesSection from './components/BunniesSection'
import PancakeSquadHeader from './components/Header'
import { StyledSquadContainer } from './styles'
import { DynamicSaleInfos, FixedSaleInfos, SaleStatusEnum } from './types'

const PancakeSquad: React.FC = () => {
  const { account } = useWeb3React()
  const [isLoading, setIsLoading] = useState(true)
  const nftSaleContract = useNftSaleContract()
  const pancakeSquadContract = usePancakeSquadContract()
  const profileContract = useProfileContract()
  const [fixedSaleInfo, setFixedSaleInfo] = useState<FixedSaleInfos | null>(null)
  const [dynamicSaleInfo, setDynamicSaleInfo] = useState<DynamicSaleInfos | null>(null)

  useEffect(() => {
    const fetchFixedSaleInfo = async () => {
      try {
        const currentMaxSupply = await nftSaleContract.maxSupply()
        const currentMaxPerAddress = await nftSaleContract.maxPerAddress()
        const currentPricePerTicket = await nftSaleContract.pricePerTicket()
        const curentMaxPerTransaction = await nftSaleContract.maxPerTransaction()
        setFixedSaleInfo({
          maxSupply: currentMaxSupply.toNumber(),
          maxPerAddress: currentMaxPerAddress.toNumber(),
          pricePerTicket: BigNumber.from(currentPricePerTicket),
          maxPerTransaction: curentMaxPerTransaction.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }

    if (!fixedSaleInfo && account && nftSaleContract) fetchFixedSaleInfo()
  }, [nftSaleContract, account, fixedSaleInfo])

  useEffect(() => {
    const fetchDynamicSaleInfo = async () => {
      try {
        const currentTotalTicketsDistributed = await nftSaleContract.totalTicketsDistributed()
        const currentSaleStatus = (await nftSaleContract.currentStatus()) as SaleStatusEnum
        const currentCanClaimForGen0 = await nftSaleContract.canClaimForGen0(account)
        const currentNumberTicketsForGen0 = await nftSaleContract.numberTicketsForGen0(account)
        const currentNumberTicketsUsedForGen0 = await nftSaleContract.numberTicketsUsedForGen0(account)
        const currentNumberTicketsOfUser = await nftSaleContract.viewNumberTicketsOfUser(account)
        const currentTicketsOfUser = await nftSaleContract.ticketsOfUserBySize(account, 0, 600)
        const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()
        const currentNumberTokensOfUser = await pancakeSquadContract.balanceOf(account)
        const currentStartTimestamp = await nftSaleContract.startTimestamp()

        setDynamicSaleInfo({
          totalTicketsDistributed: currentTotalTicketsDistributed.toNumber(),
          saleStatus: currentSaleStatus,
          canClaimForGen0: currentCanClaimForGen0,
          numberTicketsForGen0: currentNumberTicketsForGen0.toNumber(),
          numberTicketsUsedForGen0: currentNumberTicketsUsedForGen0.toNumber(),
          numberTicketsOfUser: currentNumberTicketsOfUser.toNumber(),
          ticketsOfUser: currentTicketsOfUser,
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
          numberTokensOfUser: currentNumberTokensOfUser.toNumber(),
          startTimestamp: Number(currentStartTimestamp.toString().padEnd(13, '0')),
        })
      } catch (e) {
        console.error(e)
      }
    }
    if (account && nftSaleContract && pancakeSquadContract && profileContract) fetchDynamicSaleInfo()
  }, [nftSaleContract, pancakeSquadContract, profileContract, account])

  useEffect(() => {
    if (fixedSaleInfo != null && dynamicSaleInfo !== null && isLoading) setIsLoading(false)
  }, [fixedSaleInfo, dynamicSaleInfo, isLoading])

  return (
    <StyledSquadContainer>
      <PancakeSquadHeader
        account={account}
        isLoading={isLoading}
        dynamicSaleInfo={dynamicSaleInfo}
        fixedSaleInfo={fixedSaleInfo}
      />
      <BunniesSection />
    </StyledSquadContainer>
  )
}

export default PancakeSquad
