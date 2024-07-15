import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDropDownIcon,
  Box,
  BoxProps,
  DropDownContainer,
  DropDownHeader,
  Flex,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import CurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/CurrencySearchModal'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import { AutoRow, RowBetween } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'

interface CurrencySelectProps extends CurrencySearchModalProps, BoxProps {
  hideBalance?: boolean
}

export const CurrencySelect = ({
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases,
  commonBasesType,
  hideBalance,
  ...props
}: CurrencySelectProps) => {
  const { address: account } = useAccount()

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    !hideBalance && selectedCurrency ? selectedCurrency : undefined,
  )

  const { t } = useTranslation()

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  const price = useStablecoinPrice(selectedCurrencyBalance && selectedCurrency ? selectedCurrency : undefined)
  const quoted = selectedCurrencyBalance && price?.quote(selectedCurrencyBalance)

  return (
    <Box width="100%" {...props}>
      <DropDownContainer p={0} onClick={onPresentCurrencyModal}>
        <DropDownHeader justifyContent="space-between">
          <Text id="pair" color={!selectedCurrency ? 'text' : undefined}>
            {!selectedCurrency ? (
              <>{t('Select')}</>
            ) : (
              <Flex alignItems="center" justifyContent="space-between">
                <CurrencyLogo currency={selectedCurrency} size="24px" style={{ marginRight: '8px' }} />
                <Text id="pair" bold>
                  {selectedCurrency && selectedCurrency.symbol && selectedCurrency.symbol.length > 20
                    ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                        selectedCurrency.symbol.length - 5,
                        selectedCurrency.symbol.length,
                      )}`
                    : selectedCurrency?.symbol}
                </Text>
              </Flex>
            )}
          </Text>
        </DropDownHeader>
        <ArrowDropDownIcon color="text" className="down-icon" />
      </DropDownContainer>
      {account && !!selectedCurrency && !hideBalance && (
        <Box>
          <AutoRow justify="space-between" gap="2px">
            <Text color="textSubtle" fontSize="12px">
              {t('Balance')}:
            </Text>
            <Text fontSize="12px">{formatAmount(selectedCurrencyBalance, 6) ?? t('Loading')}</Text>
          </AutoRow>
          <RowBetween>
            <div />
            {quoted && Number.isFinite(+quoted?.toExact()) && (
              <Text fontSize="12px" color="textSubtle">
                ~${formatNumber(+quoted.toExact())}
              </Text>
            )}
          </RowBetween>
        </Box>
      )}
    </Box>
  )
}
