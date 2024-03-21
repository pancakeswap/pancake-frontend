import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, NativeCurrency, Token } from '@pancakeswap/swap-sdk-core'
import { Button, CardBody, Flex, Message, MessageText, RowBetween, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import useTokenBalance from 'hooks/useTokenBalance'
import first from 'lodash/first'
import NextLink from 'next/link'
import { OptionProps } from 'pages/liquid-staking/index'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { formatUnixTime } from 'utils/formatTime'
import { Address } from 'viem'
import { NativeToken } from 'views/LiquidStaking/constants/types'
import { useCallClaimContract } from 'views/LiquidStaking/hooks/useCallStakingContract'
import { useReadWithdrawRequestInfo } from 'views/LiquidStaking/hooks/useReadWithdrawRequestInfo'

function passCheckNativeToken(currency: Token | NativeToken, native: NativeCurrency) {
  if (currency.symbol.toUpperCase() === native.symbol.toUpperCase()) return currency.symbol

  return currency.address
}

function ClaimButton({ tokenAmount, claimIndex }: { tokenAmount?: CurrencyAmount<Currency>; claimIndex: number }) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { onClaim, isLoading } = useCallClaimContract(tokenAmount, claimIndex)

  return (
    <Button mb="8px" onClick={onClaim} disabled={tokenAmount?.equalTo(0) || isLoading} width="100%">
      {isLoading
        ? t('Claiming')
        : t('Claim Requested %amount% %symbol%', {
            symbol: tokenAmount?.currency?.symbol,
            amount: formatCurrencyAmount(tokenAmount, 6, locale),
          })}
    </Button>
  )
}

export const WithdrawRequest = ({ selectedList }: { selectedList: OptionProps }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { balance: stakedTokenBalance } = useTokenBalance(selectedList.token1.address as Address)
  const userCakeDisplayBalance = getFullDisplayBalance(stakedTokenBalance, selectedList.token1.decimals, 6)
  const native = useNativeCurrency()

  const userWithdrawRequest = useReadWithdrawRequestInfo()

  const withdrawRequestAmount = userWithdrawRequest
    ? getFullDisplayBalance(userWithdrawRequest?.totalEthAmountPending, selectedList.token0.decimals, 6)
    : '0'

  const claimableAmount = userWithdrawRequest
    ? getFullDisplayBalance(userWithdrawRequest?.totalEthAmountClaimable, selectedList.token0.decimals, 6)
    : '0'

  const currency0 = useCurrency(passCheckNativeToken(selectedList.token0, native))
  const currency1 = useCurrency(passCheckNativeToken(selectedList.token1, native))

  const withdrawRequestAmountToken =
    currency0 && userWithdrawRequest?.totalEthAmountPending
      ? CurrencyAmount.fromRawAmount(currency0, userWithdrawRequest.totalEthAmountPending.toString())
      : undefined

  const claimableAmountToken =
    currency0 && userWithdrawRequest?.totalEthAmountClaimable
      ? CurrencyAmount.fromRawAmount(currency0, userWithdrawRequest.totalEthAmountClaimable.toString())
      : undefined

  const stakedAmountToken =
    currency1 && stakedTokenBalance ? CurrencyAmount.fromRawAmount(currency1, stakedTokenBalance.toString()) : undefined

  const token1USDPrice = useStablecoinPrice(currency1)
  const token0USDPrice = useStablecoinPrice(currency0)

  const lastRequest = first(userWithdrawRequest?.claimableIndexes)

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
              {stakedAmountToken && token1USDPrice
                ? `~$${token1USDPrice.quote(stakedAmountToken).toFixed(2, { groupSeparator: ',' })} USD`
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
                  {withdrawRequestAmount} {selectedList?.token0?.symbol}
                </Text>
                <Text fontSize="10px" color="textSubtle">
                  {withdrawRequestAmountToken && token0USDPrice
                    ? `~$${token0USDPrice.quote(withdrawRequestAmountToken).toFixed(2, { groupSeparator: ',' })} USD`
                    : ''}
                </Text>
              </Flex>
            </RowBetween>

            <RowBetween mb="8px" alignItems="start">
              <Text color="textSubtle">{t('Claimable Amount')}</Text>
              <Flex flexDirection="column" alignItems="end">
                <Text>
                  {claimableAmount} {selectedList?.token0?.symbol}
                </Text>
                <Text fontSize="10px" color="textSubtle">
                  {claimableAmountToken && token0USDPrice
                    ? `~$${token0USDPrice.quote(claimableAmountToken).toFixed(2, { groupSeparator: ',' })} USD`
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
            {lastRequest ? (
              <ClaimButton
                key={`${lastRequest.index}-${lastRequest.amount.toString()}`}
                claimIndex={lastRequest.index}
                tokenAmount={
                  currency0 ? CurrencyAmount.fromRawAmount(currency0, lastRequest.amount.toString()) : undefined
                }
              />
            ) : null}
          </>
        ) : (
          <ConnectWalletButton width="100%" />
        )}
      </CardBody>
    </>
  )
}
