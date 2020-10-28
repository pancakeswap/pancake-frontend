import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import useFarm from 'hooks/useFarm'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import DualFarmDisclaimer from './components/DualFarmDisclaimer'

const Farm: React.FC = () => {
  const TranslateString = useI18n()
  const { ethereum } = useWallet()
  const { farmId } = useParams<{ farmId?: string }>()

  const { pid, lpToken, lpTokenAddress, tokenSymbol } = useFarm(farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    tokenSymbol: '',
  }
  const isHardToken = tokenSymbol === 'HARD'
  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  return (
    <StyledPage>
      <Header>
        <Image src={`/images/tokens/category-${tokenSymbol || 'CAKE'}.png`} alt={tokenSymbol} />
        <Title>{TranslateString(320, 'Stake FLIP tokens to stack CAKE')}</Title>
        {isHardToken && <DualFarmDisclaimer />}
      </Header>
      <StyledFarm>
        <Grid>
          <Harvest pid={pid} />
          <Stake lpContract={lpContract} pid={pid} tokenName={lpToken.toUpperCase()} />
        </Grid>
        {isHardToken ? (
          <DualFarmDisclaimer />
        ) : (
          <StyledInfo>
            {TranslateString(
              999,
              '⭐️ Every time you stake and unstake FLIP tokens, the contract will automagically harvest CAKE rewards for you!',
            )}
          </StyledInfo>
        )}
      </StyledFarm>
    </StyledPage>
  )
}

const StyledPage = styled(Page)`
  padding-bottom: 24px;
  padding-top: 24px;

  @media (min-width: 852px) {
    padding-bottom: 48px;
    padding-top: 48px;
  }
`

const Header = styled.div`
  text-align: center;
`

const Image = styled.img`
  width: 160px;
  margin-bottom: 24px;
`

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 24px;
`

const StyledFarm = styled.div``

const Grid = styled.div`
  align-items: start;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: minmax(auto, 344px);
  justify-content: center;
  padding: 32px 0;

  @media (min-width: 852px) {
    grid-template-columns: repeat(2, minmax(auto, 344px));
  }
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
