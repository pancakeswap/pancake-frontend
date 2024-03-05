import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { AllHooks } from 'views/LandingV4/components/ExploreHooks/AllHooks'
import { Contribute } from 'views/LandingV4/components/ExploreHooks/Contribute'

const ExploreHooksContainer = styled(Box)`
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 40px auto;

  @media screen and (min-width: 1440px) {
    padding: 0;
    margin: 64px auto;
  }
`

export const ExploreHooks = () => {
  const { t } = useTranslation()

  return (
    <ExploreHooksContainer id="hooks">
      <Flex justifyContent="center" mb="40px">
        <Text
          bold
          as="span"
          color="secondary"
          lineHeight={['32px', '36px', '36px', '40px']}
          fontSize={['28px', '36px', '36px', '40px']}
        >
          {t('Explore')}
        </Text>
        <Text
          bold
          as="span"
          ml="4px"
          lineHeight={['32px', '36px', '36px', '40px']}
          fontSize={['28px', '36px', '36px', '40px']}
        >
          {t('Hooks')}
        </Text>
      </Flex>
      <AllHooks />
      <Contribute />
    </ExploreHooksContainer>
  )
}
