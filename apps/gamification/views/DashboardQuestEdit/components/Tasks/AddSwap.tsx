import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import {
  Box,
  BunnyFillIcon,
  Button,
  ChevronDownIcon,
  DeleteOutlineIcon,
  ErrorFillIcon,
  Flex,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { CurrencySearchModal } from 'components/SearchModal/CurrencySearchModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

const StyleNetwork = styled(Flex)`
  position: absolute;
  bottom: 0px;
  left: 20px;
  z-index: 3;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  overflow: hidden;
  background-size: contain;
`

const TokenWithChain = styled(Flex)`
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  cursor: pointer;
`

export const AddSwap = () => {
  const { t } = useTranslation()
  const [total, setTotal] = useState('')
  const defaultCurrency = (CAKE as any)?.[56]
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(defaultCurrency)

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency)
  }, [])

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal selectedCurrency={selectedCurrency} onCurrencySelect={handleCurrencySelect} />,
  )

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value)
  }

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          <BunnyFillIcon color="#7A6EAA" width="20px" height="20px" />
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {t('Make a swap')}
        </Text>
        <DeleteOutlineIcon style={{ cursor: 'pointer' }} color="primary" width="20px" height="20px" ml="auto" />
      </Flex>
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flexDirection="column">
          <Flex>
            <Flex position="relative" paddingRight="45px" onClick={onPresentCurrencyModal}>
              <TokenWithChain>
                <Box position="relative" zIndex={1} minWidth="32px" height="32px">
                  <CurrencyLogo currency={selectedCurrency} size="32px" />
                </Box>
                <StyleNetwork
                  style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/${selectedCurrency?.chainId}.png)` }}
                />
              </TokenWithChain>
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
              <StyledInput isError value={total} placeholder={t('Min. amount in $')} onChange={handleTotalChange} />
            </StyledInputGroup>
          </Flex>
          <InputErrorText errorText={t('Cannot be 0')} />
        </Flex>
      </Flex>
    </Flex>
  )
}
