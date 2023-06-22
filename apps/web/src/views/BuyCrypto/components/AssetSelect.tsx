import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDropDownIcon,
  Box,
  CircleLoader,
  CurrencyLogo,
  Flex,
  RowBetween,
  RowFixed,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { useCallback } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { useAllOnRampTokens } from 'hooks/Tokens'

const AssetSelectButton = styled.div`
  width: 100%;
  height: 60px;
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

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
  padding-left: 4px;
  padding-right: 4px;
`

const chainIdToNetwork: { [network: number]: string } = {
  1: 'Ethereum',
  56: 'Binance Chain',
}

function Balance({ balance, currency }: { balance: CurrencyAmount<Currency>; currency: Currency }) {
  return (
    <Flex alignItems="center" justifyContent="center">
      <StyledBalanceText title={balance.toExact()}>{formatAmount(balance, 4)}</StyledBalanceText>
      <Text color="textSubtle" fontSize="12px" ellipsis fontWeight="bold" textAlign="center" paddingTop="2px">
        {`${currency?.symbol}`}
      </Text>
    </Flex>
  )
}

const AssetSelect = ({ onCurrencySelect, currency }) => {
  const { t } = useTranslation()
  const account = useAccount()
  const balance = useCurrencyBalance(account.address, currency)
  const onRampTokens = useAllOnRampTokens()
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      mode="onramp-output"
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      showCommonBases={false}
      showSearchInput={false}
      tokensToShow={onRampTokens as any}
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
        <RowFixed style={{ justifySelf: 'flex-end' }}>
          {balance ? <Balance balance={balance} currency={currency} /> : account.address ? <CircleLoader /> : null}
        </RowFixed>
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
