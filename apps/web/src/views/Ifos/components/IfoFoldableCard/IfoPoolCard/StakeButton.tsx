import { useTranslation } from '@pancakeswap/localization'
import { CAKE_VAULT_SUPPORTED_CHAINS, isCakeVaultSupported } from '@pancakeswap/pools'
import { Button, Flex, Text, useModalV2 } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import { SpaceProps } from 'styled-system'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { isTestnetChainId } from '@pancakeswap/chains'
import { useRouter } from 'next/router'
import { useChainNames } from '../../../hooks/useChainNames'
import { ICakeLogo } from '../../Icons'
import { NetworkSwitcherModal } from './NetworkSwitcherModal'

interface StakeButtonProps extends SpaceProps {}

export function StakeButton(props: StakeButtonProps) {
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()

  const supportedChainIds = useMemo(
    () => CAKE_VAULT_SUPPORTED_CHAINS.filter((vaultChainId) => !isTestnetChainId(vaultChainId)),
    [],
  )
  const chainNames = useChainNames(supportedChainIds)

  const goToCakeStakingPage = useCallback(() => router.push('/cake-staking'), [router])

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <ICakeLogo />
      <Text mt="0.625rem">{t('Stake CAKE to obtain iCAKE - in order to be eligible in this public sale.')}</Text>
    </Flex>
  )

  return !cakeVaultSupported ? (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={supportedChainIds}
        title={t('Stake CAKE')}
        description={t('Lock CAKE on %chain% to obtain iCAKE', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to stake CAKE')}
        tips={tips}
        onDismiss={onDismiss}
        onSwitchNetworkSuccess={goToCakeStakingPage}
      />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Stake CAKE')}
      </Button>
    </>
  ) : null
}
