import { useMemo, useState } from 'react'
import {
  Flex,
  Text,
  InputGroup,
  Input,
  Box,
  Card,
  CopyIcon,
  ShareIcon,
  Button,
  ArrowForwardIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import commissionList from 'views/AffiliatesProgram/utils/commisionList'
import BigNumber from 'bignumber.js'

const Wrapper = styled(Flex)`
  padding: 1px;
  width: 100%;
  margin: 46px auto auto auto;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};

  ${({ theme }) => theme.mediaQueries.md} {
    width: fit-content;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin: auto auto auto 36px;
  }
`

const StyledCommission = styled(Flex)`
  position: relative;
  width: 50%;
  min-width: 84px;
  align-items: center;
  flex-direction: column;
  align-self: center;
  padding: 9px 0;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    height: 60px;
    width: 1px;
    transform: translateY(-50%);
    background-color: ${({ theme }) => theme.colors.inputSecondary};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 124px;
  }
`

const CardInner = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  flex-direction: row;
  flex-wrap: wrap;

  ${StyledCommission} {
    &:nth-child(even) {
      &:before {
        display: none;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 297px;
  }
`

const receivePercentageList: Array<string> = ['0', '10', '25', '50']

const MyReferralLink = () => {
  const { t } = useTranslation()
  const [linkId, setLinkId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const [percentage, setPercentage] = useState('0')

  const youWillReceive = useMemo(() => new BigNumber(100).minus(percentage).toString(), [percentage])

  const dataList = useMemo(() => commissionList.filter((i) => i.percentage !== '?'), [])

  const isReady = useMemo(() => linkId !== '' && !isLoading, [linkId, isLoading])

  const handleGenerateLink = async () => {
    console.log('123')
  }

  return (
    <Box
      width={['100%', '100%', '100%', '100%', '100%', '700px']}
      m={['32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '0 0 0 32px']}
    >
      <Card>
        <Box padding={['24px']}>
          <Text bold mb={['17px']} color="secondary" fontSize="12px" textTransform="uppercase">
            {t('create a new link')}
          </Text>
          <Flex mb="24px">
            <InputGroup endIcon={<CopyIcon width="18px" color="textSubtle" />} scale="lg">
              <Input value={linkId} type="text" placeholder="http://" onChange={(e) => setLinkId(e.target.value)} />
            </InputGroup>
            <ShareIcon width={24} height={24} ml="16px" color="primary" />
          </Flex>
          <Flex flexDirection={['column', 'column', 'column', 'column', 'column', 'row']} mb="36px">
            <Flex alignSelf="center" width={['100%', '320px']} justifyContent={['space-between']}>
              <Box>
                <Text fontSize="14px" color="textSubtle">
                  {t('You will receive')}
                </Text>
                <Text color="secondary" bold fontSize={['32px']} textAlign="center">
                  {`${youWillReceive}%`}
                </Text>
              </Box>
              <ArrowForwardIcon color="textSubtle" style={{ alignSelf: 'center' }} />
              <Box>
                <Text fontSize="14px" color="textSubtle">
                  {t('Friends will receive')}
                </Text>
                <Text color="primary" bold fontSize={['32px']} textAlign="center">
                  {`${percentage}%`}
                </Text>
              </Box>
            </Flex>
            <Wrapper>
              <CardInner>
                {dataList.map((list) => (
                  <StyledCommission key={list.image.url}>
                    <Text fontSize="12px" textAlign="center" bold color="secondary" textTransform="uppercase">
                      {list.title}
                    </Text>
                    <Text fontSize={['32px']} bold>
                      {list.percentage}
                    </Text>
                  </StyledCommission>
                ))}
              </CardInner>
            </Wrapper>
          </Flex>
          <Flex mb={['8px', '8px', '8px', '0']}>
            {receivePercentageList.map((list) => (
              <Button
                scale={isMobile ? 'sm' : 'md'}
                width={`${100 / receivePercentageList.length}%`}
                key={list}
                mr="8px"
                variant={list === percentage ? 'primary' : 'tertiary'}
                onClick={() => setPercentage(list)}
              >
                {`${list}%`}
              </Button>
            ))}
          </Flex>
          <Button mt="24px" width="100%" disabled={!isReady} onClick={handleGenerateLink}>
            {t('Generate a referral link')}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default MyReferralLink
