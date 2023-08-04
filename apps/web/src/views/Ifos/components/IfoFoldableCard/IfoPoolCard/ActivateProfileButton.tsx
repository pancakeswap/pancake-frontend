import { useTranslation } from '@pancakeswap/localization'
import { isNativeIfoSupported, PROFILE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/ifos'
import { useAccount } from 'wagmi'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Button, NextLinkFromReactRouter, useModalV2 } from '@pancakeswap/uikit'
import { NetworkSwitcherModal } from './NetworkSwitcherModal'
import { useChainNames } from '../../../hooks/useChainNames'

export function ActivateProfileButton() {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const profileSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const chainNames = useChainNames(PROFILE_SUPPORTED_CHAIN_IDS)
  const to = useMemo(() => `/profile/${account?.toLowerCase() || ''}`, [account])

  // FIXME: not sure why push got canceled after network switching. Need further investigation
  // It's a temp fix
  const goToProfilePage = useCallback(() => window.setTimeout(() => router.push(to), 0), [router, to])

  const button = profileSupported ? (
    <Button as={NextLinkFromReactRouter} to={to} width="100%">
      {t('Activate your Profile')}
    </Button>
  ) : (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={PROFILE_SUPPORTED_CHAIN_IDS}
        title={t('Create Profile')}
        description={t('Create your Pancake Profile on %chain%', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to create profile')}
        onSwitchNetworkSuccess={goToProfilePage}
        onDismiss={onDismiss}
      />
      <Button width="100%" onClick={onOpen}>
        {t('Activate your Profile')}
      </Button>
    </>
  )

  return button
}
