import React, { useMemo } from 'react'
import { Flex, useModal, CalculateIcon, IconButton, Skeleton, FlexProps } from '@pancakeswap/uikit'
import { BASE_EXCHANGE_URL } from 'config'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { useBusdPriceFromToken } from 'state/hooks'
import { Pool } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getRoi, tokenEarnedPerThousandDollarsCompounding } from 'utils/compoundApyHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'

interface AprProps extends FlexProps {
  pool: Pool
  isAutoVault?: boolean
  performanceFee?: number
}

const Apr: React.FC<AprProps> = ({ pool, isAutoVault, performanceFee = 0, ...props }) => {
  const { stakingToken, earningToken, totalStaked, isFinished, tokenPerBlock } = pool
  const { t } = useTranslation()

  const earningTokenPrice = useBusdPriceFromToken(earningToken.symbol)
  const earningTokenPriceAsNumber = earningTokenPrice && earningTokenPrice.toNumber()
  const stakingTokenPrice = useBusdPriceFromToken(stakingToken.symbol)
  const stakingTokenPriceAsNumber = stakingTokenPrice && stakingTokenPrice.toNumber()

  const apr = !isFinished
    ? getPoolApr(
        stakingTokenPriceAsNumber,
        earningTokenPriceAsNumber,
        getBalanceNumber(totalStaked, stakingToken.decimals),
        parseFloat(tokenPerBlock),
      )
    : 0

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  const isHighValueToken = Math.round(earningTokenPriceAsNumber / 1000) > 0
  const roundingDecimals = isHighValueToken ? 4 : 2

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const compoundFrequency = isAutoVault ? 288 : 1

  const earningsPercentageToDisplay = useMemo(() => {
    if (isAutoVault) {
      const oneThousandDollarsWorthOfToken = 1000 / earningTokenPriceAsNumber
      const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
        numberOfDays: 365,
        farmApr: apr,
        tokenPrice: earningTokenPriceAsNumber,
        roundingDecimals,
        compoundFrequency,
        performanceFee,
      })
      return getRoi({
        amountEarned: tokenEarnedPerThousand365D,
        amountInvested: oneThousandDollarsWorthOfToken,
      })
    }
    return apr
  }, [apr, earningTokenPriceAsNumber, roundingDecimals, compoundFrequency, performanceFee, isAutoVault])

  const apyModalLink =
    stakingToken.address &&
    `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[process.env.REACT_APP_CHAIN_ID]}`

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={earningTokenPriceAsNumber}
      apr={apr}
      linkLabel={`${t('Get')} ${stakingToken.symbol}`}
      linkHref={apyModalLink || BASE_EXCHANGE_URL}
      earningTokenSymbol={earningToken.symbol}
      roundingDecimals={isHighValueToken ? 4 : 2}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {earningsPercentageToDisplay || isFinished ? (
        <>
          <Flex>
            <Balance
              onClick={openRoiModal}
              fontSize="16px"
              isDisabled={isFinished}
              value={isFinished ? 0 : earningsPercentageToDisplay}
              decimals={2}
              unit="%"
            />
          </Flex>
          {!isFinished && (
            <Flex>
              <IconButton
                onClick={openRoiModal}
                variant="text"
                width="20px"
                height="20px"
                mr={['-14px', '-14px', '0px']}
              >
                <CalculateIcon color="textSubtle" width="20px" />
              </IconButton>
            </Flex>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </Flex>
  )
}

export default Apr
