import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Column, LinkExternal, PageHeader, Row, Text } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { BCakeBoosterCard } from 'views/Farms/components/YieldBooster/components/bCakeV3/BCakeBoosterCard'
import { FarmFlexWrapper, FarmH1, FarmH2 } from 'views/Farms/styled'
import { SubMenu } from 'views/PositionManagers/components/SubMenu'

export const PoolsBanner = ({ additionLink }: { additionLink?: React.ReactNode }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <>
      <SubMenu />
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
              <Row flexWrap="wrap" gap="16px">
                <LinkExternal
                  href="https://docs.pancakeswap.finance/products/yield-farming/how-to-use-farms"
                  showExternalIcon={false}
                >
                  <Button p="0" variant="text">
                    <Text color="primary" bold fontSize="16px" mr="4px">
                      {t('Learn How')}
                    </Text>
                  </Button>
                </LinkExternal>
                {!!additionLink && (
                  <>
                    <VerticalDivider bg={theme.colors.inputSecondary} />
                    {additionLink}
                  </>
                )}
              </Row>
            </Box>
            <Box>
              <BCakeBoosterCard />
            </Box>
          </FarmFlexWrapper>
        </Column>
      </PageHeader>
    </>
  )
}
