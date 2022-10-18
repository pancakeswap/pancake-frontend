import BigNumber from 'bignumber.js'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Pool } from 'state/pools/types'
import { poolDepositPayload, poolWithdrawPayload } from 'state/pools/utils'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { TokenPairImage } from 'components/TokenImage'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useState } from 'react'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
// import CardActions from './CardActions'

const PoolCard: React.FC<React.PropsWithChildren<{ pool: Pool }>> = ({ pool }) => {
  const { account } = useActiveWeb3React()
  const { sendTransactionAsync } = useSendTransaction()
  const { stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const [inputValue, setInput] = useState('0')
  const inputArg = new BigNumber(inputValue).multipliedBy(new BigNumber(10).pow(stakingToken.decimals)).toString()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance.toExact()) : BIG_ZERO
  const pendingReward = userData?.pendingReward ? new BigNumber(userData.pendingReward.toExact()) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  const isCakePool = earningToken.symbol === 'CAKE' && stakingToken.symbol === 'CAKE'

  const deposit = () => {
    const payload = poolDepositPayload([stakingToken.address, earningToken.address], [inputArg])
    sendTransactionAsync({ payload })
  }

  const withdraw = () => {
    const payload = poolWithdrawPayload([stakingToken.address, earningToken.address], [inputArg])
    sendTransactionAsync({ payload })
  }

  return (
    <StyledCard
      isFinished={isFinished}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished}>
        <PoolCardHeaderTitle
          title={isCakePool ? t('Manual') : t('Earn %asset%', { asset: earningToken.symbol })}
          subTitle={isCakePool ? t('Earn CAKE, stake CAKE') : t('Stake %symbol%', { symbol: stakingToken.symbol })}
        />
        <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
      </PoolCardHeader>
      <CardBody>
        <AprRow pool={pool} stakedBalance={stakedBalance} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <>
              <div>
                <p>Card Actions</p>
                <input type="text" value={inputValue} onChange={(e) => setInput(e.target.value)} />
                <button type="button" onClick={deposit}>
                  deposit
                </button>
                <button type="button" onClick={withdraw}>
                  withdraw
                </button>
              </div>
              <div>
                staked: {stakedBalance.toString()} {stakingToken.symbol}
              </div>
              <div>
                reward: {pendingReward.toString()} {earningToken.symbol}
              </div>
            </>
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
      <CardFooter pool={pool} />
    </StyledCard>
  )
}

export default PoolCard
