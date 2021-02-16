import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { LinkExternal } from '@pancakeswap-libs/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { communityFarms } from 'config/constants'
import { CommunityTag, CoreTag, DualTag } from 'components/Tags'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'

import { ActionContainer, ActionTitles, ActionContent, Earned, Title, Subtle, Staked } from './styles'

export interface ActionPanelProps {
  farm: FarmWithStakedValue
}

const Container = styled.div`
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 16px;
  padding-bottom: 16px;
  background: ${(props) => props.theme.colors.background};
  display: flex;
  align-items: flex-start;
`

const StyledLinkExternal = styled(LinkExternal)<{ svg?: boolean }>`
  font-weight: 400;
  svg {
    display: ${(props) => (props.svg ? 'block' : 'none')};
  }
`

const StakeContainer = styled.div`
  color: ${(props) => props.theme.colors.text};
  align-items: center;
  display: flex;

  a {
    margin-left: 0.5rem;
  }
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;

  > div {
    height: 1.5rem;
    padding: 0 0.375rem;
    font-size: 0.875rem;
    margin-right: 0.25rem;

    svg {
      width: 0.875rem;
    }
  }
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({ farm }) => {
  const TranslateString = useI18n()
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, tokenSymbol, dual } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const bsc = `https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
  const info = `https://pancakeswap.info/pair/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
  const isCommunityFarm = communityFarms.includes(tokenSymbol)
  const earnings = farm.userData ? getBalanceNumber(new BigNumber(farm.userData.earnings)) : null

  return (
    <Container>
      <div>
        <StakeContainer>
          Stake:
          <StyledLinkExternal href={`https://exchange.pancakeswap.finance/#/add/${liquidityUrlPathParts}`} svg>
            {lpLabel}
          </StyledLinkExternal>
        </StakeContainer>
        <StyledLinkExternal href={bsc}>{TranslateString(999, 'BscScan')}</StyledLinkExternal>
        <StyledLinkExternal href={info}>{TranslateString(999, 'Info site')}</StyledLinkExternal>
        <TagsContainer>
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          {!dual ? <DualTag /> : null}
        </TagsContainer>
      </div>
      <ActionContainer>
        <ActionTitles>
          <Title>CAKE</Title>
          <Subtle>EARNED</Subtle>
        </ActionTitles>
        <ActionContent>
          <div>
            <Earned>1,483,.450</Earned>
            <Staked>~ 400USD</Staked>
          </div>
          <HarvestAction pid={farm.pid} earnings={earnings} />
        </ActionContent>
      </ActionContainer>
      <StakedAction {...farm} />
    </Container>
  )
}

export default ActionPanel
