import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Box, Button, Flex, InjectedModalProps, Modal } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTokenBalance from 'hooks/useTokenBalance'
import { useCallback, useState } from 'react'

interface AddRewardModalProps extends InjectedModalProps {}

export const AddRewardModal: React.FC<React.PropsWithChildren<AddRewardModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const defaultInputCurrency = (CAKE as any)?.[chainId]
  const [inputCurrency, setInputCurrency] = useState<Currency>(defaultInputCurrency)
  const [stakeAmount, setStakeAmount] = useState('')
  const { balance: currencyBalance } = useTokenBalance(inputCurrency?.address)

  const handleMaxInput = useCallback(() => {
    const newBalanceAmount = getFullDisplayBalance(currencyBalance, inputCurrency.decimals).toString()
    setStakeAmount(newBalanceAmount)
  }, [currencyBalance, inputCurrency])

  const handlePercentButton = useCallback(
    (percent: number) => {
      const amount = currencyBalance.multipliedBy(new BigNumber(percent).div(100))
      const newBalanceAmount = getFullDisplayBalance(amount, inputCurrency.decimals).toString()
      setStakeAmount(newBalanceAmount)
    },
    [currencyBalance, inputCurrency.decimals],
  )

  const handleInputSelect = useCallback((newCurrency: Currency) => setInputCurrency(newCurrency), [])

  return (
    <Modal title={t('Add a reward')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '430px']}
      >
        <Box width="100%">
          <CurrencyInputPanel
            id="currency-input"
            showMaxButton
            showQuickInputButton
            value={stakeAmount}
            currency={inputCurrency}
            maxAmount={currencyBalance}
            onMax={handleMaxInput}
            onUserInput={setStakeAmount}
            onPercentInput={handlePercentButton}
            onCurrencySelect={handleInputSelect}
          />
        </Box>
        <Button width="100%" mt="24px">
          {t('Continue')}
        </Button>
      </Flex>
    </Modal>
  )
}
