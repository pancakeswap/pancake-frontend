import {
  Flex,
  Text,
  InputGroup,
  Input,
  Box,
  Card,
  CopyIcon,
  ShareIcon,
  AddCircleIcon,
  ArrowDownIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'

const YourWrapper = styled(Box)`
  background: linear-gradient(180deg, #53dee9, #7645d9);
  padding: 1px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
`

const YourCardInner = styled(Box)`
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const FriendsWrapper = styled(Box)`
  width: 100%;
  padding: 1px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientVioletAlt};
`

const FriendsCardInner = styled(Box)`
  padding: 24px 16px;
  background: #eaecf4;
  border-radius: ${({ theme }) => theme.radii.default};
`

const MyReferralLink = () => {
  const { t } = useTranslation()

  return (
    <Box width={['488px']} margin={['56px auto']}>
      <Card>
        <Box padding={['24px']}>
          <Flex mb={['17px']}>
            <Text bold fontSize={['20px']}>
              My Referral Link
            </Text>
            <Flex ml={['auto']} alignSelf={['center']} style={{ cursor: 'pointer' }}>
              <Text color="textSubtle">Create a new link</Text>
              <AddCircleIcon ml="4px" color="primary" />
            </Flex>
          </Flex>
          <Flex mb="16px">
            <InputGroup endIcon={<CopyIcon width="18px" color="textSubtle" />} scale="lg">
              <Input type="text" value="http://pancakeswap.finance/ref=47730d" />
            </InputGroup>
            <ShareIcon width={24} height={24} ml="16px" color="primary" />
          </Flex>
          <Box>
            <Text bold textAlign="center" mb="8px">
              You will get
            </Text>
            <YourWrapper>
              <YourCardInner>
                <Text fontSize={['32px']} bold textAlign="center">
                  0%
                </Text>
              </YourCardInner>
            </YourWrapper>
          </Box>
          <ArrowDownIcon color="textSubtle" display="block" margin="16px auto" width={24} height={24} />
          <Box>
            <Text bold textAlign="center" mb="8px">
              Friends will get
            </Text>
            <FriendsWrapper>
              <FriendsCardInner>
                <Text fontSize={['32px']} bold textAlign="center">
                  0%
                </Text>
              </FriendsCardInner>
            </FriendsWrapper>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default MyReferralLink
