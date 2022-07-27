import { ReactNode } from 'react'
import { bscTokens } from 'config/constants/tokens'
import { Text, Flex, Box, Skeleton, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import { Ifo, PoolIds } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { SkeletonCardDetails } from './Skeletons'

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

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value, tooltipContent }) => {
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

const MaxTokenEntry = ({ maxToken, ifo, poolId }: { maxToken: number; ifo: Ifo; poolId: PoolIds }) => {
  const isCurrencyCake = ifo.currency === bscTokens.cake
  const isV3 = ifo.version >= 3
  const { t } = useTranslation()

  const basicTooltipContent =
    ifo.version >= 3.1
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
  const price = useBUSDPrice(ifo.currency)

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
            {`${formatNumber(maxToken, 3, 3)} ${
              !isCurrencyCake ? ifo.currency.symbol : ''
            } ${` ~($${dollarValueOfToken.toFixed(0)})`}`}
          </Text>
        }
      />
    </>
  )
}

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({ isEligible, poolId, ifo, publicIfoData, walletIfoData }) => {
  const { t } = useTranslation()
  const { status, currencyPriceInUSD } = publicIfoData
  const poolCharacteristic = publicIfoData[poolId]
  const walletCharacteristic = walletIfoData[poolId]

  let version3MaxTokens = walletIfoData.ifoCredit?.creditLeft
    ? // if creditLeft > limit show limit else show creditLeft
      walletIfoData.ifoCredit.creditLeft.gt(
        poolCharacteristic.limitPerUserInLP.minus(walletCharacteristic.amountTokenCommittedInLP),
      )
      ? poolCharacteristic.limitPerUserInLP.minus(walletCharacteristic.amountTokenCommittedInLP)
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
      : getBalanceNumber(poolCharacteristic.limitPerUserInLP, ifo.currency.decimals)
  const taxRate = `${poolCharacteristic.taxRate}%`

  const totalCommittedPercent = poolCharacteristic.totalAmountPool
    .div(poolCharacteristic.raisingAmountPool)
    .times(100)
    .toFixed(2)
  const totalLPCommitted = getBalanceNumber(poolCharacteristic.totalAmountPool, ifo.currency.decimals)
  const totalLPCommittedInUSD = currencyPriceInUSD.times(totalLPCommitted)
  const totalCommitted = `~$${formatNumber(totalLPCommittedInUSD.toNumber(), 0, 0)} (${totalCommittedPercent}%)`

  const sumTaxesOverflow = poolCharacteristic.totalAmountPool.times(poolCharacteristic.taxRate).times(0.01)
  const pricePerTokenWithFeeToOriginalRatio = sumTaxesOverflow
    .plus(poolCharacteristic.raisingAmountPool)
    .div(poolCharacteristic.offeringAmountPool)
    .div(poolCharacteristic.raisingAmountPool.div(poolCharacteristic.offeringAmountPool))
  const pricePerTokenWithFee = `~$${formatNumber(
    pricePerTokenWithFeeToOriginalRatio.times(ifo.tokenOfferingPrice).toNumber(),
    0,
    2,
  )}`

  const maxToken = ifo.version >= 3.1 && poolId === PoolIds.poolBasic && !isEligible ? 0 : maxLpTokens

  const tokenEntry = <MaxTokenEntry poolId={poolId} ifo={ifo} maxToken={maxToken} />

  const oneWeek = 604800
  const weeksInSeconds = ifo.version >= 3.2 ? poolCharacteristic.vestingInformation.duration : 0
  const vestingWeeks = Math.ceil(weeksInSeconds / oneWeek)

  /* Format end */
  const renderBasedOnIfoStatus = () => {
    if (status === 'coming_soon') {
      return (
        <>
          {tokenEntry}
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId].raiseAmount} />
          {ifo[poolId].cakeToBurn !== '$0' && <FooterEntry label={t('CAKE to burn:')} value={ifo[poolId].cakeToBurn} />}
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
          {poolId === PoolIds.poolUnlimited && <FooterEntry label={t('Additional fee:')} value={taxRate} />}
          {poolId === PoolIds.poolUnlimited && (
            <FooterEntry
              label={t('Price per %symbol% with fee:', { symbol: ifo.token.symbol })}
              value={pricePerTokenWithFee}
            />
          )}
          <FooterEntry label={t('Total committed:')} value={currencyPriceInUSD.gt(0) ? totalCommitted : null} />
          {ifo.version >= 3.2 && poolCharacteristic.vestingInformation.percentage > 0 && (
            <>
              <FooterEntry
                label={t('Vested percentage:')}
                value={`${poolCharacteristic.vestingInformation.percentage}%`}
                tooltipContent={t(
                  '%percentageVested%% of the purchased token will get vested and released linearly over a period of time. %percentageTgeRelease%% of the purchased token will be released immediately and available for claiming when IFO ends.',
                  {
                    percentageVested: poolCharacteristic.vestingInformation.percentage,
                    percentageTgeRelease: new BigNumber(100)
                      .minus(poolCharacteristic.vestingInformation.percentage)
                      .toString(),
                  },
                )}
              />
              <FooterEntry
                label={t('Vesting schedule:')}
                value={`${vestingWeeks} weeks`}
                tooltipContent={t('The vested tokens will be released linearly over a period of %weeks% weeks.', {
                  weeks: vestingWeeks,
                })}
              />
            </>
          )}
        </>
      )
    }

    if (status === 'finished') {
      return (
        <>
          {(poolId === PoolIds.poolBasic || ifo.isActive) && tokenEntry}
          {poolId === PoolIds.poolUnlimited && <FooterEntry label={t('Additional fee:')} value={taxRate} />}
          <FooterEntry label={t('Total committed:')} value={currencyPriceInUSD.gt(0) ? totalCommitted : null} />
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId].raiseAmount} />
          {ifo[poolId].cakeToBurn !== '$0' && <FooterEntry label={t('CAKE to burn:')} value={ifo[poolId].cakeToBurn} />}
          {ifo.version > 1 && (
            <FooterEntry
              label={t('Price per %symbol%:', { symbol: ifo.token.symbol })}
              value={`$${ifo.tokenOfferingPrice ? ifo.tokenOfferingPrice : '?'}`}
            />
          )}
          {ifo.version > 1 && poolId === PoolIds.poolUnlimited && (
            <FooterEntry
              label={t('Price per %symbol% with fee:', { symbol: ifo.token.symbol })}
              value={pricePerTokenWithFee}
            />
          )}
        </>
      )
    }
    return <SkeletonCardDetails />
  }

  return <Box paddingTop="24px">{renderBasedOnIfoStatus()}</Box>
}

export default IfoCardDetails
