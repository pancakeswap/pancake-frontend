import { styled } from 'styled-components'
import { Box, Text, Flex, Card, Button, ArrowForwardIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const StyledImage = styled('div')`
  position: absolute;
  width: 125px;
  height: 182px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('/images/how_it_work.png');
  z-index: 1;
  right: 0;
  top: -45%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 251px;
    height: 365px;
    top: auto;
    bottom: 5%;
  }
`

const HowItWork = () => {
  const { t } = useTranslation()

  return (
    <Box position="relative" m={['150px auto 0 auto']} padding={['0 16px']} width={['100%', '100%', '100%', '663px']}>
      <StyledImage />
      <Card>
        <Box padding={['24px']}>
          <Flex flexDirection="column" mb={['24px', '24px', '58px']} width={['100%', '300px']}>
            <Text bold fontSize={['16px', '16px', '24px']} color="primary">
              {t('How does it work?')}
            </Text>
            <Text bold fontSize={['24px', '24px', '40px']} m={['16px 0']} lineHeight="110%">
              {t('Learn basics of PancakeSwap')}
            </Text>
            <Text fontSize={['14px', '14px', '16px']} color="textSubtle">
              {t('Trade tokens, earn rewards and play to win!')}
            </Text>
          </Flex>
          <Link external href="https://docs.pancakeswap.finance/get-started">
            <Button endIcon={<ArrowForwardIcon color="currentColor" />}>{t('Learn how')}</Button>
          </Link>
        </Box>
      </Card>
    </Box>
  )
}

export default HowItWork
