import { useUserWhiteListData, useZksyncAirDropData } from 'components/ClaimZksyncAirdropModal/hooks'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'

const zksyncAutoPopup = atomWithStorage<{ [account: string]: boolean }>(
  'pcs:zksync-airdrop-auto-popup-v2',
  {},
  undefined,
  { unstable_getOnInit: true },
)

const useAutoPopup = (): [boolean, (value: boolean) => void] => {
  const { address } = useAccount()
  const [autoPopup, setAutoPopup] = useAtom(zksyncAutoPopup)

  const setPopupState = useCallback(
    (value: boolean) => {
      if (!address) return
      setAutoPopup((prev) => ({
        ...prev,
        [address]: value,
      }))
    },
    [address, setAutoPopup],
  )

  return [address ? autoPopup[address] ?? true : false, setPopupState]
}

export const useZksyncAirDropAutoPopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [autoPopup, setAutoPopup] = useAutoPopup()
  const whitelistData = useUserWhiteListData(autoPopup || isOpen)
  const { zksyncAirdropData } = useZksyncAirDropData(whitelistData?.proof)
  const isModalOpened = useRef(false)
  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])
  const onDismiss = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (whitelistData?.account) {
      if (!whitelistData?.amount && !whitelistData?.proof) {
        setAutoPopup(false)
      } else if (
        whitelistData?.amount &&
        whitelistData?.proof &&
        isModalOpened.current === false &&
        autoPopup &&
        zksyncAirdropData?.claimedAmount === 0n
      ) {
        setIsOpen(true)
        isModalOpened.current = true
        setAutoPopup(false)
      }
    }
  }, [whitelistData, zksyncAirdropData, autoPopup, setAutoPopup])
  return { isOpen, onOpen, onDismiss }
}
