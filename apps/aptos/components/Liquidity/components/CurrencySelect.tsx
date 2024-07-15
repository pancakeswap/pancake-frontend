import { useAccount, useBalance } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDropDownIcon,
  AutoRow,
  Box,
  BoxProps,
  DropDownContainer,
  DropDownHeader,
  Flex,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo/CurrencyLogo'
import CurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/CurrencySearchModal'

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
  const { account } = useAccount()

  const { data: selectedCurrencyBalance, isLoading } = useBalance({
    address: account?.address,
    coin: selectedCurrency?.wrapped?.address,
    enabled: !hideBalance && !!selectedCurrency,
    watch: true,
  })

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

  // Philip TODO: Add BUSD feature later
  // const price = useBUSDPrice(selectedCurrencyBalance && selectedCurrency ? selectedCurrency : undefined)
  // const quoted = selectedCurrencyBalance && price?.quote(selectedCurrencyBalance)

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
          <AutoRow justifyContent="space-between" gap="8px">
            <Text color="textSubtle" fontSize="12px">
              {t('Balance')}:
            </Text>
            <Text fontSize="12px">{!isLoading ? selectedCurrencyBalance?.formatted ?? '0' : t('Loading')}</Text>
          </AutoRow>
          {/* <RowBetween>
            <div />
            {Number.isFinite(+quoted?.toExact()) && (
              <Text fontSize="12px" color="textSubtle">
                ~${formatNumber(+quoted.toExact())}
              </Text>
            )}
          </RowBetween> */}
        </Box>
      )}
    </Box>
  )
}
