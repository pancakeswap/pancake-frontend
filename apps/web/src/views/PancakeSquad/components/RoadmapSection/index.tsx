import { Text, Heading, Card, CardHeader, CardBody, CircleOutlineIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import { LandingBodyWrapper } from 'views/PancakeSquad/styles'

const FaqSection = () => {
  const { t } = useTranslation()

  return (
    <LandingBodyWrapper>
      <LandingBodyWrapper>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div
            style={{
              fontSize: '24px',
              width: '12px',
              background: 'var(--colors-gradientCardHeader)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                borderRadius: '50%',
                background: 'var(--colors-gradientCardHeader)',
                minWidth: '42px',
                minHeight: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateX(-50%) translateX(6px)',
              }}
            >
              🚀
            </span>
          </div>
          <Card>
            <CardHeader>
              <Heading scale="lg" color="secondary">
                {t('Launch')}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text>🍦Launch of the swapping and liquidity provision functionality.</Text>
              <Text>🍦Provision of Icecream project token with multiple Icecream airdrops to the community</Text>
              <Text>
                🍦Creation of end-point and support for all bridged token after the official stablecoin bridge is live
              </Text>
              <Text>
                🍦Create a analytics page for the swap to show all pools, their liquidity, volume and much more.
              </Text>
              <Text textAlign="end" fontStyle="italic" color="textSubtle">
                06-2022
              </Text>
            </CardBody>
          </Card>
        </div>
      </LandingBodyWrapper>
    </LandingBodyWrapper>
  )
}

export default FaqSection
