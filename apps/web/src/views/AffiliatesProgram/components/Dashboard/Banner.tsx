import { Box, Text, PageSection } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;

  > img {
    position: absolute;
  }

  & :nth-child(1) {
    right: 20%;
    top: 5%;
    width: 69px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 138px;
    }
  }
  & :nth-child(2) {
    right: 12%;
    bottom: 0%;
    width: 126px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 155px;
    }
  }
  & :nth-child(3) {
    right: 7%;
    top: 10%;
    width: 71px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 95px;
    }
  }
}`

const Banner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <PageSection
      position="relative"
      index={1}
      dividerPosition="bottom"
      background={theme.colors.gradientBubblegum}
      clipFill={{ light: theme.colors.background }}
      innerProps={{ style: { width: '100%', paddingTop: '0px' } }}
    >
      <Decorations>
        <img src="/images/affiliates-program/bobbing-1.png" width="138px" height="95px" alt="" />
        <img src="/images/affiliates-program/bobbing-2.png" width="155px" height="121px" alt="" />
        <img src="/images/affiliates-program/bobbing-3.png" width="95px" height="74px" alt="" />
      </Decorations>
      <Box maxWidth={['1120px']}>
        <Text bold color="secondary" fontSize={['40px']}>
          {t('Dashboard')}
        </Text>
        <Text fontSize={['20px']}>{t('Manage your affiliates link, see how much you’ve earned')}</Text>
      </Box>
    </PageSection>
  )
}

export default Banner
