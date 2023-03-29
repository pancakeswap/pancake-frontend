import { PositionDetails } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'
import { AutoRow, QuestionHelper, RowBetween } from '@pancakeswap/uikit'
import { Balance } from '@pancakeswap/uikit/src/components/Balance'
import { Box, Flex } from '@pancakeswap/uikit/src/components/Box'
import { Button } from '@pancakeswap/uikit/src/components/Button'
import { Link } from '@pancakeswap/uikit/src/components/Link'
import { ChevronRightIcon } from '@pancakeswap/uikit/src/components/Svg'
import { Text } from '@pancakeswap/uikit/src/components/Text'
import BigNumber from 'bignumber.js'
import { RangeTag } from 'components/RangeTag'
import { Bound } from 'config/constants/types'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import styled from 'styled-components'
import { V3Farm } from 'views/Farms/FarmsV3'
import { FarmV3ApyButton } from './FarmV3ApyButton'

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: initial;
  }
`

type PositionType = 'staked' | 'unstaked'

interface FarmV3StakeAndUnStakeProps {
  farm: V3Farm
  title: string
  liquidityUrl: string
  position: PositionDetails
  outOfRange: boolean
  token: Token
  quoteToken: Token
  positionType: PositionType
  isPending: boolean
  handleStake: () => void
  handleUnStake: () => void
}

export const FarmV3LPTitle = ({
  liquidityUrl,
  title,
  outOfRange,
}: {
  liquidityUrl: string
  title: string
  outOfRange: boolean
}) => (
  <StyledLink external href={liquidityUrl}>
    <Text bold>{title}</Text>
    <ChevronRightIcon color={outOfRange ? 'failure' : 'secondary'} fontSize="12px" />
  </StyledLink>
)

export const FarmV3LPPosition = ({
  position: position_,
  token,
  quoteToken,
  farm,
  positionType,
}: {
  position: PositionDetails
  token: Token
  quoteToken: Token
  farm: V3Farm
  positionType: PositionType
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { position } = useDerivedPositionInfo(position_)
  const { tickLower, tickUpper, fee: feeAmount } = position_
  const { priceLower, priceUpper } = getPriceOrderingFromPositionForUI(position)
  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const estimatedUSD =
    position &&
    new BigNumber(position.amount0.toExact())
      .multipliedBy(farm.tokenPriceBusd)
      .plus(new BigNumber(position.amount1.toExact()).multipliedBy(farm.quoteTokenPriceBusd))
      .toNumber()

  return (
    <Box>
      <Text bold fontSize="12px" style={{ wordBreak: 'break-word' }}>
        {t('Min %minAmount%/ Max %maxAmount% %token% per %quoteToken%', {
          minAmount: formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale),
          maxAmount: formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale),
          token: token.symbol,
          quoteToken: quoteToken.symbol,
        })}
      </Text>
      <Box>
        {position && (
          <AutoRow gap="2px" py="8px">
            <Text fontSize="14px">{t('APR')}:</Text>
            <FarmV3ApyButton farm={farm} existingPosition={position} isPositionStaked={positionType === 'staked'} />
          </AutoRow>
        )}
        <Balance fontSize="12px" color="textSubtle" decimals={2} value={estimatedUSD} unit=" USD" prefix="~" />
        <Flex style={{ gap: '4px' }}>
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={position ? +position.amount0.toSignificant(6) : 0}
            unit={` ${token.symbol}`}
          />
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={position ? +position.amount1.toSignificant(6) : 0}
            unit={` ${quoteToken.symbol}`}
          />
        </Flex>
      </Box>
    </Box>
  )
}

const FarmV3StakeAndUnStake: React.FunctionComponent<React.PropsWithChildren<FarmV3StakeAndUnStakeProps>> = ({
  farm,
  title,
  liquidityUrl,
  token,
  quoteToken,
  position,
  positionType,
  isPending,
  handleStake,
  handleUnStake,
  outOfRange,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {outOfRange && (
        <RangeTag outOfRange ml={0} style={{ alignItems: 'center' }}>
          Inactive
          <QuestionHelper
            ml="4px"
            text={t('Inactive positions will NOT earn CAKE rewards from farm.')}
            size="20px"
            color="white"
          />
        </RangeTag>
      )}
      <FarmV3LPTitle title={title} liquidityUrl={liquidityUrl} outOfRange={outOfRange} />
      <RowBetween gap="16px" flexWrap="nowrap">
        <FarmV3LPPosition
          farm={farm}
          token={token}
          quoteToken={quoteToken}
          position={position}
          positionType={positionType}
        />
        {positionType === 'unstaked' ? (
          outOfRange ? (
            <Button external variant="subtle" as="a" href={liquidityUrl}>
              {t('View LP')}
            </Button>
          ) : (
            <Button width={['120px']} style={{ alignSelf: 'center' }} disabled={isPending} onClick={handleStake}>
              {t('Stake')}
            </Button>
          )
        ) : (
          <Button
            variant="secondary"
            width={['120px']}
            style={{ alignSelf: 'center' }}
            disabled={isPending}
            onClick={handleUnStake}
          >
            {t('Unstake')}
          </Button>
        )}
      </RowBetween>
    </>
  )
}

export default FarmV3StakeAndUnStake
