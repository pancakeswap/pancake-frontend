import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Column, LinkExternal, PageHeader, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { PropsWithChildren } from 'react'
import { FarmFlexWrapper, FarmH1, FarmH2 } from './styled'

export const V4PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Column>
          <FarmFlexWrapper>
            <Box style={{ flex: '1 1 100%' }}>
              <FarmH1 as="h1" scale="xxl" color="secondary" mb="24px">
                {t('Earn from LP')}
              </FarmH1>
              <FarmH2 scale="lg" color="text">
                {t('Liquidity Pools & Farms')}
              </FarmH2>
              {/* @todo @ChefJerry update to real link */}
              <LinkExternal href="https://blog.pancakeswap.finance/">
                <Button p="0" variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Learn How')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </LinkExternal>
              <NextLinkFromReactRouter to="/farms/auction" prefetch={false}>
                <Button p="0" variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Community Auctions')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </NextLinkFromReactRouter>
            </Box>
          </FarmFlexWrapper>
        </Column>
      </PageHeader>
      {children}
    </>
  )
}
