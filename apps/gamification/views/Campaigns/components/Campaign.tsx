import { useTranslation } from '@pancakeswap/localization'
import { Box, CalenderIcon, Card, Flex, InfoIcon, Link, LogoRoundIcon, Tag, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledThumbnail = styled('div')`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transition: 0.5s;
`

const Detail = styled(Flex)`
  padding: 0 5px;
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

interface CampaignProps {
  showStatus?: boolean
}

export const Campaign: React.FC<CampaignProps> = ({ showStatus }) => {
  const { t } = useTranslation()

  return (
    <Link href="/campaigns/2">
      <Card>
        <Flex flexDirection="column" padding="16px">
          <Box
            overflow="hidden"
            borderRadius="16px"
            height={['175px', '175px', '180px', '236px', '236px', '200px']}
            mb="16px"
          >
            <StyledThumbnail
              className="thumbnail"
              style={{
                backgroundImage: `url('https://sgp1.digitaloceanspaces.com/strapi.space/ef14df0bf361ee3d0a0b604a54f0decb.jpg')`,
              }}
            />
          </Box>
          {/* <StyledThumbnail style={{ backgroundImage: `url(${build.imageUrl})` }}/> */}
          <Flex mb="16px">
            {showStatus && (
              <Tag variant="textDisabled" outline mr="auto">
                <Text bold color="textSubtle">
                  {t('Upcoming')}
                </Text>
                {/* <Text bold color="success">
                  {t('Completed')}
                </Text>
                <Text bold color="secondary">
                  {t('Ongoing')}
                </Text>
                <Text bold color="textDisabled">
                  {t('Finished')}
                </Text> */}
              </Tag>
            )}
            <Flex>
              <CalenderIcon color="textSubtle" mr="8px" />
              <Text color="textSubtle" fontSize={['14px']}>
                Apr 10 - Apr 21
              </Text>
            </Flex>
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
                ~150 Total Value
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
