import { Box, BoxProps, Card, CardBody, CardHeader, Heading, Text } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import FoldableText from './FoldableText'

interface Props extends BoxProps {
  header: string
  config: { title: string; description: ReactNode[] }[]
}

const SectionsWithFoldableText: React.FC<React.PropsWithChildren<Props>> = ({ header, config, ...props }) => {
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
            <FoldableText key={title} id={title} mb={i + 1 === length ? '' : '24px'} title={title}>
              {description.map((desc, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Text key={index} color="textSubtle" as="p">
                    {desc}
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
