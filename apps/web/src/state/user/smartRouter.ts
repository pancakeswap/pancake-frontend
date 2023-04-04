import { atom, useAtom, useAtomValue } from 'jotai'
import { userSingleHopAtom } from '@pancakeswap/utils/user'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userUseStableSwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useStableSwap', true)
const userUseV2SwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useV2Swap', true)
const userUseV3SwapAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useV3Swap', true)
const userUserSplitRouteAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useSplitRouting', true)

export function useUserStableSwapEnable() {
  return useAtom(userUseStableSwapAtom)
}

export function useUserV2SwapEnable() {
  return useAtom(userUseV2SwapAtom)
}

export function useUserV3SwapEnable() {
  return useAtom(userUseV3SwapAtom)
}

export function useUserSplitRouteEnable() {
  return useAtom(userUserSplitRouteAtom)
}

const derivedOnlyOneAMMSourceEnabledAtom = atom((get) => {
  return [get(userUseStableSwapAtom), get(userUseV2SwapAtom), get(userUseV3SwapAtom)].filter(Boolean).length === 1
})

export function useOnlyOneAMMSourceEnabled() {
  return useAtomValue(derivedOnlyOneAMMSourceEnabledAtom)
}

const derivedRoutingSettingChangedAtom = atom(
  (get) => {
    return [
      get(userUseStableSwapAtom),
      get(userUseV2SwapAtom),
      get(userUseV3SwapAtom),
      get(userUserSplitRouteAtom),
      !get(userSingleHopAtom),
    ].some((x) => x === false)
  },
  (_, set) => {
    set(userUseStableSwapAtom, true)
    set(userUseV2SwapAtom, true)
    set(userUseV3SwapAtom, true)
    set(userUserSplitRouteAtom, true)
    set(userSingleHopAtom, false)
  },
)

export function useRoutingSettingChanged() {
  return useAtom(derivedRoutingSettingChangedAtom)
}
