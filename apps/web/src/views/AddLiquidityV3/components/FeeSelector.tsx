import { ButtonMenu, Box, ButtonMenuItem } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import _toNumber from 'lodash/toNumber'

const feeArrays = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH]

export default function FeeSelector({ handleFeePoolSelect, feeAmount }) {
  const selectedIndex = feeArrays.findIndex((fee) => fee === _toNumber(feeAmount))

  return (
    <Box width="100%" mb="24px">
      <ButtonMenu
        fullWidth
        activeIndex={selectedIndex}
        onItemClick={(index) => handleFeePoolSelect(feeArrays[index])}
        scale="sm"
      >
        {feeArrays.map((fee) => (
          <ButtonMenuItem key={fee}>{fee}</ButtonMenuItem>
        ))}
      </ButtonMenu>
    </Box>
  )
}
