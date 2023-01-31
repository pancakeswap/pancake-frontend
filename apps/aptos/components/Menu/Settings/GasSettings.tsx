import { Flex, Button, Text, QuestionHelper } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserPrioritizedGasPrice } from 'state/user/prioritizedGasPrice'

export const GasSettings = () => {
  const { t } = useTranslation()
  const [prioritized, setPrioritized] = useUserPrioritizedGasPrice()

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text>
          {t('Default Transaction Speed (%unit%)', {
            unit: 'Octa',
          })}
        </Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher %unit% = higher speed = higher fees',
            {
              unit: 'Octa',
            },
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setPrioritized(false)
          }}
          variant={!prioritized ? 'primary' : 'tertiary'}
        >
          {t('Default')}
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setPrioritized(true)
          }}
          variant={prioritized ? 'primary' : 'tertiary'}
        >
          {t('Prioritized')}
        </Button>
      </Flex>
    </Flex>
  )
}
