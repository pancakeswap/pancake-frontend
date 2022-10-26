import React from 'react'
import { Text, CardHeader } from '@pancakeswap/uikit'

export interface TableHeaderProps {
  title: string
}

const TableHeader: React.FC<React.PropsWithChildren<TableHeaderProps>> = ({ title }) => {
  return (
    <CardHeader>
      <Text fontSize="20px" bold>
        {title}
      </Text>
    </CardHeader>
  )
}

export default TableHeader
