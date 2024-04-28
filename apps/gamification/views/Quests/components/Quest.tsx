import { useTranslation } from '@pancakeswap/localization'
import { CalenderIcon, Card, Flex, InfoIcon, Link, LogoRoundIcon, Text } from '@pancakeswap/uikit'

import { styled } from 'styled-components'

const Detail = styled(Flex)`
  padding: 0 8px;
  border-right: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const DetailContainer = styled(Flex)`
  margin-top: 16px;

  ${Detail} {
    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      border: 0;
    }
  }
`

export const Quest = () => {
  const { t } = useTranslation()

  return (
    <Link href="/quests/1">
      <Card>
        <Flex flexDirection="column" padding="16px">
          <Flex mb="16px">
            <CalenderIcon color="textSubtle" mr="8px" />
            <Text color="textSubtle" fontSize={['14px']}>
              Apr 10 - Apr 21
            </Text>
          </Flex>
          <Text bold fontSize={['20px']} lineHeight={['24px']}>
            Swap and Share $10,000 on Ethereum PancakeSwap
          </Text>
          <Card isActive style={{ width: 'fit-content', padding: '2px', marginTop: '16px' }}>
            <Flex padding="8px">
              <LogoRoundIcon width={24} height={24} />
              <Flex ml="8px">
                <Text bold fontSize="20px" lineHeight="24px">
                  100
                </Text>
                <Text bold fontSize="14px" style={{ alignSelf: 'flex-end' }} ml="2px">
                  USDT
                </Text>
              </Flex>
            </Flex>
          </Card>
          <DetailContainer>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                6 Tasks
              </Text>
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                50 rewards
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                Lucky Draw
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Detail>
          </DetailContainer>
        </Flex>
      </Card>
    </Link>
  )
}
