import React, { useState } from 'react'
import styled from 'styled-components'
import { CardBody, Flex, Image, Text } from '@rug-zombie-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import BigNumber from 'bignumber.js'
import { getContract, getRestorationChefContract } from 'utils/contractHelpers'
import { getAddress, getRestorationChefAddress } from 'utils/addressHelpers'
import MinimumStake from './MinimumStake'
import StyledCard from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import { GraveConfig } from '../../../../config/constants/types'
import MinimumStakingTime from './MinimumStakingTime'
import GraveCardActions from './GraveCardActions'
import CardFooter from './CardFooter'
import { BIG_TEN } from '../../../../utils/bigNumber'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

const GraveCard: React.FC<{ grave: GraveConfig, zombiePrice: BigNumber, userData: any, gid: number; account: string, balances: any, isLoading: boolean }> = ({ grave, zombiePrice, userData, gid, account,  balances, isLoading }) => {
  return (
    <StyledCard isStaking={false} style={{
      minWidth: '350px',
    }}>
      <StyledCardHeader earningTokenSymbol={grave.nftName} stakingTokenSymbol={grave.rugName}
                        stakingTokenImageUrl={grave.rugSrc} />
      <StyledCardBody isLoading={isLoading}>
        <MinimumStake
          amount={grave.minimumStakingAmount}
          isFinished={false}
        />
        <MinimumStakingTime amount={grave.minimumStakingTime} />
        <br />
        <br />
        <Flex justifyContent='center'> {grave.nftName} </Flex>
        <Image
          mx='auto'
          mt='12px'
          src={grave.nftSrc}
          alt='zombie running'
          width={207}
          height={142}
        />
        <Flex mt='24px' flexDirection='column'>
          {account ? (
            <GraveCardActions
              grave={grave}
              userData={userData}
              zombiePrice={zombiePrice}
              unlockingFee={undefined}
              balances={balances}
              accountHasSharesStaked={false}
              account={account}
              stakingTokenBalance={undefined}
              isLoading={isLoading}
            />
          ) : (
            <>
              <Text mb='10px' textTransform='uppercase' fontSize='12px' color='textSubtle' bold>
                Start reviving
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter
        account={account}
        grave={grave}
        totalZombieInGrave={BIG_TEN}
      />
    </StyledCard>
  )
}

export default GraveCard
