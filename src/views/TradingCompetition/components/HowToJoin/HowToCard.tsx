import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody } from '@tovaswapui/uikit'

interface HowToCardProps {
  number?: number
  title?: string
}

const Inner = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
`

const NumberWrapper = styled.div`
  grid-column: span 1;
  grid-row: span 2;
`

const TitleWrapper = styled.div`
  grid-column: 2 / 2;
  grid-row: 1 / 2;
`

const ChildrenWrapper = styled.div`
  grid-column: 2 / 2;
  grid-row: 2 / 2;
`

const HowToJoin: React.FC<HowToCardProps> = ({ number, title, children }) => {
  return (
    <Card mb="16px">
      <CardBody>
        <Inner>
          <NumberWrapper>
            <Heading color="textSubtle">{number}</Heading>
          </NumberWrapper>
          <TitleWrapper>
            <Heading color="secondary">{title}</Heading>
          </TitleWrapper>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Inner>
      </CardBody>
    </Card>
  )
}

export default HowToJoin
