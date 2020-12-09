import React, { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import multicall from 'utils/multicall'
import { useFarmLP } from 'contexts/DataContext'
import erc20ABI from 'sushi/lib/abi/erc20.json'
import masterchefABI from 'sushi/lib/abi/masterchef.json'
import contractsAdresses from 'sushi/lib/constants/contracts'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import DualFarmDisclaimer from './components/DualFarmDisclaimer'

interface UserFarm {
  allowance?: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
}

const useUserFarm = (lpContractAddress, pid): UserFarm => {
  const [state, setState] = useState({
    allowance: null,
    tokenBalance: new BigNumber(0),
    stakedBalance: new BigNumber(0),
    earnings: new BigNumber(0),
  })
  const { account } = useWallet()
  useEffect(() => {
    const fetch = async () => {
      const masterChefAdress = contractsAdresses.masterChef[process.env.REACT_APP_CHAIN_ID]
      const [allowance, tokenBalance] = await multicall(erc20ABI, [
        // Allowance
        {
          address: lpContractAddress,
          name: 'allowance',
          params: [account, masterChefAdress],
        },
        // LP token balance on user account
        {
          address: lpContractAddress,
          name: 'balanceOf',
          params: [account],
        },
      ])
      const [userInfo, earnings] = await multicall(masterchefABI, [
        // stakedBalance
        {
          address: masterChefAdress,
          name: 'userInfo',
          params: [pid, account],
        },
        // earnings
        {
          address: masterChefAdress,
          name: 'pendingCake',
          params: [pid, account],
        },
      ])

      setState({
        allowance: new BigNumber(allowance),
        tokenBalance: new BigNumber(tokenBalance),
        // eslint-disable-next-line no-underscore-dangle
        stakedBalance: new BigNumber(new BigNumber(userInfo[0]._hex).toNumber()),
        earnings: new BigNumber(earnings),
      })
    }
    if (account && lpContractAddress) {
      fetch()
    }
  }, [account, lpContractAddress, pid])

  return state
}

const Farm: React.FC = () => {
  const TranslateString = useI18n()
  const { ethereum } = useWallet()
  const { lpSymbol } = useParams<{ lpSymbol?: string }>()

  const { pid, lpAddresses, tokenSymbol, dual } = useFarmLP(lpSymbol)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const { allowance, tokenBalance, stakedBalance, earnings } = useUserFarm(lpAddress, pid)

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

  return (
    <StyledPage>
      <Header>
        <Image src={`/images/tokens/category-${tokenSymbol || 'CAKE'}.png`} alt={tokenSymbol} />
        <Title>{TranslateString(320, 'Stake FLIP tokens to stack CAKE')}</Title>
        {dual && <DualFarmDisclaimer tokenName={tokenSymbol} endBlock={dual.endBlock} />}
      </Header>
      <StyledFarm>
        <Grid>
          <Harvest pid={pid} earnings={earnings} />
          <Stake
            lpContract={lpContract}
            pid={pid}
            tokenName={lpSymbol.toUpperCase()}
            allowance={allowance}
            tokenBalance={tokenBalance}
            stakedBalance={stakedBalance}
          />
        </Grid>
        {dual ? (
          <DualFarmDisclaimer tokenName={tokenSymbol} endBlock={dual.endBlock} />
        ) : (
          <StyledInfo>
            {TranslateString(
              590,
              '⭐️ Every time you stake and unstake LP tokens, the contract will automagically harvest CAKE rewards for you!',
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
