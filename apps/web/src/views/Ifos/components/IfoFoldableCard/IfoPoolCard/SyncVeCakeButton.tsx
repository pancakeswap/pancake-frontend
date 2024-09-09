import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Button, Loading, useModalV2 } from '@pancakeswap/uikit'
import { useCallback, useMemo, useState } from 'react'
import { SpaceProps } from 'styled-system'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

// import { useChainNames } from '../../../hooks/useChainNames'
import { IfoChainId } from '@pancakeswap/widgets-internal/ifo/constants'
import { CrossChainVeCakeModal } from 'components/CrossChainVeCakeModal'
import { useIfoSourceChain } from '../../../hooks/useIfoSourceChain'

type Props = {
  ifoChainId: ChainId

  buttonVisible?: boolean
} & SpaceProps

export function SyncVeCakeButton({ ifoChainId, buttonVisible = true, ...props }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const sourceChain = useIfoSourceChain(ifoChainId)
  const { onDismiss, isOpen, setIsOpen } = useModalV2()
  const { switchNetworkAsync } = useSwitchNetwork()

  const [isSwitching, setIsSwitching] = useState(false)

  const isCurrentChainSourceChain = useMemo(() => chainId === sourceChain, [chainId, sourceChain])
  const switchToSourceChain = useCallback(
    () => sourceChain && !isCurrentChainSourceChain && switchNetworkAsync(sourceChain),
    [sourceChain, switchNetworkAsync, isCurrentChainSourceChain],
  )

  const onSyncClick = useCallback(async () => {
    if (isCurrentChainSourceChain) {
      setIsOpen(true)
      return
    }

    try {
      setIsSwitching(true)
      await switchToSourceChain()
    } catch (e) {
      console.error(e)
    } finally {
      setIsSwitching(false)
    }
  }, [isCurrentChainSourceChain, switchToSourceChain, setIsOpen])

  return (
    <>
      <CrossChainVeCakeModal
        isOpen={isOpen}
        onDismiss={onDismiss}
        setIsOpen={setIsOpen}
        targetChainId={ifoChainId as Exclude<IfoChainId, ChainId.BSC>}
      />

      {buttonVisible && (
        <Button width="100%" id="sync-vecake" disabled={isSwitching} onClick={onSyncClick} {...props}>
          {isCurrentChainSourceChain ? t('Sync veCAKE') : t('Switch chain to Sync')}
          {isSwitching && <Loading width="1rem" height="1rem" ml="0.5rem" />}
        </Button>
      )}
    </>
  )
}
