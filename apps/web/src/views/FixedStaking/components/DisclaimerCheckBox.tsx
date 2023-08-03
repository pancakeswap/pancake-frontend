import { Checkbox, Flex, Link, Text } from '@pancakeswap/uikit'
import { useState } from 'react'

export function DisclaimerCheckBox() {
  const [check, setCheck] = useState(false)

  return (
    <Flex alignItems="center" mb="16px">
      <div style={{ flex: 'none', alignSelf: 'flex-start' }}>
        <Checkbox scale="sm" checked={check} onChange={() => setCheck((prev) => !prev)} />
      </div>
      <Text fontSize="14px" ml="8px">
        Disclaimer here if needed e.g. Binance Earn is the custodial solution for this product.{' '}
        <Link
          style={{
            display: 'inline',
            fontSize: '14px',
          }}
          href="/"
          target="_blank"
        >
          Link of service agreement if needed.
        </Link>
      </Text>
    </Flex>
  )
}
