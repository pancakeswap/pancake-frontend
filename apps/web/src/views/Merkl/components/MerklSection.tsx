import { AutoRow, Button, Text, Flex, Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'

export function MerklSection() {
  const { t } = useTranslation()

  return (
    <>
      <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
        {t('Merkl Rewards')}
      </Text>
      <AutoRow justifyContent="space-between" mb="8px">
        <Text fontSize="24px" fontWeight={600}>
          $ -
        </Text>

        <Button scale="sm" onClick={() => {}}>
          {t('Claim')}
        </Button>
      </AutoRow>
      <LightGreyCard
        mr="4px"
        style={{
          padding: '16px 8px',
          marginBottom: '8px',
        }}
      >
        <AutoRow justifyContent="space-between" mb="8px">
          <Flex>
            {/* <CurrencyLogo currency={feeValueUpper?.currency} /> */}
            <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
              MATIC
            </Text>
          </Flex>
          <Flex justifyContent="center">
            <Text small>-</Text>
          </Flex>
        </AutoRow>
      </LightGreyCard>
      <Message variant="primary">
        <MessageText>
          This liquidity position is currently earning rewards on Merkl. Check details here <br />
          Learn more about Merkl
        </MessageText>
      </Message>
    </>
  )
}
