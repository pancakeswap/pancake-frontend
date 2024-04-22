import { useTranslation } from '@pancakeswap/localization'
import { CalenderIcon, Card, Flex, InfoIcon, Link, LogoRoundIcon, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledThumbnail = styled('div')`
  width: 100%;
  height: 175px;
  border-radius: 16px;
  margin-bottom: 16px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 180px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 236px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 200px;
  }
`

export const Campaign = () => {
  const { t } = useTranslation()

  return (
    <Link href="/" external>
      <Card>
        <Flex flexDirection="column" padding="16px">
          <StyledThumbnail
            style={{
              backgroundImage: `url('https://sgp1.digitaloceanspaces.com/strapi.space/ef14df0bf361ee3d0a0b604a54f0decb.jpg')`,
            }}
          />
          {/* <StyledThumbnail style={{ backgroundImage: `url(${build.imageUrl})` }}/> */}
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
          <Flex mt="16px">
            <Flex>
              <Text fontSize="12px" color="textSubtle">
                ~150 Total Value
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Flex>
            <Flex ml="16px">
              <Text fontSize="12px" color="textSubtle">
                Lucky Draw
              </Text>
              <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Link>
  )
}
