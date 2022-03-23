import { Flex, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import Apr from '../../Apr'

interface AprRowProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  performanceFee?: number
}

export const StakingApr = ({ pool, stakedBalance, performanceFee = 0 }: AprRowProps) => {
  const { t } = useTranslation()
  return (
    <LightGreyCard>
      <Flex>
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Flexible staking')} APY:
        </Text>
        <Apr pool={pool} stakedBalance={stakedBalance} performanceFee={performanceFee} showIcon />
      </Flex>
      <Flex>
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Locked staking')} APY:
        </Text>
        <Apr pool={pool} stakedBalance={stakedBalance} performanceFee={performanceFee} showIcon />
      </Flex>
    </LightGreyCard>
  )
}
