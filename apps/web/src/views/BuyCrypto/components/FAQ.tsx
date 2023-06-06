import { useTranslation } from '@pancakeswap/localization'
import { Card, CardHeader, Heading, CardBody, Text } from '@pancakeswap/uikit'

import FoldableText from 'components/FoldableSection/FoldableText'

const config = (t) => [
  {
    title: t('What Onramp providers does PancakeSwap support?'),
    description: t(
      'PancakeSwap currency integrates with 3 different fiat onramp providers. Those are Moonpay, Mercuryo and Binance Connect. These three allow us to support a more locations including users in Europe, the US and Asia',
    ),
  },
  {
    title: t('Why cant I see quotes from all Providers?'),
    description: t(
      'Depending on your location you may not be eligible to use the onramp services provided by each provider. For example Moonpay have great suppport for people in Europe and the US but the dont have support for Asia. Whereas Binance Connect have a lot of support for Asian countires.',
    ),
  },
  {
    title: t('What Fiat currencies can i use to buy crypto with PancakeSwap?'),
    description: t(
      'Right now we support a handful of different fiat currencies. to see them all please consult the list here.',
    ),
  },
  {
    title: t('What are my Purchase Limits?'),
    description: t(
      'Purchase limits will vary by region, currency and level of Know Your Customer KYC documents provided. Each different provider that PancakeSwap supports have different purchase limits. if you want to know the limit for each please see the appropiate provider documentation.',
    ),
  },
  {
    title: t('What crypto currencies can I buy with PancakeSwap?'),
    description: t(
      'Right now we support a handful of different popular crypto assets.. to see them all please consult the list here.',
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
