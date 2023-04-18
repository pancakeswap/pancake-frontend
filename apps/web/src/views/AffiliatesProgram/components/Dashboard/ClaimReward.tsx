import { Card, Flex, Text, Button, Box } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

const CardContainer = styled(Flex)`
  flex-direction: column;

  ${LightGreyCard} {
    margin: 0 0 16px 0;
    &:last-child {
      margin: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;

    ${LightGreyCard} {
      margin: 0 16px 0 0;
      &:last-child {
        margin: 0;
      }
    }
  }
`

const ClaimReward = () => {
  const { t } = useTranslation()

  return (
    <Box mt="16px">
      <Flex>
        <Card style={{ width: '100%' }}>
          <Flex flexDirection="column" padding={['24px']}>
            <Flex justifyContent="space-between" mb="16px">
              <Text
                style={{ alignSelf: 'center' }}
                color="secondary"
                bold
                fontSize={['12px']}
                textTransform="uppercase"
              >
                {t('claim your rewards')}
              </Text>
              <Button display={['none', 'none', 'none', 'block']} scale="sm">
                Claim Reward
              </Button>
            </Flex>
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
              </LightGreyCard>

              <LightGreyCard>
                <Text bold fontSize="12px" mb="22px">
                  Perpetual
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
              </LightGreyCard>
            </CardContainer>
            <Button display={['block', 'block', 'block', 'none']} variant="secondary" mt="18px" width="100%">
              Claim Reward
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Box>
  )
}

export default ClaimReward
