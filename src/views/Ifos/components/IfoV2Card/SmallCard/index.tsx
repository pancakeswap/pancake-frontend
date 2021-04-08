import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardHeader, Text } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import { PublicIfoData, WalletIfoData, PoolIds } from 'hooks/ifo/v2/types'
import UnlockButton from 'components/UnlockButton'
import IfoCardHeader from './IfoCardHeader'
import IfoCardDetails from './IfoCardDetails'
import Contribute from './Contribute'
import Claim from './Claim'

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
  }
}

const cardConfig: CardConfig = {
  [PoolIds.poolBasic]: {
    title: 'Basic Sale',
    variant: 'blue',
  },
  [PoolIds.poolUnlimited]: {
    title: 'Unlimited Sale',
    variant: 'violet',
  },
}

const StyledIfoCard = styled(Card)<{ ifoId: string }>`
  margin-left: auto;
  margin-right: auto;
  max-width: 437px;
  width: 100%;
`

const IfoCard: React.FC<IfoCardProps> = ({ ifo, publicIfoData, walletIfoData, poolId }) => {
  const { account } = useWeb3React()
  const { id, name, subTitle } = ifo
  const config = cardConfig[poolId]
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  return (
    <StyledIfoCard ifoId={id}>
      <CardHeader variant={config.variant}>
        <Text bold fontSize="20px">
          {config.title}
        </Text>
      </CardHeader>
      <CardBody>
        <IfoCardHeader ifoId={id} name={name} subTitle={subTitle} />
        {account ? (
          <>
            {publicIfoData.status === 'live' && (
              <Contribute
                ifo={ifo}
                contract={walletIfoData.contract}
                userPoolCharacteristics={userPoolCharacteristics}
                totalAmountPool={publicPoolCharacteristics.totalAmountPool}
                addUserContributedAmount={(amount: BigNumber) => walletIfoData.addUserContributedAmount(amount, poolId)}
              />
            )}
            {publicIfoData.status === 'finished' && (
              <Claim
                ifo={ifo}
                contract={walletIfoData.contract}
                userPoolCharacteristics={userPoolCharacteristics}
                setPendingTx={(status: boolean) => walletIfoData.setPendingTx(status, poolId)}
                setIsClaimed={() => walletIfoData.setIsClaimed(poolId)}
              />
            )}
          </>
        ) : (
          <UnlockButton width="100%" />
        )}
      </CardBody>
      <IfoCardDetails
        ifo={ifo}
        raisingAmount={publicPoolCharacteristics.raisingAmountPool}
        totalAmount={publicPoolCharacteristics.totalAmountPool}
      />
    </StyledIfoCard>
  )
}

export default IfoCard
