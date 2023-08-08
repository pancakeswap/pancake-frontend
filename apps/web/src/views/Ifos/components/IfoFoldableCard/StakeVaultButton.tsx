import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button, useModalV2 } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { isCakeVaultSupported, CAKE_VAULT_SUPPORTED_CHAINS } from '@pancakeswap/pools'

import { useConfig } from 'views/Ifos/contexts/IfoContext'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { NetworkSwitcherModal } from './IfoPoolCard/NetworkSwitcherModal'
import { useChainNames } from '../../hooks/useChainNames'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useConfig()
  const isFinishedPage = router.pathname.includes('history')
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])
  const chainNames = useChainNames(CAKE_VAULT_SUPPORTED_CHAINS)
  const { onOpen, onDismiss, isOpen } = useModalV2()

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  const handleClickButton = useCallback(() => {
    if (!cakeVaultSupported) {
      onOpen()
      return
    }

    // Always expand for mobile
    if (!isExpanded) {
      setIsExpanded(true)
    }

    if (isFinishedPage) {
      router.push('/ifo')
    } else {
      scrollToTop()
    }
  }, [cakeVaultSupported, onOpen, isExpanded, isFinishedPage, router, scrollToTop, setIsExpanded])

  return (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={CAKE_VAULT_SUPPORTED_CHAINS}
        title={t('Lock CAKE')}
        description={t('Lock CAKE on %chain% to obtain iCAKE', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to stake CAKE')}
        onDismiss={onDismiss}
      />
      <Button {...props} onClick={handleClickButton}>
        {t('Go to CAKE pool')}
      </Button>
    </>
  )
}

export default StakeVaultButton
