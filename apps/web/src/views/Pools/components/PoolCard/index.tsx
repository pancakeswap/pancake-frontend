import { CardBody, Flex, CardRibbon, Skeleton, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DeserializedPool } from 'state/types'
import { TokenPairImage } from 'components/TokenImage'
import { ReactElement } from 'react'
import { StyledCard } from './StyledCard'

const PoolCard: React.FC<
  React.PropsWithChildren<{
    pool: DeserializedPool
    cardContent: ReactElement
    aprRow: ReactElement
    cardFooter: ReactElement
    isStaked: boolean
  }>
> = ({ pool, cardContent, aprRow, isStaked, cardFooter }) => {
  const { sousId, stakingToken, earningToken, isFinished, totalStaked } = pool
  const { t } = useTranslation()

  const isCakePool = earningToken.symbol === 'CAKE' && stakingToken.symbol === 'CAKE'

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <Pool.PoolCardHeader isStaking={isStaked} isFinished={isFinished && sousId !== 0}>
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <Pool.PoolCardHeaderTitle
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
      </Pool.PoolCardHeader>
      <CardBody>
        {aprRow}
        <Flex mt="24px" flexDirection="column">
          {cardContent}
        </Flex>
      </CardBody>
      {cardFooter}
    </StyledCard>
  )
}

export default PoolCard
