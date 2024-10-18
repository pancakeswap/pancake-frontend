import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'

export function useUserAcknowledgement(id: string) {
  const { address } = useAccount()
  const atom = useMemo(
    () => atomWithStorage(`pcs_user_ack_${id}_${address}`, false, undefined, { unstable_getOnInit: true }),
    [id, address],
  )
  const [userACK, setUserACK] = useAtom(atom)

  const ack = useMemo(() => address && userACK, [address, userACK])
  const setAck = useCallback((value: boolean) => address && setUserACK(value), [address, setUserACK])

  return [ack, setAck] as const
}
