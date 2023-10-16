import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, LinkExternal, ArrowForwardIcon } from '@pancakeswap/uikit'

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

  return (
    <StyledContainer>
      <Box margin="auto" width={['100%', '100%', '100%', '100%', '100%', '100%', '1018px']}>
        <Text color="secondary" bold mb="24px" lineHeight="110%" fontSize={['64px']}>
          {t('PancakeSwap Gaming Community')}
        </Text>
        <Text bold lineHeight="110%" fontSize={['16px', '16px', '16px', '24px']}>
          {t('Play, Build and Connect on PancakeSwap')}
        </Text>
        <Flex mt="12px">
          <StyledLinkExternal href="1231" showExternalIcon={false}>
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
