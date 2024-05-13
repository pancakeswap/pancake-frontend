import { atom } from 'jotai'
import { Address } from 'viem'

export const feeTokenAddressAtom = atom<Address | null>(null)
