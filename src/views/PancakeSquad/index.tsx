import React, { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { useNftSaleContract, usePancakeSquadContract } from 'hooks/useContract'
import { useProfile } from 'state/profile/hooks'
import { useBlock } from 'state/block/hooks'
import { useGetCollectibles } from 'state/collectibles/hooks'
import BunniesSection from './components/BunniesSection'
import EventDescriptionSection from './components/EventDescriptionSection'
import EventStepsSection from './components/EventStepsSection'
import PancakeSquadHeader from './components/Header'
import { StyledSquadContainer } from './styles'
import { DynamicSaleInfos, FixedSaleInfos, SaleStatusEnum } from './types'
import { getUserStatus } from './utils'
import ArtistSection from './components/ArtistSection'
import FaqSection from './components/FaqSection'
import { PancakeSquadContext } from './context'

const PancakeSquad: React.FC = () => {
  const { account } = useWeb3React()
  const { hasProfile, isInitialized } = useProfile()
  const nftSaleContract = useNftSaleContract()
  const pancakeSquadContract = usePancakeSquadContract()
  const [fixedSaleInfo, setFixedSaleInfo] = useState<FixedSaleInfos>()
  const [dynamicSaleInfo, setDynamicSaleInfo] = useState<DynamicSaleInfos>()
  const { hasGen0 } = useGetCollectibles()
  const lastBlockNumber = useBlock()
  const [isUserEnabled, setIsUserEnabled] = useState(false)
  const isLoading = !fixedSaleInfo || !dynamicSaleInfo

  const userStatus = getUserStatus({
    account,
    hasActiveProfile: hasProfile && isInitialized,
    hasGen0,
  })

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
          ticketsOfUser: currentTicketsOfUser[0],
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
          numberTokensOfUser: currentNumberTokensOfUser.toNumber(),
          startTimestamp: Number(currentStartTimestamp.toString().padEnd(13, '0')),
        })
      } catch (e) {
        console.error(e)
      }
    }
    if (account && nftSaleContract && pancakeSquadContract) fetchDynamicSaleInfo()
  }, [nftSaleContract, pancakeSquadContract, account, lastBlockNumber])

  useEffect(() => {
    if (account) {
      setDynamicSaleInfo(undefined)
    }
  }, [account])

  return (
    <PancakeSquadContext.Provider value={{ isUserEnabled, setIsUserEnabled }}>
      <StyledSquadContainer>
        <PancakeSquadHeader
          account={account}
          isLoading={isLoading}
          dynamicSaleInfo={dynamicSaleInfo}
          fixedSaleInfo={fixedSaleInfo}
          userStatus={userStatus}
        />
        <BunniesSection />
        <EventDescriptionSection />
        <EventStepsSection
          dynamicSaleInfo={dynamicSaleInfo}
          fixedSaleInfo={fixedSaleInfo}
          userStatus={userStatus}
          isLoading={isLoading}
          account={account}
        />
        <ArtistSection />
        <FaqSection />
      </StyledSquadContainer>
    </PancakeSquadContext.Provider>
  )
}

export default PancakeSquad
