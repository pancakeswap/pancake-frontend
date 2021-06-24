import React from 'react'
import { Heading, Text } from '@pancakeswap/uikit'
import { NormalComponents, SpecialComponents } from 'react-markdown/src/ast-to-react'
import styled from 'styled-components'

const Table = styled.table`
  margin-bottom: 32px;
  margin-top: 32px;
  width: 100%;

  td,
  th {
    padding: 8px;
  }
`

const ThemedComponent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  margin-top: 16px;

  li {
    margin-bottom: 8px;
  }
`

const Pre = styled.pre`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  margin-top: 16px;
  max-width: 100%;
  overflow-x: auto;
`

const Title = (props) => {
  return <Heading as="h4" scale="lg" my="16px" {...props} />
}

const markdownComponents: Partial<NormalComponents & SpecialComponents> = {
  h1: Title,
  h2: Title,
  h3: Title,
  h4: Title,
  h5: Title,
  h6: Title,
  p: (props) => {
    return <Text as="p" my="16px" {...props} />
  },
  table: Table,
  ol: (props) => {
    return <ThemedComponent as="ol" {...props} />
  },
  ul: (props) => {
    return <ThemedComponent as="ul" {...props} />
  },
  pre: Pre,
}

export default markdownComponents
