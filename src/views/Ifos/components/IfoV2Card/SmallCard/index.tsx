import React from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardHeader, Text } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import { PublicIfoData, WalletIfoData, PoolIds } from 'hooks/ifo/v2/types'
import UnlockButton from 'components/UnlockButton'
import { getBalanceNumber } from 'utils/formatBalance'
import IfoCardFooter from './IfoCardFooter'
import Contribute from './Contribute'
import Claim from './Claim'
import TokenSection from './TokenSection'
import PercentageOfTotal from './PercentageOfTotal'

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
  const { currency, token, saleAmount } = ifo
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
        {publicIfoData.status === 'coming_soon' && (
          <>
            <TokenSection label="On sale" amount={saleAmount} img="/images/bunny-placeholder.svg" />
            <Text fontSize="14px" color="textSubtle" mb="24px" pl="48px">{`${config.distribution * 100}%`}</Text>
          </>
        )}
        {publicIfoData.status === 'live' && (
          <>
            <TokenSection
              label={`Your ${currency.symbol} committed`}
              amount={getBalanceNumber(userPoolCharacteristics.amountTokenCommittedInLP, currency.decimals)}
              img="/images/farms/cake-bnb.svg"
            />
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
              mb="24px"
              pl="48px"
            />
            <TokenSection
              label={`${token.symbol} to received`}
              amount={getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}
              img={`/images/tokens/${token.symbol.toLocaleLowerCase()}.png`}
              mb="24px"
            />
          </>
        )}
        {account ? (
          <>
            {publicIfoData.status === 'live' && (
              <Contribute
                ifo={ifo}
                contract={walletIfoData.contract}
                userPoolCharacteristics={userPoolCharacteristics}
                addUserContributedAmount={(amount: BigNumber) => walletIfoData.addUserContributedAmount(amount, poolId)}
              />
            )}
            {publicIfoData.status === 'finished' && (
              <Claim
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
        <IfoCardFooter poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} />
      </CardBody>
    </Card>
  )
}

export default IfoCard
