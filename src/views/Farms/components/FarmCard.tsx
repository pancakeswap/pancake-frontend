import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Button, Flex, Image, Link } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { CommunityTag, CoreTag } from 'components/Tags'
import UnlockButton from 'components/UnlockButton'
import { QuoteToken } from 'config/constants/types'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const Action = styled.div`
  padding: 16px 0;
`

const ViewMore = styled.div`
  padding-top: 16px;
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const Multiplier = styled.div`
  line-height: 25px;
  padding: 0 8px;
  background: #25beca;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.background};
  font-weight: 900;
  margin-bottom: 8px;
  display: inline-block;
`

const CardImage = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 16px;
`

const Label = styled.div`
  line-height: 1.5rem;
  color: ${(props) => props.theme.colors.secondary};
  > span {
    float: left;
  }
  .right {
    float: right;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 900;
  }
`

const FCard = styled.div`
  align-self: stretch;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: number
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed }) => {
  const TranslateString = useI18n()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account } = useWallet()

  const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  return (
    <FCard>
      {farm.tokenSymbol === 'CAKE' && <StyledCardAccent />}
      <CardImage>
        <Flex flexDirection="column" alignItems="flex-start">
          <Multiplier>{farm.multiplier}</Multiplier>
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        </Flex>
        <Image src={`/images/farms/${farmImage}.svg`} alt={farm.tokenSymbol} width={80} height={80} />
      </CardImage>
      <Label>
        <span>{TranslateString(316, 'Deposit')}</span>
        <span className="right">{farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')}</span>
      </Label>
      <Label>
        <span>{TranslateString(318, 'Earn')}</span>
        <span className="right">{farm.dual ? farm.dual.earnLabel : 'CAKE'}</span>
      </Label>
      {!removed && (
        <Label>
          <span>{TranslateString(736, 'APR')}</span>
          <span className="right">
            {farm.apy
              ? `${farm.apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}%`
              : 'Loading ...'}
          </span>
        </Label>
      )}
      <Action>
        {account ? (
          /* No full width props because of as={ReactRouterLink} */
          // @ts-ignore
          <Button as={ReactRouterLink} to={`/farm/${farm.lpSymbol}`} style={{ width: '100%' }}>
            {TranslateString(568, 'Select')}
          </Button>
        ) : (
          <UnlockButton fullWidth />
        )}
      </Action>
      {!removed && (
        <Label>
          <span>{TranslateString(23, 'Total Liquidity')}</span>
          <span className="right">{totalValueFormated}</span>
        </Label>
      )}
      <ViewMore>
        <Link
          href={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
          external
          m="auto"
        >
          {TranslateString(356, 'View on BscScan')} &gt;
        </Link>
      </ViewMore>
    </FCard>
  )
}

export default FarmCard
