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

const Wrapper = styled(Flex)`
  padding: 1px;
  width: 100%;
  margin: auto auto 49px auto;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};

  ${({ theme }) => theme.mediaQueries.md} {
    width: fit-content;
  }
`

const StyledCommission = styled(Flex)`
  width: 100%;
  align-items: center;
  flex-direction: column;
  align-self: center;
  padding: 12px 0;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 150px;
    padding: 0;
  }
`

const CardInner = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: 8px 24px;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  flex-direction: column;

  ${StyledCommission} {
    border-bottom: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};

    &:last-child {
      border: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;

    ${StyledCommission} {
      border-bottom: 0;
      border-right: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};

      &:last-child {
        border: 0;
      }
    }
  }
`

const receivePercentageList: Array<string> = ['0', '10', '25', '50']

const MyReferralLink = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [percentage, setPercentage] = useState('0')

  const dataList = useMemo(() => commissionList.filter((i) => i.percentage !== '?'), [commissionList])

  return (
    <Box width={['100%', '100%', '100%', '700px']} m={[' 0 0 32px 0', ' 0 0 32px 0', ' 0 0 32px 0', ' 0 0 0 32px']}>
      <Card>
        <Box padding={['24px']}>
          <Text bold mb={['17px']} color="secondary" fontSize="12px" textTransform="uppercase">
            create a new link
          </Text>
          <Flex mb="24px">
            <InputGroup endIcon={<CopyIcon width="18px" color="textSubtle" />} scale="lg">
              <Input type="text" placeholder="http://" />
            </InputGroup>
            <ShareIcon width={24} height={24} ml="16px" color="primary" />
          </Flex>
          <Flex width={['320px']} m={['auto auto 36px auto']} justifyContent={['space-between']}>
            <Box>
              <Text color="textSubtle">You will receive</Text>
              <Text color="secondary" bold fontSize={['32px']} textAlign="center">
                100%
              </Text>
            </Box>
            <ArrowForwardIcon color="textSubtle" style={{ alignSelf: 'center' }} />
            <Box>
              <Text color="textSubtle">Friends will receive</Text>
              <Text color="primary" bold fontSize={['32px']} textAlign="center">
                0%
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
          <Flex flexDirection={['column', 'column', 'column', 'row']}>
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
            <Input scale="lg" type="text" maxLength={100} placeholder="Note (100 characters)" />
          </Flex>
          <Button mt="24px" width="100%">
            Generate a referral link
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default MyReferralLink
