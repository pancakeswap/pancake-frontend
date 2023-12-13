import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Flex, LinkExternal, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const StyledContainer = styled(Box)`
  width: 100%;
  padding: 32px 16px;
  background: ${({ theme }) => theme.colors.gradientInverseBubblegum};
`

const StyledLinkExternal = styled(LinkExternal)`
  &:hover {
    text-decoration: none;
  }
`

export const Banner = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <StyledContainer>
      <Box margin="auto" width={['100%', '100%', '100%', '100%', '100%', '100%', '1019px']}>
        <Text
          bold
          lineHeight="110%"
          color="secondary"
          mb={['16px', '16px', '16px', '16px', '16px', '24px']}
          fontSize={['40px', '40px', '40px', '40px', '40px', '64px']}
        >
          {isDesktop ? t('PancakeSwap Gaming Marketplace') : t('Gaming Marketplace')}
        </Text>
        <Text bold lineHeight="110%" fontSize={['16px', '16px', '16px', '16px', '24px']}>
          {t('Play, Build and Connect on PancakeSwap')}
        </Text>
        <Flex mt="16px">
          <StyledLinkExternal href="https://forms.gle/WXDhmbfRhQtz4eSt7" showExternalIcon={false}>
            <Text bold color="primary">
              {t('Start Building')}
            </Text>
            <ArrowForwardIcon ml="2px" color="primary" />
          </StyledLinkExternal>
        </Flex>
      </Box>
    </StyledContainer>
  )
}
