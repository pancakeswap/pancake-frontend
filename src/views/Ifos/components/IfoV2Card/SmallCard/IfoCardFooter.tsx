import React from 'react'
import { Text, Flex, Skeleton, Box } from '@pancakeswap-libs/uikit'
import { PublicIfoData, PoolIds } from 'hooks/ifo/v2/types'
import useI18n from 'hooks/useI18n'
import { Ifo } from 'config/constants/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { isBinaryExpression } from 'typescript'

export interface IfoCardFooterProps {
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
      <Text small>{value}</Text>
    </Flex>
  )
}

const IfoCardFooter: React.FC<IfoCardFooterProps> = ({ poolId, ifo, publicIfoData }) => {
  const TranslateString = useI18n()
  const { status } = publicIfoData
  const poolCharacteristic = publicIfoData[poolId]

  const renderBasedOnIfoSttatus = () => {
    if (status === 'coming_soon') {
      return (
        <>
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={TranslateString(999, 'Max. LP token entry')}
              value={getBalanceNumber(poolCharacteristic.limitPerUserInLP, ifo.currency.decimals)}
            />
          )}
          <FooterEntry label={TranslateString(999, 'Funds to raise:')} value={ifo.raiseAmount} />
          <FooterEntry label={TranslateString(999, 'CAKE to burn:')} value={ifo.cakeToBurn} />
          <FooterEntry label={TranslateString(999, 'Price per XYZ:')} value="??" />
        </>
      )
    }
    if (status === 'live') {
      return (
        <>
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={TranslateString(999, 'Max. LP token entry')}
              value={getBalanceNumber(poolCharacteristic.limitPerUserInLP, ifo.currency.decimals)}
            />
          )}
          {poolId === PoolIds.poolUnlimited && (
            <FooterEntry label={TranslateString(999, 'Additional fee:')} value="5%" />
          )}
          <FooterEntry
            label={TranslateString(999, 'Total committed:')}
            value={getBalanceNumber(poolCharacteristic.totalAmountPool, ifo.currency.decimals)}
          />
        </>
      )
    }
    if (status === 'finished') {
      return (
        <>
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={TranslateString(999, 'Max. LP token entry')}
              value={getBalanceNumber(poolCharacteristic.limitPerUserInLP, ifo.currency.decimals)}
            />
          )}
          {poolId === PoolIds.poolUnlimited && (
            <FooterEntry label={TranslateString(999, 'Additional fee:')} value="5%" />
          )}
          <FooterEntry
            label={TranslateString(999, 'Total committed:')}
            value={getBalanceNumber(poolCharacteristic.totalAmountPool, ifo.currency.decimals)}
          />
          <FooterEntry label={TranslateString(999, 'Funds raised:')} value="??" />
          <FooterEntry label={TranslateString(999, 'CAKE burned:')} value="??" />
          <FooterEntry label={TranslateString(999, 'Price per XYZ:')} value="??" />
        </>
      )
    }
    return <Skeleton />
  }

  return <Box mt="24px">{renderBasedOnIfoSttatus()}</Box>
}

export default IfoCardFooter
