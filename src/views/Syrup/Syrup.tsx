import React, {useEffect, useMemo} from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import chef from '../../assets/img/syrup.png'

import {useParams} from 'react-router-dom'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'

import Spacer from '../../components/Spacer'
import Page from '../../components/Page'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import {getContract} from '../../utils/erc20'
import useFarms from '../../hooks/useFarms'
import useSushi from '../../hooks/useSushi'
import useAllStakedValue from '../../hooks/useAllStakedValue'
import {getPools} from '../../sushi/utils'

import PoolCard from './components/PoolCard'
import Coming from './components/Coming'
import {sousChefTeam} from '../../sushi/lib/constants';

interface SyrupRowProps {
  syrupAddress: string
  sousId: number
  tokenName: string
  projectLink: string
  harvest: boolean
  tokenPerBlock?: string
  cakePrice: BigNumber
  tokenPrice: BigNumber
}

const SyrupRow: React.FC<SyrupRowProps> = ({syrupAddress, sousId, tokenName, projectLink, harvest, tokenPerBlock, cakePrice, tokenPrice}) => {
  const {ethereum} = useWallet()
  
  const syrup = useMemo(() => {
    return getContract(ethereum as provider, '0x009cF7bC57584b7998236eff51b98A168DceA9B0')
  }, [ethereum])


  return (
    <StyledCardWrapper>
      <PoolCard
        syrup={syrup}
        cakePrice={cakePrice}
        tokenPrice={tokenPrice}
        tokenPerBlock={tokenPerBlock}
        {...{sousId, tokenName, projectLink, harvest}}
      />
      <StyledSpacer />
    </StyledCardWrapper>
  )

}

const Farm: React.FC = () => {
  const sushi = useSushi()
  const stakedValue = useAllStakedValue()
  const pools = getPools(sushi) || sousChefTeam
  const renderPools = useMemo(() => {
    const stakedValueObj = stakedValue.reduce((a, b) => ({
      ...a,
      [b.tokenSymbol]: b
    }), {})
    
    return pools.map(pool => ({
      ...pool,
      cakePrice: stakedValueObj['CAKE']?.tokenPriceInWeth || new BigNumber(0),
      tokenPrice: stakedValueObj[pool.tokenName]?.tokenPriceInWeth || new BigNumber(0),
    }))
  }, [stakedValue, pools])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Page>
      <>
        <PageHeader
          icon={<img src={chef} height="90"/>}
          title="SYRUP POOL"
          subtitle="The Sous Chef is cooking up a treat for all SYRUP holders 🤩"
        />
        <Spacer size="lg"/>
        <StyledFarm>
          <StyledCardsWrapper>
            {renderPools.map((pool, index) =>
              <>
              <SyrupRow {...pool} />
              {(index%3 === 0 || index%3 === 1) && <StyledSpacer />}
              </>
            )}
            <StyledCardWrapper>
              <Coming/>
              <StyledSpacer />
            </StyledCardWrapper>
          </StyledCardsWrapper>
          <Spacer size="lg"/>
          <StyledInfo>
            ⭐️ Stake your SYRUP to earn tokens of new projects,
          </StyledInfo>
          <StyledInfo>
            Rewards will be calculated per block and can be either harvested real time or distributed automatically at the end of each project’s farming period depending on the project.
          </StyledInfo>
          <Spacer size="lg"/>
        </StyledFarm>
      </>
    </Page>
  )
}

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const Title = styled.div`
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
  width: 900px;
  flex-flow: row wrap;
  @media (max-width: 800px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
  flex-direction: column;
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