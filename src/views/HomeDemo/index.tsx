
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'


const CsSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const HomeDemo = () => {
    const { t } = useTranslation()
    const { theme } = useTheme()
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
            </CsSection>
        </>
    )
}
export default HomeDemo