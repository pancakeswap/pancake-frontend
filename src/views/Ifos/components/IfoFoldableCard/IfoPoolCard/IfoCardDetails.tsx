import React from 'react'
import { Text, Flex, Box } from '@pancakeswap-libs/uikit'
import { PublicIfoData } from 'hooks/ifo/types'
import { useTranslation } from 'contexts/Localization'
import { Ifo, PoolIds } from 'config/constants/types'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { SkeletonCardDetails } from './Skeletons'

export interface IfoCardDetailsProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
}

export interface FooterEntryProps {
  label: string
  value: string | number
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small color="textSubtle">
        {label}
      </Text>
      <Text small textAlign="right">
        {value}
      </Text>
    </Flex>
  )
}

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({ poolId, ifo, publicIfoData }) => {
  const { t } = useTranslation()
  const { status, currencyPriceInUSD } = publicIfoData
  const poolCharacteristic = publicIfoData[poolId]

  /* Format start */
  const maxLpTokens = getBalanceNumber(poolCharacteristic.limitPerUserInLP, ifo.currency.decimals)
  const taxRate = `${poolCharacteristic.taxRate}%`

  const totalCommittedPercent = poolCharacteristic.totalAmountPool
    .div(poolCharacteristic.raisingAmountPool)
    .times(100)
    .toFixed(2)
  const totalLPCommitted = getBalanceNumber(poolCharacteristic.totalAmountPool, ifo.currency.decimals)
  const totalLPCommittedInUSD = currencyPriceInUSD.times(totalLPCommitted)
  const totalCommitted = `~$${formatNumber(totalLPCommittedInUSD.toNumber())} (${totalCommittedPercent}%)`

  /* Format end */

  const renderBasedOnIfoSttatus = () => {
    if (status === 'coming_soon') {
      return (
        <>
          {poolId === PoolIds.poolBasic && <FooterEntry label={t('Max. LP token entry')} value={maxLpTokens} />}
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId].raiseAmount} />
          <FooterEntry label={t('CAKE to burn:')} value={ifo[poolId].cakeToBurn} />
          <FooterEntry label={`Price per ${ifo.token.symbol}: `} value={`$${ifo.tokenOfferingPrice}`} />
        </>
      )
    }
    if (status === 'live') {
      return (
        <>
          {poolId === PoolIds.poolBasic && <FooterEntry label={t('Max. LP token entry')} value={maxLpTokens} />}
          {poolId === PoolIds.poolUnlimited && <FooterEntry label={t('Additional fee:')} value={taxRate} />}
          <FooterEntry label={t('Total committed:')} value={totalCommitted} />
        </>
      )
    }
    if (status === 'finished') {
      return (
        <>
          {poolId === PoolIds.poolBasic && <FooterEntry label={t('Max. LP token entry')} value={maxLpTokens} />}
          {poolId === PoolIds.poolUnlimited && <FooterEntry label={t('Additional fee:')} value={taxRate} />}
          <FooterEntry label={t('Total committed:')} value={totalCommitted} />
          <FooterEntry label={t('Funds to raise:')} value={ifo[poolId].raiseAmount} />
          <FooterEntry label={t('CAKE to burn:')} value={ifo[poolId].cakeToBurn} />
          <FooterEntry
            label={`Price per ${ifo.token.symbol}: `}
            value={`$${ifo.tokenOfferingPrice ? ifo.tokenOfferingPrice : '?'}`}
          />
        </>
      )
    }
    return <SkeletonCardDetails />
  }

  return <Box paddingTop="24px">{renderBasedOnIfoSttatus()}</Box>
}

export default IfoCardDetails
