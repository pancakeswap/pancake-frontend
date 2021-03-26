import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, CardHeader, Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import FAQItem from './FAQItem'

const Wrapper = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
  }
`

const StyledCardbody = styled(CardBody)`
  div:first-child {
    margin-top: 0px;
  }
`

const FAQ = () => {
  return (
    <Wrapper>
      <Card mt="16px">
        <CardHeader>
          <Heading size="lg">Details</Heading>
        </CardHeader>
        <StyledCardbody>
          <FAQItem question="Here's a question for you">
            <Text fontSize="14px" color="textSubtle">
              Response to open question goes here. Here is text answering the question which is open. Response to open
              question goes here. Here is text answering the question which is open.
            </Text>
          </FAQItem>
          <FAQItem question="Here's a question for you">
            <Text fontSize="14px" color="textSubtle">
              Response to open question goes here. Here is text answering the question which is open. Response to open
              question goes here. Here is text answering the question which is open.
            </Text>
          </FAQItem>
          <FAQItem question="Here's a question for you">
            <Text fontSize="14px" color="textSubtle">
              Response to open question goes here. Here is text answering the question which is open. Response to open
              question goes here. Here is text answering the question which is open.
            </Text>
          </FAQItem>
        </StyledCardbody>
      </Card>
    </Wrapper>
  )
}

export default FAQ
