import React, { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { useNftSaleContract, usePancakeSquadContract } from 'hooks/useContract'
import { useProfile } from 'state/profile/hooks'
import { useBlock } from 'state/block/hooks'
import { useHasGen0Nfts } from 'state/nftMarket/hooks'
import BunniesSection from './components/BunniesSection'
import EventDescriptionSection from './components/EventDescriptionSection'
import EventStepsSection from './components/EventStepsSection'
import PancakeSquadHeader from './components/Header'
import { StyledSquadContainer } from './styles'
import { EventInfos, UserInfos, SaleStatusEnum } from './types'
import { getUserStatus } from './utils'
import ArtistSection from './components/ArtistSection'
import FaqSection from './components/FaqSection'
import { PancakeSquadContext } from './context'

const PancakeSquad: React.FC = () => {
  const { account } = useWeb3React()
  const { hasProfile, isInitialized } = useProfile()
  const nftSaleContract = useNftSaleContract()
  const pancakeSquadContract = usePancakeSquadContract()
  const [eventInfos, setEventInfo] = useState<EventInfos>()
  const [userInfos, setUserInfos] = useState<UserInfos>()
  const hasGen0 = useHasGen0Nfts()
  const lastBlockNumber = useBlock()
  const [isUserEnabled, setIsUserEnabled] = useState(false)
  const isLoading = !eventInfos || !userInfos

  const userStatus = getUserStatus({
    account,
    hasActiveProfile: hasProfile && isInitialized,
    hasGen0,
  })

  useEffect(() => {
    const fetchEventInfos = async () => {
      try {
        const currentMaxSupply = await nftSaleContract.maxSupply()
        const currentMaxPerAddress = await nftSaleContract.maxPerAddress()
        const currentPricePerTicket = await nftSaleContract.pricePerTicket()
        const curentMaxPerTransaction = await nftSaleContract.maxPerTransaction()
        const currentTotalTicketsDistributed = await nftSaleContract.totalTicketsDistributed()
        const currentSaleStatus = (await nftSaleContract.currentStatus()) as SaleStatusEnum
        const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()
        const currentStartTimestamp = await nftSaleContract.startTimestamp()
        setEventInfo({
          maxSupply: currentMaxSupply.toNumber(),
          maxPerAddress: currentMaxPerAddress.toNumber(),
          pricePerTicket: BigNumber.from(currentPricePerTicket),
          maxPerTransaction: curentMaxPerTransaction.toNumber(),
          totalTicketsDistributed: currentTotalTicketsDistributed.toNumber(),
          saleStatus: currentSaleStatus,
          startTimestamp: Number(currentStartTimestamp.toString().padEnd(13, '0')),
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }

    if (nftSaleContract && pancakeSquadContract) fetchEventInfos()
  }, [nftSaleContract, pancakeSquadContract, lastBlockNumber])

  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const currentCanClaimForGen0 = await nftSaleContract.canClaimForGen0(account)
        const currentNumberTicketsForGen0 = await nftSaleContract.numberTicketsForGen0(account)
        const currentNumberTicketsUsedForGen0 = await nftSaleContract.numberTicketsUsedForGen0(account)
        const currentNumberTicketsOfUser = await nftSaleContract.viewNumberTicketsOfUser(account)
        const currentTicketsOfUser = await nftSaleContract.ticketsOfUserBySize(account, 0, 600)
        const currentNumberTokensOfUser = await pancakeSquadContract.balanceOf(account)

        setUserInfos({
          canClaimForGen0: currentCanClaimForGen0,
          numberTicketsForGen0: currentNumberTicketsForGen0.toNumber(),
          numberTicketsUsedForGen0: currentNumberTicketsUsedForGen0.toNumber(),
          numberTicketsOfUser: currentNumberTicketsOfUser.toNumber(),
          ticketsOfUser: currentTicketsOfUser[0],
          numberTokensOfUser: currentNumberTokensOfUser.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }
    if (account && nftSaleContract && pancakeSquadContract && nftSaleContract) fetchUserInfos()
  }, [nftSaleContract, pancakeSquadContract, account, lastBlockNumber])

  useEffect(() => {
    if (account) {
      setUserInfos(undefined)
    }
  }, [account])

  return (
    <PancakeSquadContext.Provider value={{ isUserEnabled, setIsUserEnabled }}>
      <StyledSquadContainer>
        <PancakeSquadHeader
          account={account}
          isLoading={isLoading}
          userInfos={userInfos}
          eventInfos={eventInfos}
          userStatus={userStatus}
        />
        <BunniesSection />
        <EventDescriptionSection />
        <EventStepsSection
          userInfos={userInfos}
          eventInfos={eventInfos}
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
