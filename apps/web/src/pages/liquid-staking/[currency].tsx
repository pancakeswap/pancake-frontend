import { useTranslation } from '@pancakeswap/localization'
import { CardBody, Text, RowBetween, Box, Flex, Image } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import Page from 'views/Page'
import { useCurrency } from 'hooks/Tokens'
import { LightGreyCard } from 'components/Card'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import AddToWalletButton from 'components/AddToWallet/AddToWalletButton'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { LiquidStakingFAQs } from 'views/LiquidStaking/components/FAQs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useLiquidStakingList, fetchLiquidStaking } from 'views/LiquidStaking/hooks/useLiquidStakingList'
import StakeInfo from 'views/LiquidStaking/components/StakeInfo'
import { useExchangeRate } from 'views/LiquidStaking/hooks/useExchangeRate'
import LiquidStakingButton from 'views/LiquidStaking/components/LiquidStakingButton'

const LiquidStakingStakePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { account, chainId } = useAccountActiveChain()
  const liquidStakingList = useLiquidStakingList()
  const [stakeAmount, setStakeAmount] = useState('')
  const [showPage, setShowPage] = useState(false)

  useEffect(() => {
    const contract: string = (router?.query?.contract as string) ?? ''
    const fetch = async () => {
      const list = await fetchLiquidStaking(chainId)
      const hasContract = list?.find((i) => i.contract.toLowerCase() === contract?.toLowerCase())
      if (hasContract) {
        setShowPage(true)
      } else {
        await router.push('/liquid-staking')
      }
    }

    if (contract) {
      fetch()
    }
  }, [chainId, router])

  const selectedList = useMemo(() => {
    const currency = (router?.query?.currency as string) ?? ''
    const contract: string = (router?.query?.contract as string) ?? ''
    return liquidStakingList?.find(
      (i) => i.contract.toLowerCase() === contract?.toLowerCase() || i.token0.symbol === currency,
    )
  }, [liquidStakingList, router])

  const { exchangeRateList } = useExchangeRate({ decimals: selectedList?.token0?.decimals })

  const inputCurrency = useCurrency(selectedList?.token0?.address || selectedList?.token0?.symbol)
  const currencyBalance = useCurrencyBalance(account, inputCurrency)
  const currentAmount = useMemo(() => (stakeAmount ? new BigNumber(stakeAmount) : BIG_ZERO), [stakeAmount])

  const outputCurrency = useCurrency(selectedList?.token1?.address)
  const outputCurrencyBalance = useCurrencyBalance(account, outputCurrency)

  const quoteAmount = useMemo(() => {
    const pickedRate = exchangeRateList?.find(
      (i) => i?.contract?.toLowerCase() === selectedList?.contract?.toLowerCase(),
    )?.exchangeRate

    return currentAmount && pickedRate ? currentAmount.dividedBy(pickedRate?.toString()) : BIG_ZERO
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
            {t('Deposit Amount')}
          </Text>
          <Box mb="16px">
            <CurrencyInputPanel
              showUSDPrice
              maxAmount={currencyBalance}
              disableCurrencySelect
              value={stakeAmount}
              onMax={() => setStakeAmount(maxAmountSpend(currencyBalance)?.toExact())}
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
              <AddToWalletButton
                variant="text"
                p="0"
                pb="8px"
                pr="4px"
                height="auto"
                width="fit-content"
                tokenAddress={selectedList?.token1?.address}
                tokenSymbol={outputCurrency?.symbol}
                tokenDecimals={outputCurrency?.decimals}
                tokenLogo={undefined}
              />
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
                  ? getFullDisplayBalance(quoteAmount, 0, selectedList?.token0?.decimals)
                  : '0'}
              </Text>
              <Flex>
                <Box width={24} height={24}>
                  <Image
                    src={`/images/tokens/${selectedList?.token1?.address}.png`}
                    width={24}
                    height={24}
                    alt={selectedList?.token1?.symbol}
                  />
                </Box>
                <Text ml="4px">{selectedList?.token1?.symbol}</Text>
              </Flex>
            </RowBetween>
          </LightGreyCard>
          <StakeInfo selectedList={selectedList} />
          <LiquidStakingButton
            quoteAmount={quoteAmount}
            inputCurrency={inputCurrency}
            currentAmount={currentAmount}
            selectedList={selectedList}
            currencyBalance={currencyBalance}
          />
        </CardBody>
      </AppBody>
      <AppBody>
        <LiquidStakingFAQs />
      </AppBody>
    </Page>
  )
}

LiquidStakingStakePage.chains = [ChainId.ETHEREUM, ChainId.BSC, ChainId.BSC_TESTNET, ChainId.GOERLI]

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { currency } = params

  if (!['ETH', 'WETH', 'BNB', 'GOR'].includes(currency as string)) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/liquid-staking`,
      },
    }
  }

  return {
    props: {},
  }
}

export default LiquidStakingStakePage
