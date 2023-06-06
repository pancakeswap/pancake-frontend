import { useTranslation } from '@pancakeswap/localization'
import { ArrowDropDownIcon, Box, CurrencyLogo, Flex, RowBetween, Text, useModal } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { useCallback } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import styled from 'styled-components'

const AssetSelectButton = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.dropdown};
  transition: border-radius 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.input};
    cursor: pointer;
  }
`

const chainIdToNetwork: { [network: number]: string } = {
  1: 'Ethereum',
  56: 'Binance Chain',
}

const AssetSelect = ({ onCurrencySelect, currency }) => {
  const { t } = useTranslation()
  const account = useAccount()
  const selectedCurrencyBalance = useCurrencyBalance(account.address ?? undefined, currency ?? undefined)
  const balance = !!currency && formatAmount(selectedCurrencyBalance, 6)

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      mode="onramp-output"
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      showCommonBases={false}
    />,
  )

  const onCurrencySelectClick = useCallback(() => {
    onPresentCurrencyModal()
  }, [onPresentCurrencyModal])

  return (
    <Flex flexDirection="column" onClick={onCurrencySelectClick}>
      <Flex justifyContent="space-between" px="4px">
        <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
          {t('I want to buy')}
        </Text>
        {balance ? (
          <Text color="textSubtle" fontSize="12px" ellipsis>
            {`${balance} ${currency?.symbol}`}
          </Text>
        ) : null}
      </Flex>
      <AssetSelectButton>
        <RowBetween>
          <Text>{chainIdToNetwork[currency?.chainId]}</Text>
          <Flex>
            <Box width={24} height={24}>
              <CurrencyLogo currency={currency} size="24px" />
            </Box>
            <Text mx="4px">{currency?.symbol}</Text>
            <ArrowDropDownIcon />
          </Flex>
        </RowBetween>
      </AssetSelectButton>
    </Flex>
  )
}

export default AssetSelect
