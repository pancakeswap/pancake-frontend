import React from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardHeader, Text } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import { PublicIfoData, WalletIfoData, PoolIds } from 'hooks/ifo/v2/types'
import UnlockButton from 'components/UnlockButton'
import IfoCardTokens from './IfoCardTokens'
import IfoCardFooter from './IfoCardFooter'
import ContributeButton from './ContributeButton'
import ClaimButton from './ClaimButton'

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

const IfoCard: React.FC<IfoCardProps> = ({ ifo, publicIfoData, walletIfoData, poolId }) => {
  const { account } = useWeb3React()
  const config = cardConfig[poolId]
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

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
        />
        {account ? (
          <>
            {publicIfoData.status === 'live' && (
              <ContributeButton
                poolId={poolId}
                ifo={ifo}
                contract={walletIfoData.contract}
                isPendingTx={userPoolCharacteristics.isPendingTx}
                addUserContributedAmount={(amount: BigNumber) => walletIfoData.addUserContributedAmount(amount, poolId)}
              />
            )}
            {publicIfoData.status === 'finished' && userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) && (
              <ClaimButton
                poolId={poolId}
                contract={walletIfoData.contract}
                isPendingTx={userPoolCharacteristics.isPendingTx}
                setPendingTx={(status: boolean) => walletIfoData.setPendingTx(status, poolId)}
                setIsClaimed={() => walletIfoData.setIsClaimed(poolId)}
              />
            )}
          </>
        ) : (
          <UnlockButton width="100%" />
        )}
        <IfoCardFooter poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} />
      </CardBody>
    </Card>
  )
}

export default IfoCard
