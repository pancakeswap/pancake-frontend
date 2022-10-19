
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { Text, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { FetchBalanceToken } from 'state/demoFetchData/fetchTokenBalance'
import { useTransfer } from 'state/demoFetchData/useTranferToken'
import { bscTokens, ethwTokens, bscTestnetTokens } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

function renderTokenByChain(chainId){
    if( chainId === ChainId.BSC ) {
        return bscTokens.runtogether.address
    } if (chainId === ChainId.ETHW_MAINNET) {
        return ethwTokens.runtogether.address
    } if (chainId === ChainId.BSC_TESTNET) {
        return bscTestnetTokens.runtogether.address
    }
    return ""
}
const CsSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const HomeDemo = () => {
    const { t } = useTranslation()
    const { chainId } = useActiveWeb3React()
    const { theme } = useTheme()
    const { dataUser } = FetchBalanceToken()
    const tokenAddress = renderTokenByChain(chainId)
    const { handleTransfer, pendingTransfer } = useTransfer(tokenAddress)
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
                <Text>Demo write contract</Text>
                <Button 
                    mt="1rem"
                    onClick={handleTransfer}
                    disabled={pendingTransfer}
                    endIcon={pendingTransfer ? <AutoRenewIcon spin color="currentColor" /> : null}
                >
                    Transfer Token RUN
                </Button>
            </CsSection>
        </>
    )
}
export default HomeDemo