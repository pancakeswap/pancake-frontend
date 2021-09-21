import React from 'react'
import { Text, Heading, Card, CardHeader, CardBody, Box, BoxProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from './FoldableText'

interface Props extends BoxProps {
  header: string
  config: { title: string; description: string[] }[]
}

const SectionsWithFoldableText: React.FC<Props> = ({ header, config, ...props }) => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="888px" {...props}>
      <Card>
        <CardHeader>
          <Heading scale="lg" color="secondary">
            {header}
          </Heading>
        </CardHeader>
        <CardBody>
          {config.map(({ title, description }, i, { length }) => (
            <FoldableText key={title} id={title} mb={i + 1 === length ? '' : '24px'} title={t(title)}>
              {description.map((desc) => {
                return (
                  <Text key={desc} color="textSubtle" as="p">
                    {t(desc)}
                  </Text>
                )
              })}
            </FoldableText>
          ))}
        </CardBody>
      </Card>
    </Box>
  )
}

export default SectionsWithFoldableText
