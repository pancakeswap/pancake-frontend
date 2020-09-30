import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/syrup.png'

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

// import Harvest from './components/Harvest'
import NewToken from './components/NewToken'
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

  const syrup = useMemo(() => {
    return getContract(ethereum as provider, '0x009cF7bC57584b7998236eff51b98A168DceA9B0')
  }, [ethereum])

  return (
    <Page>
        <>
          <PageHeader
            icon={<img src={chef} height="90" />}
            title="SYRUP POOL"
            subtitle="The Sous Chef is cooking up a treat for all SYRUP holders 🤩"
          />
          <Spacer size="lg" />
          <StyledFarm>
            <StyledCardsWrapper>

              <StyledCardWrapper>
                <Stake
                  syrup={syrup}
                  tokenName={'SYRUP'}
                />
              </StyledCardWrapper>
              <Spacer />
              <Spacer />
              <StyledCardWrapper>
                <NewToken />
              </StyledCardWrapper>
            </StyledCardsWrapper>
            <Spacer size="lg" />
            <StyledInfo>
              ⭐️ Stake your SYRUP to earn tokens of new projects,
            </StyledInfo>
            <StyledInfo>
              Rewards will be calculated per block and total rewards will be distributed automatically at the end of each project’s farming period.
            </StyledInfo>
            <Spacer size="lg" />
          </StyledFarm>
        </>
    </Page>
  )
}

const Title= styled.div`
  color: #cdbaf5;
  font-size: 15px;
  width: 50vw;
  text-align: center;
  font-weight: 900;
  line-height: 1.5rem;
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
