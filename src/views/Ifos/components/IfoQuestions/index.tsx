import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableText'
import config from './config'

const ImageWrapper = styled.div`
  flex: none;
  order: 2;
  width: 224px;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`

const DetailsWrapper = styled.div`
  order: 1;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    margin-bottom: 0;
    margin-left: 40px;
  }
`

const IfoQuestions = () => {
  const { t } = useTranslation()

  return (
    <Flex alignItems={['center', null, null, 'start']} flexDirection={['column', null, null, 'row']}>
      <ImageWrapper>
        <img src="/images/ifo-bunny.png" alt="ifo bunny" width="224px" height="208px" />
      </ImageWrapper>
      <DetailsWrapper>
        <Card>
          <CardHeader>
            <Heading size="lg" color="secondary">
              {t('Details')}
            </Heading>
          </CardHeader>
          <CardBody>
            {config.map(({ title, description }) => (
              <FoldableText key={title.fallback} id={title.fallback} mb="24px" title={t(title.fallback)}>
                {description.map(({ fallback }) => {
                  return (
                    <Text key={fallback} color="textSubtle" as="p">
                      {t(fallback)}
                    </Text>
                  )
                })}
              </FoldableText>
            ))}
          </CardBody>
        </Card>
      </DetailsWrapper>
    </Flex>
  )
}

export default IfoQuestions
