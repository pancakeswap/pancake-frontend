import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { CardBody, CardRibbon, Flex, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { TokenPairImage } from 'components/TokenImage'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useState } from 'react'
import { usePoolUserData } from 'state/pools/hooks'
import { syrupDeposit, syrupWithdraw } from 'state/pools/syrup'
import { Pool } from 'state/pools/types'
import AprRow from './AprRow'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
import { StyledCard } from './StyledCard'
// import CardActions from './CardActions'

const PoolCard: React.FC<React.PropsWithChildren<{ pool: Pool }>> = ({ pool }) => {
  const { account } = useActiveWeb3React()
  const { sendTransactionAsync } = useSendTransaction()
  const { stakingTokenAddress, earningTokenAddress, isFinished } = pool
  const { data: userData } = usePoolUserData(pool)
  const { t } = useTranslation()
  const [inputValue, setInput] = useState('0')
  const [stakingToken, earningToken] = [useCurrency(stakingTokenAddress), useCurrency(earningTokenAddress)]

  const inputArg =
    stakingToken && new BigNumber(inputValue).multipliedBy(new BigNumber(10).pow(stakingToken.decimals)).toString()
  const stakedBalance = userData?.data.amount ? new BigNumber(userData.data.amount) : BIG_ZERO
  const pendingReward = userData?.data.reward_debt ? new BigNumber(userData.data.reward_debt) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  const isCakePool = earningToken?.symbol === 'CAKE' && stakingToken?.symbol === 'CAKE'

  const deposit = () => {
    if (!stakingToken || !earningToken || !inputArg) return
    const payload = syrupDeposit([inputArg], [stakingToken.address, earningToken.address])
    sendTransactionAsync({ payload })
  }

  const withdraw = () => {
    if (!stakingToken || !earningToken || !inputArg) return
    const payload = syrupWithdraw([inputArg], [stakingToken.address, earningToken.address])
    sendTransactionAsync({ payload })
  }

  return (
    <StyledCard
      isFinished={isFinished}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished}>
        <PoolCardHeaderTitle
          title={isCakePool ? t('Manual') : t('Earn %asset%', { asset: earningToken?.symbol ?? '' })}
          subTitle={
            isCakePool ? t('Earn CAKE, stake CAKE') : t('Stake %symbol%', { symbol: stakingToken?.symbol ?? '' })
          }
        />
        {earningToken && stakingToken && (
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
        )}
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
                {/* TODO: decimals */}
                staked: {stakedBalance.toString()} {stakingToken?.symbol}
              </div>
              <div>
                {/* TODO: decimals */}
                reward: {pendingReward.toString()} {earningToken?.symbol}
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
