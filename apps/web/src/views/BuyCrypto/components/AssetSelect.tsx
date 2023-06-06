import { useTranslation } from '@pancakeswap/localization'
import { Box, CurrencyLogo, Flex, RowBetween, Text, useModal } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { CryptoCard } from 'components/Card'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { useCallback } from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'

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
        <Flex>
          <Text color="textSubtle" fontSize="12px" ellipsis>
            {balance}
          </Text>
        </Flex>
      </Flex>
      <CryptoCard mb="16px" padding="12px 12px">
        <RowBetween>
          <Text>Binance</Text>
          <Flex>
            <Box width={24} height={24}>
              {/* <Image src={`/images/tokens/${wbethContract?.address}.png`} width={24} height={24} alt="WBETH" /> */}
              <CurrencyLogo currency={currency} size="24px" />
            </Box>
            <Text mx="4px">{currency?.symbol}</Text>
            {/* <ArrowDropDownIcon /> */}
          </Flex>
        </RowBetween>
      </CryptoCard>
    </Flex>
  )
}

export default AssetSelect
