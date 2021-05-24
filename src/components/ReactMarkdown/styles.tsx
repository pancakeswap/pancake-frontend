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

const Title = (props) => {
  return <Heading as="h4" scale="lg" mb="16px" {...props} />
}

const markdownComponents: Partial<NormalComponents & SpecialComponents> = {
  h1: Title,
  h2: Title,
  h3: Title,
  h4: Title,
  h5: Title,
  h6: Title,
  p: (props) => {
    return <Text as="p" {...props} />
  },
  table: Table,
}

export default markdownComponents
