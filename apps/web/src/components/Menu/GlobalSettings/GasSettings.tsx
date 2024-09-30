import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, QuestionHelper, Text } from '@pancakeswap/uikit'
import { GAS_PRICE, GAS_PRICE_GWEI } from 'state/types'
import { useDefaultGasPrice, useGasPriceManager } from 'state/user/hooks'
import styled from 'styled-components'
import { formatGwei } from 'viem'

const StyledButton = styled(Button)`
  border-radius: ${({ theme }) => theme.radii['12px']};
  padding: 0 16px;
  height: 40px;

  color: ${({ theme, variant }) => (variant === 'text' ? theme.colors.primary60 : 'text')};
  border: ${({ theme, variant }) => (variant === 'text' ? `2px solid ${theme.colors.primary}` : '')};
`

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const defaultGasPrice = useDefaultGasPrice()

  return (
    <Flex flexDirection="column">
      <Flex mb="6px" alignItems="center">
        <Text>{t('Default Transaction Speed (GWEI)')}</Text>
        <QuestionHelper
          text={
            <Flex flexDirection="column">
              <Text>
                {t(
                  'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.',
                )}
              </Text>
              <Text mt="8px">{t('Choose “Default” to use the settings from your current blockchain RPC node.')}</Text>
            </Flex>
          }
          placement="top"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <StyledButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.rpcDefault)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.rpcDefault ? 'primary' : 'text'}
        >
          {t('Default')}
          {defaultGasPrice ? ` (${formatGwei(defaultGasPrice)})` : null}
        </StyledButton>
        <StyledButton
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'text'}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
        </StyledButton>
        <StyledButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'text'}
        >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
        </StyledButton>
        <StyledButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'text'}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
        </StyledButton>
      </Flex>
    </Flex>
  )
}

export default GasSettings
