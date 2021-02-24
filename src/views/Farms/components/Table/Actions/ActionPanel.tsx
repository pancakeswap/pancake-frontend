import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { LinkExternal, Text } from '@pancakeswap-libs/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { communityFarms } from 'config/constants'
import { CommunityTag, CoreTag, DualTag } from 'components/Tags'

import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import Multiplier, { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.background};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    padding: 16px 32px;
  }
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

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
`

const ValueContainer = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({ details, apr, multiplier, liquidity }) => {
  const farm = details

  const TranslateString = useI18n()
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, tokenSymbol, dual } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const bsc = `https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
  const info = `https://pancakeswap.info/pair/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
  const isCommunityFarm = communityFarms.includes(tokenSymbol)

  return (
    <Container>
      <InfoContainer>
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
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Text>APR</Text>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{TranslateString(999, 'Multiplier')}</Text>
          <Multiplier {...multiplier} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{TranslateString(999, 'Liquidity')}</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <HarvestAction {...farm} />
        <StakedAction {...farm} />
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
