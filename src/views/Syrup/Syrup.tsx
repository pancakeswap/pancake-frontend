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
import { getContract } from '../../utils/erc20'
import useSushi from '../../hooks/useSushi'
import { getPools } from '../../sushi/utils'

import Total from './components/Total'
import NewToken from './components/NewToken'
import Stake from './components/Stake'

interface SyrupRowProps {
  syrupAddress: string
  sousId: number
  tokenName: string
}

const SyrupRow: React.FC<SyrupRowProps> = ({syrupAddress, sousId, tokenName}) => {
  const { ethereum } = useWallet()

  const syrup = useMemo(() => {
    return getContract(ethereum as provider, '0x009cF7bC57584b7998236eff51b98A168DceA9B0')
  }, [ethereum])


  return (
    <StyledCardsWrapper>
      <StyledCardWrapper>
        <Total
          syrup={syrup}
          tokenName={'SYRUP'}
          sousId={sousId}
        />
      </StyledCardWrapper>
      <Spacer />
      <StyledCardWrapper>
        <Stake
          syrup={syrup}
          tokenName={'SYRUP'}
          sousId={sousId}
        />
      </StyledCardWrapper>
      <Spacer />
      <StyledCardWrapper>
        <NewToken tokenName={tokenName}/>
      </StyledCardWrapper>
    </StyledCardsWrapper>

  )

}

const Farm: React.FC = () => {
  const sushi = useSushi()
  const pools = getPools(sushi)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
            {pools.map(pool =>
              <SyrupRow {...pool} />
            )}
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
  width: 1000px;
  margin-bottom: 20px;
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
