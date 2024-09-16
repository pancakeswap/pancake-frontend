import { isNativeIfoSupported, PROFILE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, ProfileAvatar, Text, useModalV2 } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

import { isTestnetChainId } from '@pancakeswap/chains'
import { useChainNames } from '../../../hooks/useChainNames'
import { ContentText, LinkTitle, WarningTips } from '../../WarningTips'
import { NetworkSwitcherModal } from './NetworkSwitcherModal'

type Props = {
  saleFinished?: boolean
}

export function ActivateProfileButton({ saleFinished }: Props) {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const profileSupported = useMemo(() => isNativeIfoSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()

  const supportedChainIds = useMemo(
    () => PROFILE_SUPPORTED_CHAIN_IDS.filter((profileChainId) => !isTestnetChainId(profileChainId)),
    [],
  )

  const chainNames = useChainNames(supportedChainIds)
  const to = useMemo(() => '/create-profile', [])

  // FIXME: not sure why push got canceled after network switching. Need further investigation
  // It's a temp fix
  const goToProfilePage = useCallback(() => window.setTimeout(() => router.push(to), 0), [router, to])

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <ProfileAvatar width={40} height={40} src="https://via.placeholder.com" />
      <Text mt="0.625rem">{t('Pancakeswap profile is needed for IFO public sale eligibility.')}</Text>
    </Flex>
  )

  const button = profileSupported ? (
    <Button as={NextLinkFromReactRouter} to={to} width="100%">
      {t('Activate your Profile')}
    </Button>
  ) : (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={supportedChainIds}
        title={t('Create Profile')}
        description={t('Create your Pancake Profile on %chain%', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to create profile')}
        onSwitchNetworkSuccess={goToProfilePage}
        onDismiss={onDismiss}
        tips={tips}
      />
      <Button width="100%" onClick={onOpen}>
        {t('Activate your Profile')}
      </Button>
    </>
  )

  return (
    <WarningTips
      action={button}
      title={<LinkTitle href="/ifo#ifo-how-to">{t('How to Take Part')} »</LinkTitle>}
      content={
        <ContentText>
          {saleFinished
            ? t('Activate PancakeSwap Profile to take part in next IFO.')
            : t('You need to create a profile to participate in the IFO.')}
        </ContentText>
      }
    />
  )
}
