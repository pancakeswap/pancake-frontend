import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userUseStableSwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useStableSwap', true)
const userUseV2SwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useV2Swap', true)
const userUseV3SwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useV3Swap', true)

export function useUserStableSwapEnable() {
  return useAtom(userUseStableSwapAtom)
}

export function useUserV2SwapEnable() {
  return useAtom(userUseV2SwapAtom)
}

export function useUserV3SwapEnable() {
  return useAtom(userUseV3SwapAtom)
}
