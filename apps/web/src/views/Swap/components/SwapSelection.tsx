import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SwapType } from '../types'
import { isTwapSupported } from '../utils'

export const SwapSelection = ({ swapType }: { swapType: SwapType }) => {
  const router = useRouter()

  const onSelect = useCallback(
    (value: SwapType) => {
      let url = ''
      switch (value) {
        case SwapType.LIMIT:
          url = '/swap/limit'
          break
        case SwapType.TWAP:
          url = '/swap/twap'
          break
        case SwapType.MARKET:
          url = '/swap'
          break
        default:
          break
      }
      router.push(url)
    },
    [router],
  )

  const { chainId } = useActiveChainId()
  if (!isTwapSupported(chainId)) return null
  return (
    <ButtonMenu
      mb={3}
      scale="sm"
      fullWidth
      activeIndex={swapType}
      onItemClick={(index) => onSelect(index)}
      variant="subtle"
    >
      <ButtonMenuItem>MARKET</ButtonMenuItem>
      <ButtonMenuItem>TWAP</ButtonMenuItem>
      <ButtonMenuItem>LIMIT</ButtonMenuItem>
    </ButtonMenu>
  )
}
