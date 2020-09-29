import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/cakecat.png'

import { useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import Spacer from '../../components/Spacer'
import Page from '../../components/Page'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import useSushi from '../../hooks/useSushi'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'

import { getContract } from '../../utils/erc20'
import { getMasterChefContract } from '../../sushi/utils'

import Harvest from './components/Harvest'
import Syrup from './components/Syrup'
import Stake from './components/Stake'

const Farm: React.FC = () => {
  const { account } = useWallet()

  const farmInfo = useFarm('CAKE') || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    tokenSymbol: ''
  }

  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    earnToken,
    name,
    icon,
    tokenSymbol
  } = farmInfo;

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sushi = useSushi()
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const { onRedeem } = useRedeem(getMasterChefContract(sushi))

  const lpTokenName = useMemo(() => {
    return lpToken.toUpperCase()
  }, [lpToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])
  return (
    <Page>
        <>
          <PageHeader
            icon={<img src={chef} height="90" />}
            title="Stake Cake, get SYRUP."
            subtitle="SYRUP holders proportionally split 25% of CAKE block emissions each day (10 CAKE per block), Rewards are distributed each block. SYRUP will also be used to for the PancakeSwap Lottery and general governance. "
          />
          <Title>1 CAKE = 1 SYRUP</Title>
          <Title>You can swap back anytime</Title>
          <Spacer size="lg" />
          <StyledFarm>
            <StyledCardsWrapper>
              <StyledCardWrapper>
                <Syrup />
              </StyledCardWrapper>
              <Spacer />
              <StyledCardWrapper>
                <Harvest pid={pid} />
              </StyledCardWrapper>
              <Spacer />
              <StyledCardWrapper>
                <Stake
                  lpContract={lpContract}
                  pid={pid}
                  tokenName={lpToken.toUpperCase()}
                />
              </StyledCardWrapper>
            </StyledCardsWrapper>
            <Spacer size="lg" />
            <StyledInfo>
              ⭐️ Every time you stake and unstake CAKE tokens, the contract will
              automagically harvest CAKE rewards for you!
            </StyledInfo>
            <Spacer size="lg" />
          </StyledFarm>
        </>
    </Page>
  )
}

const Title= styled.div`
  color: ${(props) => props.theme.colors.blue[100]};
  font-size:20px;
  width: 50vw;
  text-align: center;
  font-weight: 900;
  line-height:  2rem;
`

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 800px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.colors.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
