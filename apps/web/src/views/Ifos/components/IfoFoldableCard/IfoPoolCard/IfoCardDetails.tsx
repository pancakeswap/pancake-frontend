import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { Box, Flex, IfoSkeletonCardDetails, Skeleton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { BIG_ONE_HUNDRED } from '@pancakeswap/utils/bigNumber'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import { ReactNode, useMemo } from 'react'
import { styled } from 'styled-components'
import { multiplyPriceByAmount } from 'utils/prices'
import { isBasicSale } from 'views/Ifos/hooks/v7/helpers'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'

const ZERO = new BigNumber(0)
const ONE = new BigNumber(1)

export interface IfoCardDetailsProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isEligible: boolean
}

export interface FooterEntryProps {
  label: ReactNode
  value: ReactNode
  tooltipContent?: string
}

const StyledIfoCardDetails = styled(Flex)`
  padding: 16px;
  margin: 0 -12px -12px;
  background-color: ${({ theme }) => theme.colors.background};
`

const FooterEntry: React.FC<React.PropsWithChildren<FooterEntryProps>> = ({ label, value, tooltipContent }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  return (
    <Flex justifyContent="space-between" alignItems="center">
      {tooltipVisible && tooltip}
      {tooltipContent ? (
        <TooltipText ref={targetRef}>
          <Text small color="textSubtle">
            {label}
          </Text>
        </TooltipText>
      ) : (
        <Text small color="textSubtle">
          {label}
        </Text>
      )}
      {value ? (
        <Text small textAlign="right">
          {value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  )
}

const MaxTokenEntry = ({
  maxToken,
  ifo,
  poolId,
  basicSale,
}: {
  maxToken: number
  ifo: Ifo
  poolId: PoolIds
  basicSale?: boolean
}) => {
  const cake = CAKE[ifo.chainId]
  const isCurrencyCake = cake && ifo.currency.wrapped?.equals(cake)
  const isV3 = ifo.version >= 3
  const { t } = useTranslation()

  const basicTooltipContent =
    ifo.version >= 3.1 && !basicSale
      ? t(
          'For the private sale, each eligible participant will be able to commit any amount of CAKE up to the maximum commit limit, which is published along with the IFO voting proposal.',
        )
      : t(
          'For the basic sale, Max CAKE entry is capped by minimum between your average CAKE balance in the iCAKE, or the pool’s hard cap. To increase the max entry, Stake more CAKE into the iCAKE',
        )

  const unlimitedToolipContent =
    ifo.version >= 3.1 ? (
      <Box>
        <Text display="inline">{t('For the public sale, Max CAKE entry is capped by')} </Text>
        <Text bold display="inline">
          {t('the number of iCAKE.')}{' '}
        </Text>
        <Text display="inline">
          {t('Lock more CAKE for longer durations to increase the maximum number of CAKE you can commit to the sale.')}
        </Text>
      </Box>
    ) : (
      t(
        'For the unlimited sale, Max CAKE entry is capped by your average CAKE balance in the iCake. To increase the max entry, Stake more CAKE into the iCake',
      )
    )

  const tooltipContent = poolId === PoolIds.poolBasic ? basicTooltipContent : unlimitedToolipContent

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })
  const label = isCurrencyCake ? t('Max. CAKE entry') : t('Max. token entry')
  const price = useStablecoinPrice(ifo.currency)

  const dollarValueOfToken = multiplyPriceByAmount(price, maxToken, ifo.currency.decimals)

  return (
    <>
      {isV3 && tooltipVisible && tooltip}
      <FooterEntry
        label={
          isV3 ? (
            <TooltipText small color="textSubtle" ref={targetRef}>
              {label}
            </TooltipText>
          ) : (
            label
          )
        }
        value={
          <Text small textAlign="right" color={maxToken > 0 ? 'text' : 'failure'}>
            {`${formatNumber(maxToken, 3, 3)} ${!isCurrencyCake ? ifo.currency.symbol : ''} ${` ~($${formatNumber(
              dollarValueOfToken,
              0,
              0,
            )})`}`}
          </Text>
        }
      />
    </>
  )
}

const IfoCardDetails: React.FC<React.PropsWithChildren<IfoCardDetailsProps>> = ({
  isEligible,
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
}) => {
  const { t } = useTranslation()
  const { status, currencyPriceInUSD } = publicIfoData
  const poolCharacteristic = publicIfoData[poolId]
  const walletCharacteristic = walletIfoData[poolId]
  const hasTax = poolCharacteristic?.hasTax

  let version3MaxTokens = walletIfoData.ifoCredit?.creditLeft
    ? // if creditLeft > limit show limit else show creditLeft
      walletIfoData.ifoCredit.creditLeft.gt(
        poolCharacteristic?.limitPerUserInLP.minus(walletCharacteristic?.amountTokenCommittedInLP || ZERO) || ZERO,
      )
      ? poolCharacteristic?.limitPerUserInLP.minus(walletCharacteristic?.amountTokenCommittedInLP || ZERO)
      : walletIfoData.ifoCredit.creditLeft
    : null

  // unlimited pool just show the credit left
  version3MaxTokens = poolId === PoolIds.poolUnlimited ? walletIfoData.ifoCredit?.creditLeft : version3MaxTokens

  /* Format start */
  const maxLpTokens =
    (ifo.version === 3 || (ifo.version >= 3.1 && poolId === PoolIds.poolUnlimited)) && ifo.isActive
      ? version3MaxTokens
        ? getBalanceNumber(version3MaxTokens, ifo.currency.decimals)
        : 0
      : getBalanceNumber(poolCharacteristic?.limitPerUserInLP || ZERO, ifo.currency.decimals)
  const taxRate = `${poolCharacteristic?.taxRate || 0}%`

  const totalCommittedPercent = poolCharacteristic?.totalAmountPool
    .div(poolCharacteristic?.raisingAmountPool)
    .times(100)
    .toFixed(2)
  const totalLPCommitted = getBalanceNumber(poolCharacteristic?.totalAmountPool || ZERO, ifo.currency.decimals)
  const totalLPCommittedInUSD = currencyPriceInUSD.times(totalLPCommitted)
  const totalCommitted = `~$${formatNumber(totalLPCommittedInUSD.toNumber(), 0, 0)} (${totalCommittedPercent}%)`

  const sumTaxesOverflow = poolCharacteristic?.totalAmountPool
    .minus(poolCharacteristic.raisingAmountPool)
    .times(poolCharacteristic.taxRate)
    .times(0.01)
  const sumTaxesOverflowInUSD = currencyPriceInUSD.times(sumTaxesOverflow || ZERO)
  const pricePerTokenWithFeeToOriginalRatio = sumTaxesOverflow
    ?.plus(poolCharacteristic?.raisingAmountPool || ZERO)
    .div(poolCharacteristic?.offeringAmountPool || ONE)
    .div(poolCharacteristic?.raisingAmountPool.div(poolCharacteristic.offeringAmountPool) || ONE)
  const pricePerTokenWithFeeNumber = pricePerTokenWithFeeToOriginalRatio
    ?.times(ifo.tokenOfferingPrice || ONE)
    .toNumber()
  const maxPrecision = ifo.tokenOfferingPrice && ifo.tokenOfferingPrice < 1 ? 4 : 2

  const pricePerTokenWithFee = `~$${formatNumber(pricePerTokenWithFeeNumber || 0, 0, maxPrecision)}`
  const raisingTokenToBurn =
    ifo[poolId]?.cakeToBurn ||
    (sumTaxesOverflowInUSD.gt(0) &&
      `${formatNumber(getBalanceNumber(sumTaxesOverflow || ZERO), 0, 2)} (~$${formatNumber(
        getBalanceNumber(sumTaxesOverflowInUSD),
        0,
        2,
      )})`)

  const maxToken = ifo.version >= 3.1 && poolId === PoolIds.poolBasic && !isEligible ? 0 : maxLpTokens
  const basicSale = useMemo(() => isBasicSale(poolCharacteristic?.saleType), [poolCharacteristic?.saleType])

  const tokenEntry = <MaxTokenEntry poolId={poolId} ifo={ifo} maxToken={maxToken} basicSale={basicSale} />

  const durationInSeconds = ifo.version >= 3.2 ? poolCharacteristic?.vestingInformation?.duration ?? 0 : 0
  const vestingDays = Math.ceil(durationInSeconds / DAY_IN_SECONDS)

  /* Format end */
  const renderBasedOnIfoStatus = () => {
    if (status === 'coming_soon') {
      return (
        <>
          {tokenEntry}
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId]?.raiseAmount} />
          {raisingTokenToBurn && <FooterEntry label={t('CAKE to burn:')} value={raisingTokenToBurn} />}
          <FooterEntry
            label={t('Price per %symbol%:', { symbol: ifo.token.symbol })}
            value={`$${ifo.tokenOfferingPrice}`}
          />
        </>
      )
    }
    if (status === 'live') {
      return (
        <>
          {tokenEntry}
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={t('Price per %symbol%:', { symbol: ifo.token.symbol })}
              value={`$${ifo.tokenOfferingPrice}`}
            />
          )}
          {hasTax && <FooterEntry label={t('Additional fee:')} value={taxRate} />}
          {hasTax && (
            <FooterEntry
              label={t('Price per %symbol% with fee:', { symbol: ifo.token.symbol })}
              value={pricePerTokenWithFee}
            />
          )}
          <FooterEntry label={t('Total committed:')} value={currencyPriceInUSD.gt(0) ? totalCommitted : null} />
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId]?.raiseAmount} />
          {raisingTokenToBurn && <FooterEntry label={t('CAKE to burn:')} value={raisingTokenToBurn} />}
          {ifo.version >= 3.2 &&
            poolCharacteristic?.vestingInformation?.percentage &&
            poolCharacteristic.vestingInformation.percentage > 0 && (
              <>
                <FooterEntry
                  label={t('Vested percentage:')}
                  value={`${poolCharacteristic.vestingInformation.percentage}%`}
                  tooltipContent={t(
                    '%percentageVested%% of the purchased token will get vested and released linearly over a period of time. %percentageTgeRelease%% of the purchased token will be released immediately and available for claiming when IFO ends.',
                    {
                      percentageVested: poolCharacteristic.vestingInformation.percentage,
                      percentageTgeRelease: BIG_ONE_HUNDRED.minus(
                        poolCharacteristic.vestingInformation.percentage,
                      ).toString(),
                    },
                  )}
                />
                <FooterEntry
                  label={t('Vesting schedule:')}
                  value={`${vestingDays} days`}
                  tooltipContent={t('The vested tokens will be released linearly over a period of %days% days.', {
                    days: vestingDays,
                  })}
                />
              </>
            )}
        </>
      )
    }

    if (status === 'finished') {
      return (
        <StyledIfoCardDetails flexDirection="column">
          {poolId === PoolIds.poolBasic && tokenEntry}
          {hasTax && <FooterEntry label={t('Additional fee:')} value={taxRate} />}
          <FooterEntry label={t('Total committed:')} value={currencyPriceInUSD.gt(0) ? totalCommitted : null} />
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId]?.raiseAmount} />
          {raisingTokenToBurn && <FooterEntry label={t('CAKE to burn:')} value={raisingTokenToBurn} />}
          {ifo.version > 1 && (
            <FooterEntry
              label={t('Price per %symbol%:', { symbol: ifo.token.symbol })}
              value={`$${ifo.tokenOfferingPrice ? ifo.tokenOfferingPrice : '?'}`}
            />
          )}
          {ifo.version > 1 && hasTax && (
            <FooterEntry
              label={t('Price per %symbol% with fee:', { symbol: ifo.token.symbol })}
              value={pricePerTokenWithFee}
            />
          )}
        </StyledIfoCardDetails>
      )
    }
    return <IfoSkeletonCardDetails />
  }

  return <Box>{renderBasedOnIfoStatus()}</Box>
}

export default IfoCardDetails
