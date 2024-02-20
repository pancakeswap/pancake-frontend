import { useTranslation } from '@pancakeswap/localization'
import { Box, CardBody, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { AppBody, AppHeader } from 'components/App'
import { LightGreyCard } from 'components/Card'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { LIQUID_STAKING_SUPPORTED_CHAINS } from 'config/constants/supportChains'
import { useCurrency } from 'hooks/Tokens'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { LiquidStakingFAQs } from 'views/LiquidStaking/components/FAQs'
import { RequestWithdrawButton } from 'views/LiquidStaking/components/RequestWithdrawButton'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useExchangeRate } from 'views/LiquidStaking/hooks/useExchangeRate'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'
import Page from 'views/Page'

const LiquidStakingStakePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: list, isFetching } = useLiquidStakingList()
  const { account, chainId } = useAccountActiveChain()
  const [stakeAmount, setStakeAmount] = useState('')
  const [showPage, setShowPage] = useState(false)
  const [selectedList, setSelectedList] = useState<null | LiquidStakingList>(null)

  useEffect(() => {
    const contract: string = (router?.query?.contract as string) ?? ''
    const fetch = () => {
      const hasContract = list?.find((i) => i.contract.toLowerCase() === contract?.toLowerCase())
      if (hasContract) {
        setSelectedList(hasContract)
        setShowPage(true)
      } else {
        router.push('/liquid-staking')
      }
    }

    if (contract && !isFetching) {
      fetch()
    }
  }, [chainId, list, router, isFetching])

  const { exchangeRateList } = useExchangeRate({ decimals: selectedList?.token0?.decimals })

  const inputCurrency = useCurrency(selectedList?.token1?.address)
  const currencyBalance = useCurrencyBalance(account, inputCurrency)
  const currentAmount = useMemo(() => (stakeAmount ? new BigNumber(stakeAmount) : BIG_ZERO), [stakeAmount])

  const outputCurrency = useCurrency(selectedList?.token0?.address || selectedList?.token0?.symbol)
  const outputCurrencyBalance = useCurrencyBalance(account, outputCurrency)

  const quoteAmount = useMemo(() => {
    const pickedRate = exchangeRateList?.find(
      (i) => i?.contract?.toLowerCase() === selectedList?.contract?.toLowerCase(),
    )?.exchangeRate

    return currentAmount && pickedRate ? currentAmount.multipliedBy(pickedRate?.toString()) : BIG_ZERO
  }, [currentAmount, exchangeRateList, selectedList?.contract])

  if (!showPage) {
    return null
  }

  return (
    <Page>
      <AppBody mb="24px">
        <AppHeader
          backTo="/liquid-staking"
          subtitle={t('Unlock liquidity while earning rewards')}
          title={t('Liquid Staking')}
          noConfig
          shouldCenter
        />
        <CardBody>
          <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
            {t('Request Withdraw Amount')}
          </Text>

          <Box mb="16px">
            <CurrencyInputPanel
              showUSDPrice
              maxAmount={currencyBalance}
              disableCurrencySelect
              value={stakeAmount}
              onMax={() => setStakeAmount(maxAmountSpend(currencyBalance)?.toExact() || '')}
              onUserInput={setStakeAmount}
              showQuickInputButton
              showMaxButton
              currency={inputCurrency}
              id="stake-liquidity-input-token"
              showCommonBases
            />
          </Box>
          <Flex justifyContent="space-between">
            <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
              {t('You will receive')}
            </Text>
            <Flex>
              <Text color="textSubtle" fontSize="12px" ellipsis>
                {t('Balance: %balance%', {
                  balance: outputCurrencyBalance
                    ? getFullDisplayBalance(
                        new BigNumber(outputCurrencyBalance.quotient.toString()),
                        outputCurrencyBalance.currency.decimals,
                        6,
                      )
                    : '0',
                })}
              </Text>
            </Flex>
          </Flex>
          <LightGreyCard mb="16px" padding="8px 12px">
            <RowBetween>
              <Text>
                {quoteAmount && quoteAmount.isGreaterThan(0)
                  ? getFullDisplayBalance(quoteAmount, 0, outputCurrency?.wrapped?.decimals)
                  : '0'}
              </Text>
              <Flex>
                {outputCurrency ? <CurrencyLogo currency={outputCurrency} /> : null}
                <Text ml="4px">{outputCurrency?.symbol}</Text>
              </Flex>
            </RowBetween>
          </LightGreyCard>

          {account ? (
            selectedList?.token0 &&
            selectedList?.token1 &&
            inputCurrency && (
              <RequestWithdrawButton
                inputCurrency={inputCurrency}
                currentAmount={currentAmount}
                selectedList={selectedList}
              />
            )
          ) : (
            <ConnectWalletButton width="100%" />
          )}
        </CardBody>
      </AppBody>
      {selectedList?.FAQs ? (
        <AppBody>
          <LiquidStakingFAQs config={selectedList.FAQs} />
        </AppBody>
      ) : null}
    </Page>
  )
}

LiquidStakingStakePage.chains = LIQUID_STAKING_SUPPORTED_CHAINS

export default LiquidStakingStakePage
