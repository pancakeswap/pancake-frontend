import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'

export const Countdown = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t('When the Quest time expires, the users who are eligible to get the reward will be randomly drawn')}
    </Text>,
    {
      placement: 'top',
    },
  )

  return (
    <Card style={{ width: '100%', marginBottom: '16px' }}>
      <Flex flexDirection="column" padding="12px">
        <Flex m="auto" ref={targetRef}>
          <Text bold mr="4px">
            Lucky Draw
          </Text>
          <InfoIcon color="textSubtle" style={{ alignSelf: 'center' }} />
        </Flex>
        {tooltipVisible && tooltip}
        <Flex justifyContent="center">
          <Flex width="40px" flexDirection="column" alignItems="center">
            <Text fontSize={['28px']} bold line-height="32px">
              01
            </Text>
            <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
              Days
            </Text>
          </Flex>
          <Text fontSize={['28px']} m="0 8px" color="textSubtle" bold>
            :
          </Text>
          <Flex width="40px" flexDirection="column" alignItems="center">
            <Text fontSize={['28px']} bold line-height="32px">
              01
            </Text>
            <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
              Hours
            </Text>
          </Flex>
          <Text fontSize={['28px']} m="0 8px" color="textSubtle" bold>
            :
          </Text>
          <Flex width="40px" flexDirection="column" alignItems="center">
            <Text fontSize={['28px']} bold line-height="32px">
              01
            </Text>
            <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
              Minutes
            </Text>
          </Flex>
          <Text fontSize={['28px']} m="0 8px" color="textSubtle" bold>
            :
          </Text>
          <Flex width="40px" flexDirection="column" alignItems="center">
            <Text fontSize={['28px']} bold line-height="32px">
              01
            </Text>
            <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
              Seconds
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}
