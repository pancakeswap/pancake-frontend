import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, CardHeader, Heading, LinkExternal, Text, useTooltip } from '@pancakeswap/uikit'

import FoldableText from 'components/FoldableSection/FoldableText'
import { ONRAMP_PROVIDERS } from '../constants'

type LinkDataMap = {
  [key in ONRAMP_PROVIDERS]: string
}

const linkData: LinkDataMap = {
  [ONRAMP_PROVIDERS.Mercuryo]:
    'https://help.mercuryo.io/hc/en-gb/articles/14495507502749-Which-fiat-currencies-are-supported',
  [ONRAMP_PROVIDERS.MoonPay]: 'https://support.moonpay.com/customers/docs/moonpays-supported-currencies',
  [ONRAMP_PROVIDERS.Transak]: 'https://transak.com/global-coverage',
  [ONRAMP_PROVIDERS.Topper]:
    'https://support.topperpay.com/hc/en-us/articles/8926553047708-What-fiat-currencies-does-Topper-support',
}

const PartnersDocumentation = ({ t }) => {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <Box>
      {Object.entries(linkData).map(([provider, href]) => (
        <LinkExternal key={provider} href={href}>
          {provider}
        </LinkExternal>
      ))}
    </Box>,
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <Text ref={targetRef} style={{ display: 'inline-flex', textDecoration: 'underline dotted' }}>
        {t('partners documentation')}
      </Text>
    </>
  )
}

const config = (t) => [
  {
    title: t("Why can't I see my bitcoin purchase"),
    description: t(
      'Transfers through the Bitcoin network may take longer due to network congestion. Please check your BTC address again after a few hours.',
    ),
  },
  {
    title: t('Why can’t I see quotes from providers?'),
    description: t('Some providers might not operate in your region or support the currency/token exchange requested.'),
  },
  {
    title: t('What fiat currencies are supported?'),
    description: (
      <>
        {t(
          'Different providers will support different currencies and payment methods in your region. Please refer to our',
        )}{' '}
        <LinkExternal
          style={{ display: 'inline-flex' }}
          href="https://docs.pancakeswap.finance/products/buy-crypto"
          showExternalIcon={false}
        >
          {t('documentation')}
        </LinkExternal>{' '}
        {t('or')} <PartnersDocumentation t={t} /> {t('for more info.')}
      </>
    ),
  },
  {
    title: t('Where can find more information on the Buy Crypto feature?'),
    description: (
      <>
        {t('Please refer to our documentation')}{' '}
        <LinkExternal
          style={{ display: 'inline-flex' }}
          href="https://docs.pancakeswap.finance/products/buy-crypto"
          showExternalIcon={false}
        >
          {t('here.')}
        </LinkExternal>
      </>
    ),
  },
]

export const OnRampFaqs = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Heading color="secondary" scale="lg">
          {t('FAQ')}
        </Heading>
      </CardHeader>
      <CardBody>
        {config(t).map(({ title, description }, i, { length }) => (
          <FoldableText key={title} id={title} mb={i + 1 === length ? '' : '24px'} title={title}>
            <Text color="textSubtle" as="p">
              {description}
            </Text>
          </FoldableText>
        ))}
      </CardBody>
    </Card>
  )
}
