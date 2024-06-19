import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Column, LinkExternal, PageHeader, Row, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { FarmFlexWrapper, FarmH1, FarmH2 } from '../../styled'

export const Header = () => {
  const { t } = useTranslation()
  return (
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
            <Row flexWrap="wrap">
              {/* @todo @ChefJerry update to real link */}
              <LinkExternal href="https://blog.pancakeswap.finance/" showExternalIcon={false} mr="20px">
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
            </Row>
          </Box>
          <Box>
            {/* @todo @ChefJerry replace image url when ready */}
            {/* @todo @ChefJerry mobile position */}
            <img src="/images/cake-staking/new-staking-bunny.png" alt="new-staking-bunny" width="138px" />
          </Box>
        </FarmFlexWrapper>
      </Column>
    </PageHeader>
  )
}
