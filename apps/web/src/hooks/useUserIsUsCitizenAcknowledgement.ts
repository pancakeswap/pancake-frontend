import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
  AFFILIATE_PROGRAM = 'affiliate-program',
}

type UsCitizenAcknowledgementList = Record<IdType, Record<'hide', null | boolean>>

const defaultList: UsCitizenAcknowledgementList = {
  [IdType.IFO]: {
    hide: false,
  },
  [IdType.PERPETUALS]: {
    hide: false,
  },
  [IdType.AFFILIATE_PROGRAM]: {
    hide: false,
  },
}

const userNotUsCitizenAcknowledgementAtom = atomWithStorage('pcs:NotUsCitizenAcknowledgement-v2', defaultList)

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  const [lists, setLists] = useAtom(userNotUsCitizenAcknowledgementAtom)

  const hideModal = useMemo(() => lists[id].hide, [id, lists])

  const handleClose = () => {
    setLists({
      ...lists,
      [id]: {
        hide: true,
      },
    })
  }

  return {
    hideModal,
    handleClose,
  }
}
