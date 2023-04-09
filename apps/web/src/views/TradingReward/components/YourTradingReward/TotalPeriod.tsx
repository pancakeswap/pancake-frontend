import { Box, Flex, Card, Text, Balance, Message, MessageText, TooltipText, Button } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { useTranslation } from '@pancakeswap/localization'

const TotalPeriod = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  return (
    <Box width={['100%', '100%', '100%', '48.5%']}>
      <Card style={{ width: '100%' }}>
        <Box padding={['24px']}>
          <Text bold textAlign="right" mb="24px">
            {t('Total')}
          </Text>
          <GreyCard>
            <Flex flexDirection={['column', 'column', 'column', 'row']}>
              <Box>
                <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                  {t('Your unclaimed trading rewards')}
                </Text>
                <Balance bold fontSize={['40px']} prefix="$ " decimals={2} value={300} />
                <Balance fontSize="14px" color="textSubtle" prefix="~ " unit=" CAKE" decimals={2} value={300} />
              </Box>
              <Button
                width={['100%', '100%', '100%', 'fit-content']}
                m={['10px 0 0 0', '10px 0 0 0', '10px 0 0 0', 'auto 0 auto auto']}
              >
                {t('Claim All')}
              </Button>
            </Flex>
            <Message variant="danger" mt="16px">
              <MessageText>
                <TooltipText bold as="span">
                  $14.234
                </TooltipText>
                <Text m="0 4px" as="span">
                  unclaimed reward expiring in
                </Text>
                <Text ref={targetRef} bold as="span">
                  6d : 15h : 1m
                </Text>
                {tooltipVisible && tooltip}
              </MessageText>
            </Message>
          </GreyCard>
          <GreyCard mt="24px">
            <Box mb="24px">
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL trading Reward')}
              </Text>
              <Balance bold fontSize={['24px']} prefix="$ " decimals={2} value={300} />
            </Box>
            <Box>
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL VOLUME Traded')}
              </Text>
              <Balance bold fontSize={['24px']} prefix="$ " decimals={2} value={300} />
            </Box>
          </GreyCard>
        </Box>
      </Card>
    </Box>
  )
}

export default TotalPeriod
