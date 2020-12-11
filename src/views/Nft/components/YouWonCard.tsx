import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import CardContent from './CardContent'

const YouWonCard = () => {
  const TranslateString = useI18n()

  return (
    <Card isActive>
      <CardBody>
        <CardContent imgSrc="/images/present.svg">
          <Heading mb="8px">{TranslateString(999, 'You won!')}</Heading>
          <Text>{TranslateString(999, 'Claim an NFT from the options below!')}</Text>
        </CardContent>
      </CardBody>
    </Card>
  )
}

export default YouWonCard
