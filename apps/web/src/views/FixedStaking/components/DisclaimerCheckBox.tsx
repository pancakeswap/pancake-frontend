import { Checkbox, Flex, Link, Text } from '@pancakeswap/uikit'
import { Dispatch, SetStateAction } from 'react'

export function DisclaimerCheckBox({
  check,
  setCheck,
}: {
  check: boolean
  setCheck: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Flex alignItems="center" mb="16px">
      <div style={{ flex: 'none', alignSelf: 'flex-start' }}>
        <Checkbox scale="sm" checked={check} onChange={() => setCheck((prev) => !prev)} />
      </div>
      <Text fontSize="14px" ml="8px">
        By checking this box, I understand that my funds will be custodied by Binance Earn. <br />
        For more information please read{' '}
        <Link
          style={{
            display: 'inline',
            fontSize: '14px',
          }}
          href="https://docs.pancakeswap.finance/products/simple-staking/terms-and-conditions"
          external
        >
          the Terms & Conditions.
        </Link>
      </Text>
    </Flex>
  )
}
