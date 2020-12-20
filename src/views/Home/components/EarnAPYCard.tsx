import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Svg } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { useAllReward } from 'hooks/useReward'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  max-width: 344px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  margin-bottom: 0px;
`


const FarmedStakingCard = () => {
    const TranslateString = useI18n() 
   

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <div>Earn up to</div>
        <CardMidContent>{TranslateString(999, '293% APY')}</CardMidContent>
        <div>in Farms</div>
        <Svg />
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
