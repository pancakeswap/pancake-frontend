import { useTranslation } from '@pancakeswap/localization'
import { isCakeVaultSupported, CAKE_VAULT_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import { SpaceProps } from 'styled-system'
import { useMemo } from 'react'
import { Button, useModalV2, Flex, Text } from '@pancakeswap/uikit'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { NetworkSwitcherModal } from './NetworkSwitcherModal'
import { useChainNames } from '../../../hooks/useChainNames'
import { ICakeLogo } from '../../Icons'

type Props = SpaceProps

export function StakeButton(props: Props) {
  const { chainId } = useActiveChainId()
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const chainNames = useChainNames(CAKE_VAULT_SUPPORTED_CHAINS)

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
        supportedChains={CAKE_VAULT_SUPPORTED_CHAINS}
        title={t('Stake CAKE')}
        description={t('Lock CAKE on %chain% to obtain iCAKE', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to stake CAKE')}
        onDismiss={onDismiss}
        tips={tips}
      />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Stake CAKE')}
      </Button>
    </>
  ) : null
}
