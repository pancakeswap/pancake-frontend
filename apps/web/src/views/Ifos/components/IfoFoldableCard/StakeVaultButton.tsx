import { useTranslation } from '@pancakeswap/localization'
import { CAKE_VAULT_SUPPORTED_CHAINS, isCakeVaultSupported } from '@pancakeswap/pools'
import { Button, Flex, Text, useModalV2 } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useConfig } from 'views/Ifos/contexts/IfoContext'

import { isTestnetChainId } from '@pancakeswap/chains'
import { useChainNames } from '../../hooks/useChainNames'
import { ICakeLogo } from '../Icons'
import { NetworkSwitcherModal } from './IfoPoolCard/NetworkSwitcherModal'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useConfig() as any
  const isFinishedPage = router.pathname.includes('history')
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])

  const supportedChainIds = useMemo(
    () => CAKE_VAULT_SUPPORTED_CHAINS.filter((vaultChainId) => !isTestnetChainId(vaultChainId)),
    [],
  )
  const cakeVaultChainNames = useChainNames(supportedChainIds)

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

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <ICakeLogo />
      <Text mt="0.625rem">{t('Stake CAKE to obtain iCAKE - in order to be eligible in the next IFO.')}</Text>
    </Flex>
  )

  return (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={supportedChainIds}
        title={t('Lock CAKE')}
        description={t('Lock CAKE on %chain% to obtain iCAKE', {
          chain: cakeVaultChainNames,
        })}
        buttonText={t('Switch chain to stake CAKE')}
        onDismiss={onDismiss}
        tips={tips}
      />
      <Button {...props} onClick={handleClickButton}>
        {t('Go to CAKE pool')}
      </Button>
    </>
  )
}

export default StakeVaultButton
