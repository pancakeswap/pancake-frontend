import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { useFarmLP } from 'contexts/DataContext'
import Spacer from 'components/Spacer'
import Page from 'components/Page'
import PageHeader from 'components/PageHeader'
import { getContract } from 'utils/erc20'
import { TranslateString } from 'utils/translateTextHelpers'
import useUserFarm from 'hooks/useUserFarm'
import Harvest from './components/Harvest'
import Syrup from './components/Syrup'
import Stake from './components/Stake'
import SyrupWarning from './components/SyrupWarning'

const Farm: React.FC = () => {
  const farmInfo = useFarmLP('CAKE')

  const { pid, lpSymbol, lpAddresses } = farmInfo
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const { allowance, tokenBalance, stakedBalance, earnings } = useUserFarm(lpAddress, pid)
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

  return (
    <Page>
      <div style={{ maxWidth: '800px', padding: '48px 16px 0' }}>
        <SyrupWarning />
      </div>
      <PageHeader
        icon={<img src="/images/cakecat.png" height="90" alt="Stake Cake, get SYRUP icon" />}
        title="Stake CAKE, get CAKE."
        subtitle={
          <StyledSubtitle>
            <p>This page was previously used for acquiring SYRUP</p>
            <p>
              Since SYRUP has now been disabled, the page is only useful for removing your SYRUP before moving it to
              CAKE-based pools.
            </p>
            <p>If you stake CAKE in the CAKE pool, it&apos;ll also show up here.</p>
          </StyledSubtitle>
        }
      />
      <Spacer size="lg" />
      <StyledFarm>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Syrup />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Harvest pid={pid} earnings={earnings} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake
              lpContract={lpContract}
              pid={pid}
              tokenName={lpSymbol.toUpperCase()}
              allowance={allowance}
              tokenBalance={tokenBalance}
              stakedBalance={stakedBalance}
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
    </Page>
  )
}

const StyledSubtitle = styled.div`
  p {
    color: #ed4b9e;
    margin: 0 0 8px;
  }
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
  color: ${(props) => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
