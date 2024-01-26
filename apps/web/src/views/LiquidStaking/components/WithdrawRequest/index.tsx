import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Button, CardBody, Flex, Message, MessageText, RowBetween, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useCurrency } from 'hooks/Tokens'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import useTokenBalance from 'hooks/useTokenBalance'
import NextLink from 'next/link'
import { OptionProps } from 'pages/liquid-staking/index'
import { formatUnixTime } from 'utils/formatTime'
import { useReadWithdrawRequestInfo } from 'views/LiquidStaking/hooks/useReadWithdrawRequestInfo'
import { Address } from 'wagmi'

export const WithdrawRequest = ({ selectedList }: { selectedList: OptionProps }) => {
  const { t } = useTranslation()

  const { balance: stakedTokenBalance } = useTokenBalance(selectedList.token1.address as Address)
  const userCakeDisplayBalance = getFullDisplayBalance(stakedTokenBalance, selectedList.token1.decimals, 6)

  const userWithdrawRequest = useReadWithdrawRequestInfo()

  const withdrawRequestAmount = userWithdrawRequest
    ? getFullDisplayBalance(userWithdrawRequest?.totalWbethAmount, selectedList.token1.decimals, 6)
    : '0'

  const currency1 = useCurrency(selectedList.token1.address)

  const withdrawRequestAmountToken =
    currency1 && userWithdrawRequest?.totalWbethAmount
      ? CurrencyAmount.fromRawAmount(currency1, userWithdrawRequest.totalWbethAmount.toString())
      : undefined

  const stakedAmountToken =
    currency1 && stakedTokenBalance ? CurrencyAmount.fromRawAmount(currency1, stakedTokenBalance.toString()) : undefined

  const tokenUSDPrice = useStablecoinPrice(currency1)

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

        <RowBetween mb="8px" alignItems="start">
          <Text color="textSubtle">{t('Withdraw Amount')}</Text>
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

        <RowBetween mb="8px">
          <Text color="textSubtle">{t('Date of withdraw request')}</Text>

          <Text ml="4px">
            {userWithdrawRequest ? formatUnixTime(userWithdrawRequest.latestTriggerTime.toNumber()) : '-'}
          </Text>
        </RowBetween>

        <RowBetween mb="16px">
          <Text color="textSubtle">{t('Withdrawal state')}</Text>

          <Text ml="4px">{t('Pending (in the queue)')}</Text>
        </RowBetween>

        <Message variant="warning" mb="16px">
          <MessageText>{t('Withdrawal request might takes up to 7 days.')}</MessageText>
        </Message>
        <NextLink href={`/liquid-staking/request-withdraw/${selectedList.contract}`}>
          <Button disabled={stakedTokenBalance.eq(0)} width="100%">
            {stakedTokenBalance.eq(0) && withdrawRequestAmountToken?.greaterThan(0)
              ? t('Pending Withdraw')
              : t('Withdraw')}
          </Button>
        </NextLink>
      </CardBody>
    </>
  )
}
