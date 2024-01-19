import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, Text } from '@pancakeswap/uikit'
import { TOKEN_RISK } from 'components/AccessRisk'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface AccessRiskTooltipsProps {
  riskLevel?: number
  hasResult?: boolean
  tokenAddress?: string
  riskLevelDescription?: string
}

const AccessRiskTooltips: React.FC<AccessRiskTooltipsProps> = ({
  riskLevel,
  hasResult,
  riskLevelDescription,
  tokenAddress,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  if (riskLevel === TOKEN_RISK.UNKNOWN || !hasResult) {
    return (
      <>
        <Text my="8px">
          {t(
            'Risk scanning is still in progress. It may take up to 5 minutes to fully scan a token which is new to the database.',
          )}
        </Text>
        <Text as="span">{t('Provided by')}</Text>
        <Link style={{ display: 'inline' }} ml="4px" external href="https://www.hashdit.io">
          HashDit
        </Link>
        <Flex mt="4px">
          <Text>{t('Learn more about risk rating')}</Text>
          <Link ml="4px" external href="https://hashdit.github.io/hashdit/docs/risk-level-description">
            {t('here.')}
          </Link>
        </Flex>
      </>
    )
  }

  if (hasResult && riskLevel && riskLevel >= TOKEN_RISK.VERY_LOW && tokenAddress) {
    return (
      <>
        <Text my="8px">{riskLevelDescription}</Text>
        <Text as="span">{t('Risk scan results are provided by a third party,')}</Text>
        <Link style={{ display: 'inline' }} ml="4px" external href="https://www.hashdit.io">
          HashDit
        </Link>
        {chainId === ChainId.BSC && (
          <Flex mt="4px">
            <Text>{t('Get more details from')}</Text>
            <Link ml="4px" external href={`https://dappbay.bnbchain.org/risk-scanner/${tokenAddress}`}>
              {t('RedAlarm')}
            </Link>
          </Flex>
        )}
      </>
    )
  }

  return (
    <>
      <Text my="8px">
        {t(
          'Automatic risk scanning for the selected token. This scanning result is for reference only, and should NOT be taken as investment advice.',
        )}
      </Text>
      <Text as="span">{t('Provided by')}</Text>
      <Link style={{ display: 'inline' }} ml="4px" external href="https://www.hashdit.io">
        HashDit
      </Link>
      <Link mt="4px" external href="https://hashdit.github.io/hashdit/docs/risk-level-description">
        {t('Learn More')}
      </Link>
    </>
  )
}

export default AccessRiskTooltips
