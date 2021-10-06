import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import nftSaleAbi from 'config/abi/nftSale.json'
import { useProfile } from 'state/profile/hooks'
import ArtistSection from './components/ArtistSection'
import BunniesSection from './components/BunniesSection'
import EventDescriptionSection from './components/EventDescriptionSection'
import EventStepsSection from './components/EventStepsSection'
import FaqSection from './components/FaqSection'
import PancakeSquadHeader from './components/Header'
import { PancakeSquadContext } from './context'
import useEventInfos from './hooks/useEventInfos'
import useUserInfos from './hooks/useUserInfos'
import { StyledSquadContainer } from './styles'
import { EventInfos, UserInfos } from './types'
import { getUserStatus } from './utils'

const REFRESH_INTERVAL = 4000

const PancakeSquad: React.FC = () => {
  const { account } = useWeb3React()
  const { hasProfile, isInitialized } = useProfile()
  const [eventInfos, setEventInfo] = useState<EventInfos>()
  const [userInfos, setUserInfos] = useState<UserInfos>()
  const [refreshCounter, setRefreshCounter] = useState(0)
  const [isUserEnabled, setIsUserEnabled] = useState(false)
  const isLoading = (!eventInfos || !userInfos) && nftSaleAbi?.length > 0

  useEventInfos({ setCallback: setEventInfo, refreshCounter })
  useUserInfos({ setCallback: setUserInfos, refreshCounter, account })

  const userStatus = getUserStatus({
    account,
    hasActiveProfile: hasProfile && isInitialized,
    hasGen0: userInfos?.canClaimForGen0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCounter((prev) => prev + 1)
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (account) {
      setIsUserEnabled(false)
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
