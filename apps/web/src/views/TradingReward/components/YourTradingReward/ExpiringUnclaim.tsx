import { Box, Flex, Card, Text, Balance, InfoIcon, Message, MessageText, TooltipText, Button } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'

const ExpiringUnclaim = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  return (
    <Flex
      padding="0 16px"
      width={['100%', '100%', '100%', '900px']}
      margin={['32px auto 61px auto']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <Box width={['100%', '100%', '100%', '48.5%']} mb={['24px', '24px', '24px', '0']}>
        <Card style={{ width: '100%' }}>
          <Box padding={['24px']}>
            <Box mb="24px">
              <SubgraphHealthIndicator inline subgraphName="pancakeswap/pottery" />
            </Box>
            <GreyCard>
              <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                {t('Your Current trading rewards')}
              </Text>
              <Balance bold fontSize={['40px']} prefix="$ " decimals={2} value={300} />
              <Balance fontSize="14px" color="textSubtle" prefix="~ " unit=" CAKE" decimals={2} value={300} />
              <Text fontSize="12px" color="textSubtle" mt="4px">
                {t('Available for claiming')}
                <Text fontSize="12px" color="textSubtle" m="0 4px" as="span" bold>
                  in 3d 5h 6m
                </Text>
                (at ~00:00 UTC 18 May 2023)
              </Text>
            </GreyCard>
            <GreyCard mt="24px">
              <Flex>
                <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                  {t('Your Current Trading VOLUME')}
                </Text>
                <InfoIcon color="secondary" width={16} height={16} ml="4px" />
              </Flex>
              <Balance bold fontSize={['24px']} prefix="$ " decimals={2} value={300} />
            </GreyCard>
          </Box>
        </Card>
      </Box>
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
                  {t('Claim')}
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
    </Flex>
  )
}

export default ExpiringUnclaim
