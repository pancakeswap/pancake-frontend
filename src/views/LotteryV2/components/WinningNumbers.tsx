import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import { parseRetreivedNumber } from '../helpers'
import { BallWithNumber } from '../svgs'

const WinningNumbers: React.FC<{ number: string }> = ({ number }) => {
  const reversedNumber = parseRetreivedNumber(number)
  const numAsArray = reversedNumber.split('')

  return (
    <Flex justifyContent="space-between">
      <BallWithNumber color="pink" number={numAsArray[0]} />
      <BallWithNumber color="lilac" number={numAsArray[1]} />
      <BallWithNumber color="teal" number={numAsArray[2]} />
      <BallWithNumber color="aqua" number={numAsArray[3]} />
      <BallWithNumber color="green" number={numAsArray[4]} />
      <BallWithNumber color="yellow" number={numAsArray[5]} />
    </Flex>
  )
}

export default WinningNumbers
