import React from 'react'
import { ChevronDownIcon, Button } from '@pancakeswap-libs/uikit'

const Details: React.FunctionComponent = () => {
  return (
    <Button variant="text" size="sm">
      Details
      <ChevronDownIcon color="primary" />
    </Button>
  )
}

export default Details