import { Card, Flex, InfoIcon, Text } from '@pancakeswap/uikit'

export const Countdown = () => {
  return (
    <Card style={{ width: '100%', marginBottom: '16px' }}>
      <Flex flexDirection="column" padding="12px 34px">
        <Flex m="auto">
          <Text bold mr="4px">
            Lucky Draw
          </Text>
          <InfoIcon color="textSubtle" style={{ alignSelf: 'center' }} />
        </Flex>
        <Flex>
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
