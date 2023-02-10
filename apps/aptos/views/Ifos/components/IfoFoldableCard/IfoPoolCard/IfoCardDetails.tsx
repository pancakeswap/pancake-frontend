import { ReactNode } from 'react'
import { Text, Flex, Box, Skeleton, TooltipText, useTooltip, IfoSkeletonCardDetails } from '@pancakeswap/uikit'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from '@pancakeswap/localization'
import { Ifo, PoolIds } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import useStablePrice from 'hooks/useStablePrice'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { multiplyPriceByAmount } from 'utils/prices'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'

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

const MaxTokenEntry = ({ maxToken, ifo }: { maxToken: number; ifo: Ifo; poolId: PoolIds }) => {
  const isCurrencyCake = true
  const isV3 = ifo.version >= 3
  const { t } = useTranslation()

  const basicTooltipContent = t(
    'For the public sale, each eligible participant will be able to commit any amount of CAKE up to the maximum commit limit, which is published along with the IFO voting proposal.',
  )

  const tooltipContent = basicTooltipContent

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })
  const label = t('Max. token entry')

  const price = useStablePrice(ifo.currency)

  const dollarValueOfToken = price ? multiplyPriceByAmount(price, maxToken, ifo.currency.decimals) : 0

  if (!maxToken) return null

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

const IfoCardDetails: React.FC<React.PropsWithChildren<IfoCardDetailsProps>> = ({
  isEligible,
  poolId,
  ifo,
  publicIfoData,
}) => {
  const { t } = useTranslation()
  const getNow = useLedgerTimestamp()
  const { startTime, endTime, currencyPriceInUSD } = publicIfoData

  const poolCharacteristic = publicIfoData[poolId]

  const currentTime = getNow() / 1000

  const status = getStatus(currentTime, startTime, endTime)

  const version3MaxTokens = null

  /* Format start */
  const maxLpTokens =
    (ifo.version === 3 || (ifo.version >= 3.1 && poolId === PoolIds.poolUnlimited)) && ifo.isActive
      ? version3MaxTokens
        ? getBalanceNumber(version3MaxTokens, ifo.currency.decimals)
        : 0
      : getBalanceNumber(poolCharacteristic.limitPerUserInLP, ifo.currency.decimals)
  const taxRate = `${poolCharacteristic.taxRate}%`

  const totalCommittedPercent = poolCharacteristic.raisingAmountPool.gt(0)
    ? poolCharacteristic.totalAmountPool.div(poolCharacteristic.raisingAmountPool).times(100).toFixed(2)
    : 0
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
    3,
  )}`

  const maxToken = ifo.version >= 3.1 && poolId === PoolIds.poolBasic && !isEligible ? 0 : maxLpTokens

  const tokenEntry = <MaxTokenEntry poolId={poolId} ifo={ifo} maxToken={maxToken} />

  const durationInSeconds = (ifo.version >= 3.2 ? poolCharacteristic.vestingInformation?.duration : 0) ?? 0
  const vestingDays = Math.ceil(durationInSeconds / DAY_IN_SECONDS)

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
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId].raiseAmount} />
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
    return <IfoSkeletonCardDetails />
  }

  return <Box paddingTop="24px">{renderBasedOnIfoStatus()}</Box>
}

export default IfoCardDetails
