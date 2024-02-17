import { useTranslation } from '@pancakeswap/localization'
import { Card, CardBody, CardHeader, Heading, Text } from '@pancakeswap/uikit'
import FoldableText from 'components/FoldableSection/FoldableText'
import { FAQType } from 'views/LiquidStaking/constants/types'

interface LiquidStakingFAQsProps {
  config?: FAQType[]
}

export const LiquidStakingFAQs: React.FC<LiquidStakingFAQsProps> = ({ config }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Heading color="secondary" scale="lg">
          {t('FAQ')}
        </Heading>
      </CardHeader>
      <CardBody>
        {config?.map(({ id, title, description }, i, { length }) => (
          // eslint-disable-next-line react/no-array-index-key
          <FoldableText key={id} mb={i + 1 === length ? '' : '24px'} title={title}>
            <Text color="textSubtle" as="p">
              {description}
            </Text>
          </FoldableText>
        ))}
      </CardBody>
    </Card>
  )
}
