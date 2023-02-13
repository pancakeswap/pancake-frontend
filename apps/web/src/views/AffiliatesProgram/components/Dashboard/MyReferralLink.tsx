import { useState } from 'react'
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
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import commissionList from 'views/AffiliatesProgram/utils/commisionList'

const Wrapper = styled(Flex)`
  padding: 1px;
  width: fit-content;
  margin: auto auto 49px auto;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};
`

const StyledCommission = styled(Flex)`
  width: 150px;
  align-items: center;
  flex-direction: column;
  align-self: center;
`

const CardInner = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: 8px 24px;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};

  ${StyledCommission} {
    &:first-child {
      border-right: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};
    }
  }
`

const receivePercentageList: Array<string> = ['0', '10', '25', '50']

const MyReferralLink = () => {
  const { t } = useTranslation()
  const [percentage, setPercentage] = useState('0')

  return (
    <Box width={['700px']} ml={['32px']}>
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
              {commissionList.map((list) => (
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
          <Flex>
            <Flex>
              {receivePercentageList.map((list) => (
                <Button
                  key={list}
                  mr={['8px']}
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
