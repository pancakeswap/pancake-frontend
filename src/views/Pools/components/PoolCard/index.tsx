import BigNumber from 'bignumber.js'

import { CardBody, Flex, Text, CardRibbon, Skeleton } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import { TokenPairImage } from 'components/TokenImage'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<React.PropsWithChildren<{ pool: DeserializedPool; account: string }>> = ({
  pool,
  account,
}) => {
  const { sousId, stakingToken, earningToken, isFinished, userData, totalStaked } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  const isCakePool = earningToken.symbol === 'CAKE' && stakingToken.symbol === 'CAKE'

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished && sousId !== 0}>
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <PoolCardHeaderTitle
              title={isCakePool ? t('Manual') : t('Earn %asset%', { asset: earningToken.symbol })}
              subTitle={isCakePool ? t('Earn CAKE, stake CAKE') : t('Stake %symbol%', { symbol: stakingToken.symbol })}
            />
            <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </PoolCardHeader>
      <CardBody>
        <AprRow pool={pool} stakedBalance={stakedBalance} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
