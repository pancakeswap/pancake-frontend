import React from 'react'
import { Card, CardBody, CardHeader, Text } from '@pancakeswap-libs/uikit'
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
  }
}

// TODO replace the distribution by a ratio in parent component
const cardConfig: CardConfig = {
  [PoolIds.poolBasic]: {
    title: 'Basic Sale',
    variant: 'blue',
    distribution: 0.3,
  },
  [PoolIds.poolUnlimited]: {
    title: 'Unlimited Sale',
    variant: 'violet',
    distribution: 0.7,
  },
}

const SmallCard: React.FC<IfoCardProps> = ({ ifo, publicIfoData, walletIfoData, poolId }) => {
  const { hasProfile, isLoading: isProfileLoading } = useProfile()
  const config = cardConfig[poolId]
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const isLoading = isProfileLoading || publicIfoData.status === 'idle'

  return (
    <Card>
      <CardHeader variant={config.variant}>
        <Text bold fontSize="20px">
          {config.title}
        </Text>
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
  )
}

export default SmallCard
