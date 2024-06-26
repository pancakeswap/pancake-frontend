import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { CAKE, getTokensByChain } from '@pancakeswap/tokens'
import { Box, Button, Flex, InjectedModalProps, Input, Modal, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import { CurrencySearch } from 'components/SearchModal/CurrencySearch'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTokenBalance from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'

export enum CurrencyModalView {
  search,
  currencyInput,
}

interface ModalConfig {
  title: string
  onBack: () => void
}

interface AddRewardModalProps extends InjectedModalProps {
  reward: undefined | QuestRewardType
  amountOfWinners: number
  handlePickedRewardToken: (value: Currency, totalRewardAmount: number, amountOfWinnersInModal: number) => void
}

export const AddRewardModal: React.FC<React.PropsWithChildren<AddRewardModalProps>> = ({
  reward,
  amountOfWinners,
  handlePickedRewardToken,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.currencyInput)
  const [amountOfWinnersInModal, setAmountOfWinnersInModal] = useState(0)
  const { chainId } = useActiveWeb3React()

  const defaultInputCurrency = useMemo((): Currency => {
    const list = getTokensByChain(reward?.currency?.network)
    const findToken = list.find((i) => i.address.toLowerCase() === reward?.currency?.address?.toLowerCase())
    return findToken || (CAKE as any)?.[chainId]
  }, [chainId, reward])

  const displayAmountOfWinnersInModal = useMemo(
    () => amountOfWinnersInModal || amountOfWinners || 0,
    [amountOfWinners, amountOfWinnersInModal],
  )

  const [inputCurrency, setInputCurrency] = useState<Currency>(defaultInputCurrency)
  const [stakeAmount, setStakeAmount] = useState(reward?.totalRewardAmount?.toString() ?? '')
  const { balance: currencyBalance } = useTokenBalance(inputCurrency?.wrapped?.address)

  const config = {
    [CurrencyModalView.currencyInput]: { title: t('Add a reward'), onBack: onDismiss },
    [CurrencyModalView.search]: {
      title: 'Select a Token',
      onBack: () => setModalView(CurrencyModalView.currencyInput),
    },
  } as { [key in number]: ModalConfig }

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

  const handleInputSelect = useCallback((newCurrency: Currency) => {
    setInputCurrency(newCurrency)
    setModalView(CurrencyModalView.currencyInput)
  }, [])

  const handleInputAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      setAmountOfWinnersInModal(Number(e.target.value))
    }
  }, [])

  const handleContinue = () => {
    handlePickedRewardToken(inputCurrency, Number(stakeAmount), displayAmountOfWinnersInModal)
    onDismiss?.()
  }

  return (
    <Modal title={config[modalView].title} onDismiss={config[modalView].onBack}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '380px']}
      >
        {modalView === CurrencyModalView.currencyInput && (
          <>
            <Box width="100%">
              <CurrencyInputPanel
                id="currency-input"
                showMaxButton
                showLogoWithChain
                showQuickInputButton
                value={stakeAmount}
                currency={inputCurrency}
                maxAmount={currencyBalance}
                onMax={handleMaxInput}
                onUserInput={setStakeAmount}
                onPercentInput={handlePercentButton}
                onCurrencySelect={handleInputSelect}
                onPressCustomModal={() => setModalView(CurrencyModalView.search)}
              />
              <Flex justifyContent="center" mt="32px">
                <Text style={{ alignSelf: 'center' }} fontSize="14px" color="textSubtle" mr="8px">
                  {t('Choose amount of winners:')}
                </Text>
                <Box width="80px">
                  <Input
                    pattern="^[0-9]+$"
                    inputMode="numeric"
                    value={displayAmountOfWinnersInModal}
                    onChange={handleInputAmount}
                  />
                </Box>
              </Flex>
            </Box>
            <Button
              width="100%"
              mt="24px"
              disabled={Boolean(!inputCurrency || !stakeAmount || !displayAmountOfWinnersInModal)}
              onClick={handleContinue}
            >
              {t('Continue')}
            </Button>
          </>
        )}
        {modalView === CurrencyModalView.search && (
          <Box width="100%">
            <CurrencySearch selectedCurrency={inputCurrency} onCurrencySelect={handleInputSelect} />
          </Box>
        )}
      </Flex>
    </Modal>
  )
}
