/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import Spacer from '../../components/Spacer'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import useFarm from '../../hooks/useFarm'
import { getContract } from '../../utils/erc20'
import Harvest from './components/Harvest'
import Syrup from './components/Syrup'
import Stake from './components/Stake'
import { TranslateString } from '../../utils/translateTextHelpers'

const Farm: React.FC = () => {
  const farmInfo = useFarm('CAKE') || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    tokenSymbol: '',
  }

  const { pid, lpToken, lpTokenAddress } = farmInfo

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  return (
    <Page>
      <>
        <PageHeader
          icon={
            <img
              src="/images/cakecat.png"
              height="90"
              alt="Stake Cake, get SYRUP icon"
            />
          }
          title={'Stake CAKE, get CAKE.'}
          subtitle={
            'This page was previously used for acquiring SYRUP.'
          }
        />
        <Title>Since SYRUP has now been disabled, the page is only useful for removing your SYRUP before moving it to CAKE-based pools.</Title>
        <Title>If you stake CAKE in the CAKE pool, it’ll also show up here.</Title>
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
            ⭐️{' '}
            {TranslateString(
              334,
              'Every time you stake and unstake CAKE tokens, the contract will automagically harvest CAKE rewards for you!',
            )}
          </StyledInfo>
          <Spacer size="lg" />
        </StyledFarm>
      </>
    </Page>
  )
}

const Title = styled.div`
  color: ${(props) => props.theme.colors.blue[100]};
  font-size: 20px;
  width: 50vw;
  text-align: center;
  font-weight: 900;
  line-height: 2rem;
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
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
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
