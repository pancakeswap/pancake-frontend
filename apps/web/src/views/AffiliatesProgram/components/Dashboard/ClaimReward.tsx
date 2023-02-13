import { Card, Flex, Text, Button } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import styled from 'styled-components'

const CardContainer = styled(Flex)`
  ${LightGreyCard} {
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const ClaimReward = () => {
  return (
    <Flex maxWidth={['1110px']} m="auto">
      <Card style={{ width: '100%' }}>
        <Flex flexDirection="column" padding={['24px']}>
          <Text mb="16px" color="secondary" bold fontSize={['12px']} textTransform="uppercase">
            claim your rewards
          </Text>
          <CardContainer>
            <LightGreyCard>
              <Text bold fontSize="12px" mb="22px">
                v2/v3 Swaps & StableSwap
              </Text>
              <Flex justifyContent="space-between" mb="7px">
                <Text color="textSubtle" fontSize="14px">
                  Total friends
                </Text>
                <Text bold fontSize="14px">
                  63
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text color="textSubtle" fontSize="14px">
                  Rewards earned
                </Text>
                <Text bold fontSize="14px">
                  500 CAKE
                </Text>
              </Flex>
              <Button mt="18px" width="100%">
                Claim Reward
              </Button>
            </LightGreyCard>

            <LightGreyCard>
              <Text bold fontSize="12px" mb="22px">
                v2/v3 Swaps & StableSwap
              </Text>
              <Flex justifyContent="space-between" mb="7px">
                <Text color="textSubtle" fontSize="14px">
                  Total friends
                </Text>
                <Text bold fontSize="14px">
                  63
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text color="textSubtle" fontSize="14px">
                  Rewards earned
                </Text>
                <Text bold fontSize="14px">
                  500 CAKE
                </Text>
              </Flex>
              <Button mt="18px" width="100%">
                Claim Reward
              </Button>
            </LightGreyCard>
          </CardContainer>
        </Flex>
      </Card>
    </Flex>
  )
}

export default ClaimReward
