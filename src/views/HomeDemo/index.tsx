
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { FetchBalanceToken } from 'state/demoFetchData/fetchTokenBalance'

const CsSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const HomeDemo = () => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { dataUser } = FetchBalanceToken()
    const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }
    return (
        <>
            <CsSection
                innerProps={{ style: HomeSectionContainerStyles }}
                background={theme.colors.gradientCardHeader}
                index={1}
                hasCurvedDivider={false}
            >
                <Text>{t("Demo page")}</Text>
                <Text> Account test: 0xA6912ed0CB1700c0fa7200Dfe26e90dd2aE2364a</Text>
                <Text>Demo read balance token RUN : {Number(dataUser.balance).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </CsSection>
        </>
    )
}
export default HomeDemo