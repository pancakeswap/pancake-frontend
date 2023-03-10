import { PositionDetails } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'
import { Balance } from '@pancakeswap/uikit/src/components/Balance'
import { Box, Flex } from '@pancakeswap/uikit/src/components/Box'
import { Button } from '@pancakeswap/uikit/src/components/Button'
import { Link } from '@pancakeswap/uikit/src/components/Link'
import { ChevronRightIcon } from '@pancakeswap/uikit/src/components/Svg'
import { Text } from '@pancakeswap/uikit/src/components/Text'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import styled from 'styled-components'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { Bound } from 'config/constants/types'
import { V3Farm } from 'views/Farms/FarmsV3'
import BigNumber from 'bignumber.js'

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
  token: Token
  quoteToken: Token
  positionType: PositionType
  isPending: boolean
  handleStake: () => void
  handleUnStake: () => void
}

const FarmV3StakeAndUnStake: React.FunctionComponent<React.PropsWithChildren<FarmV3StakeAndUnStakeProps>> = ({
  farm,
  title,
  liquidityUrl,
  token,
  quoteToken,
  position: position_,
  positionType,
  isPending,
  handleStake,
  handleUnStake,
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
    <>
      <StyledLink external href={liquidityUrl}>
        <Text bold color="secondary">
          {title}
        </Text>
        <ChevronRightIcon color="secondary" fontSize="12px" />
      </StyledLink>
      <Flex justifyContent="space-between">
        <Box>
          <Text bold fontSize={['12px', '12px', '12px', '14px']}>
            {t('Min %minAmount%/ Max %maxAmount% %token% per %quoteToken%', {
              minAmount: formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale),
              maxAmount: formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale),
              token: token.symbol,
              quoteToken: quoteToken.symbol,
            })}
          </Text>
          <Box>
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={estimatedUSD} unit=" USD" prefix="~" />
            <Flex style={{ gap: '4px' }}>
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                value={position ? +position.amount0.toSignificant(4) : 0}
                unit={` ${token.symbol}`}
              />
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                value={position ? +position.amount1.toSignificant(4) : 0}
                unit={` ${quoteToken.symbol}`}
              />
            </Flex>
          </Box>
        </Box>
        {positionType === 'unstaked' ? (
          <Button width={['120px']} style={{ alignSelf: 'center' }} disabled={isPending} onClick={handleStake}>
            {t('Stake')}
          </Button>
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
      </Flex>
    </>
  )
}

export default FarmV3StakeAndUnStake
