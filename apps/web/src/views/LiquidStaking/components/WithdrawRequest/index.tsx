import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Button, CardBody, Flex, Message, MessageText, RowBetween, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import useTokenBalance from 'hooks/useTokenBalance'
import NextLink from 'next/link'
import { OptionProps } from 'pages/liquid-staking/index'
import { formatUnixTime } from 'utils/formatTime'
import { useCallClaimContract } from 'views/LiquidStaking/hooks/useCallStakingContract'
import { useReadWithdrawRequestInfo } from 'views/LiquidStaking/hooks/useReadWithdrawRequestInfo'
import { Address } from 'wagmi'

export const WithdrawRequest = ({ selectedList }: { selectedList: OptionProps }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { balance: stakedTokenBalance } = useTokenBalance(selectedList.token1.address as Address)
  const userCakeDisplayBalance = getFullDisplayBalance(stakedTokenBalance, selectedList.token1.decimals, 6)

  const userWithdrawRequest = useReadWithdrawRequestInfo()

  const withdrawRequestAmount = userWithdrawRequest
    ? getFullDisplayBalance(userWithdrawRequest?.totalWbethAmountPending, selectedList.token1.decimals, 6)
    : '0'

  const claimableAmount = userWithdrawRequest
    ? getFullDisplayBalance(userWithdrawRequest?.totalWbethAmountClaimable, selectedList.token1.decimals, 6)
    : '0'

  const currency1 = useCurrency(selectedList.token1.address)

  const withdrawRequestAmountToken =
    currency1 && userWithdrawRequest?.totalWbethAmountPending
      ? CurrencyAmount.fromRawAmount(currency1, userWithdrawRequest.totalWbethAmountPending.toString())
      : undefined

  const claimableAmountToken =
    currency1 && userWithdrawRequest?.totalWbethAmountClaimable
      ? CurrencyAmount.fromRawAmount(currency1, userWithdrawRequest.totalWbethAmountClaimable.toString())
      : undefined

  const stakedAmountToken =
    currency1 && stakedTokenBalance ? CurrencyAmount.fromRawAmount(currency1, stakedTokenBalance.toString()) : undefined

  const tokenUSDPrice = useStablecoinPrice(currency1)

  const { onClaim, isLoading } = useCallClaimContract(claimableAmountToken, userWithdrawRequest?.claimableIndexes)

  return (
    <>
      <CardBody>
        <Text fontSize="12px" mb="8px" color="secondary" bold textTransform="uppercase">
          {t('Withdraw')}
        </Text>

        <RowBetween mb="8px" alignItems="start">
          <Text color="textSubtle">{t('Staked Amount')}</Text>

          <Flex flexDirection="column" alignItems="end">
            <Text>
              {userCakeDisplayBalance} {selectedList?.token1?.symbol}
            </Text>
            <Text fontSize="10px" color="textSubtle">
              {stakedAmountToken && tokenUSDPrice
                ? `~$${tokenUSDPrice.quote(stakedAmountToken).toFixed(2, { groupSeparator: ',' })} USD`
                : ''}
            </Text>
          </Flex>
        </RowBetween>

        {userWithdrawRequest?.totalRequest ? (
          <>
            <RowBetween mb="8px" alignItems="start">
              <Text color="textSubtle">{t('Pending Withdrawal Amount')}</Text>
              <Flex flexDirection="column" alignItems="end">
                <Text>
                  {withdrawRequestAmount} {selectedList?.token1?.symbol}
                </Text>
                <Text fontSize="10px" color="textSubtle">
                  {withdrawRequestAmountToken && tokenUSDPrice
                    ? `~$${tokenUSDPrice.quote(withdrawRequestAmountToken).toFixed(2, { groupSeparator: ',' })} USD`
                    : ''}
                </Text>
              </Flex>
            </RowBetween>

            <RowBetween mb="8px" alignItems="start">
              <Text color="textSubtle">{t('Claimable Amount')}</Text>
              <Flex flexDirection="column" alignItems="end">
                <Text>
                  {claimableAmount} {selectedList?.token1?.symbol}
                </Text>
                <Text fontSize="10px" color="textSubtle">
                  {claimableAmountToken && tokenUSDPrice
                    ? `~$${tokenUSDPrice.quote(claimableAmountToken).toFixed(2, { groupSeparator: ',' })} USD`
                    : ''}
                </Text>
              </Flex>
            </RowBetween>

            <RowBetween mb="8px">
              <Text color="textSubtle">{t('Date of latest request')}</Text>

              <Text ml="4px">
                {userWithdrawRequest ? formatUnixTime(userWithdrawRequest.latestTriggerTime.toNumber()) : '-'}
              </Text>
            </RowBetween>

            <RowBetween mb="16px">
              <Text color="textSubtle">{t('Number of requests')}</Text>

              <Text ml="4px">{userWithdrawRequest ? userWithdrawRequest.totalRequest : '-'}</Text>
            </RowBetween>

            <Message variant="warning" mb="24px">
              <MessageText>{t('Withdrawal request will take at least 7 days')}</MessageText>
            </Message>
          </>
        ) : null}
        {account ? (
          <>
            <NextLink href={`/liquid-staking/request-withdraw/${selectedList.contract}`}>
              <Button disabled={stakedTokenBalance.eq(0)} width="100%" mb="8px">
                {stakedTokenBalance.eq(0) && withdrawRequestAmountToken?.greaterThan(0)
                  ? t('Pending Withdraw')
                  : t('Withdraw')}
              </Button>
            </NextLink>

            <Button onClick={onClaim} disabled={claimableAmountToken?.equalTo(0) || isLoading} width="100%">
              {isLoading ? t('Claiming') : t('Claim')}
            </Button>
          </>
        ) : (
          <ConnectWalletButton width="100%" />
        )}
      </CardBody>
    </>
  )
}
