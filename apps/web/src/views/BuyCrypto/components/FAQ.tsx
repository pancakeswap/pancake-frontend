import { useTranslation } from '@pancakeswap/localization'
import { Card, CardHeader, Heading, CardBody, Text, LinkExternal } from '@pancakeswap/uikit'

import FoldableText from 'components/FoldableSection/FoldableText'

const config = (t) => [
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
        {t('or')}{' '}
        <LinkExternal
          style={{ display: 'inline-flex' }}
          href="https://help.mercuryo.io/en/articles/6122838-on-and-off-ramps"
        >
          {t('partners documentation')}
        </LinkExternal>{' '}
        {t('for more info.')}
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

export const OnRamoFaqs = () => {
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
