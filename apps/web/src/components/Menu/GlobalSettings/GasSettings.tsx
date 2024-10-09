import { useTranslation } from '@pancakeswap/localization'
import { Flex, QuestionHelper, Text } from '@pancakeswap/uikit'
import { GAS_PRICE, GAS_PRICE_GWEI } from 'state/types'
import { useGasPriceManager } from 'state/user/hooks'
import { PrimaryOutlineButton } from './styles'

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  // const defaultGasPrice = useDefaultGasPrice()

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
        <PrimaryOutlineButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.rpcDefault)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.rpcDefault ? 'primary' : 'text'}
        >
          {t('Default')}
          {/* {defaultGasPrice ? ` (${formatGwei(defaultGasPrice)})` : null} */}
        </PrimaryOutlineButton>
        <PrimaryOutlineButton
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'text'}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
        </PrimaryOutlineButton>
        <PrimaryOutlineButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'text'}
        >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
        </PrimaryOutlineButton>
        <PrimaryOutlineButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'text'}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
        </PrimaryOutlineButton>
      </Flex>
    </Flex>
  )
}

export default GasSettings
