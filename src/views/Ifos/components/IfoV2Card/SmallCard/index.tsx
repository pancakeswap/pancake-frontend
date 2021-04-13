import React from 'react'
import { Card, CardBody, CardHeader, Text, useTooltip, HelpIcon, Flex } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import { useProfile } from 'state/hooks'
import { PublicIfoData, WalletIfoData, PoolIds } from 'hooks/ifo/v2/types'
import IfoCardTokens from './IfoCardTokens'
import IfoCardActions from './IfoCardActions'
import IfoCardDetails from './IfoCardDetails'

interface IfoCardProps {
  ifo: Ifo
  poolId: PoolIds
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

interface CardConfig {
  [key: string]: {
    title: string
    variant: 'blue' | 'violet'
    distribution: number
    tooltip: string
  }
}

// TODO replace the distribution by a ratio in parent component
const cardConfig: CardConfig = {
  [PoolIds.poolBasic]: {
    title: 'Basic Sale',
    variant: 'blue',
    distribution: 0.3,
    tooltip: 'Every person can only commit a limited amount, but may expect a higher return per token committed.',
  },
  [PoolIds.poolUnlimited]: {
    title: 'Unlimited Sale',
    variant: 'violet',
    distribution: 0.7,
    tooltip: 'No limits on the amount you can commit. Additional fee applies when claiming.',
  },
}

const SmallCard: React.FC<IfoCardProps> = ({ ifo, publicIfoData, walletIfoData, poolId }) => {
  const config = cardConfig[poolId]
  const { hasProfile, isLoading: isProfileLoading } = useProfile()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, 'bottom')
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const isLoading = isProfileLoading || publicIfoData.status === 'idle'

  return (
    <>
      {tooltipVisible && tooltip}
      <Card>
        <CardHeader variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px">
              {config.title}
            </Text>
            <div ref={targetRef}>
              <HelpIcon />
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <IfoCardTokens
            ifo={ifo}
            distribution={config.distribution}
            status={publicIfoData.status}
            publicPoolCharacteristics={publicPoolCharacteristics}
            userPoolCharacteristics={userPoolCharacteristics}
            hasProfile={hasProfile}
            isLoading={isLoading}
          />
          <IfoCardActions
            currency={ifo.currency}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            poolId={poolId}
            hasProfile={hasProfile}
            isLoading={isLoading}
          />
          <IfoCardDetails poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} />
        </CardBody>
      </Card>
    </>
  )
}

export default SmallCard
