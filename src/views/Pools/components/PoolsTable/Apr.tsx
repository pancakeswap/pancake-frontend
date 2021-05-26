import React, { useMemo } from 'react'
import { Flex, useModal, CalculateIcon, IconButton, Skeleton, FlexProps } from '@pancakeswap/uikit'
import { BASE_EXCHANGE_URL } from 'config'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { getRoi, tokenEarnedPerThousandDollarsCompounding } from 'utils/compoundApyHelpers'
import { useTranslation } from 'contexts/Localization'

interface AprProps extends FlexProps {
  pool: Pool
  isAutoVault?: boolean
  performanceFee?: number
}

const Apr: React.FC<AprProps> = ({ pool, isAutoVault, performanceFee = 0, ...props }) => {
  const { stakingToken, earningToken, isFinished, earningTokenPrice, apr } = pool
  const { t } = useTranslation()

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  const isHighValueToken = Math.round(earningTokenPrice / 1000) > 0
  const roundingDecimals = isHighValueToken ? 4 : 2

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const compoundFrequency = isAutoVault ? 288 : 1

  const earningsPercentageToDisplay = useMemo(() => {
    if (isAutoVault) {
      const oneThousandDollarsWorthOfToken = 1000 / earningTokenPrice
      const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
        numberOfDays: 365,
        farmApr: apr,
        tokenPrice: earningTokenPrice,
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
  }, [apr, earningTokenPrice, roundingDecimals, compoundFrequency, performanceFee, isAutoVault])

  const apyModalLink =
    stakingToken.address &&
    `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[process.env.REACT_APP_CHAIN_ID]}`

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={earningTokenPrice}
      apr={apr}
      linkLabel={t('Get %asset%', { asset: stakingToken.symbol })}
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
