import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { zksyncTokens } from '@pancakeswap/tokens'
import {
  AtomBox,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalV2,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ASSET_CDN } from 'config/constants/endpoints'
import { paymasterInfo, paymasterTokens } from 'config/paymaster'
import { useGasSponsorshipBalance } from 'hooks/useGasSponsorshipBalance'
import { useGasToken } from 'hooks/useGasToken'
import { usePaymaster } from 'hooks/usePaymaster'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useZksyncAirDropAutoPopup } from 'hooks/useZksyncAirDropAutoPopup'
import { useEffect, useMemo } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { useClaimZksyncAirdrop, useUserWhiteListData, useZksyncAirDropData } from './hooks'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`

const Badge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  margin-top: 4px;
  user-select: none;
  width: fit-content;
  border-radius: ${({ theme }) => theme.radii['32px']};
  color: ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.success};
`

const asset = `${ASSET_CDN}/web/banners/zksync-airdrop-banner/modal.png`

export const ClaimZksyncAirdropModal: React.FC<{
  onDismiss?: () => void
  isOpen?: boolean
}> = ({ onDismiss, isOpen }) => {
  const { switchNetwork } = useSwitchNetwork()
  const { isDesktop } = useMatchBreakpoints()
  const { t } = useTranslation()
  const whiteListData = useUserWhiteListData(isOpen ?? false)

  const { address: account, chainId } = useAccount()

  const { isPaymasterAvailable, isPaymasterTokenActive } = usePaymaster()
  const [, setGasToken] = useGasToken()
  const {
    data: { isEnoughGasBalance },
  } = useGasSponsorshipBalance({ enabled: isPaymasterAvailable && isPaymasterTokenActive })

  const {
    targetRef: tooltipTargetRef,
    tooltip,
    tooltipVisible,
  } = useTooltip(
    <>
      {t('Gas fees is fully sponsored')}
      <br />
      <span style={{ fontSize: '14px' }}>{t('Powered by Zyfi Paymaster')}</span>
    </>,
  )
  const { zksyncAirdropData, refetch } = useZksyncAirDropData(whiteListData?.proof)
  const { claimAirDrop, pendingTx } = useClaimZksyncAirdrop(isOpen, refetch)
  const userCanClaim = useMemo(() => {
    return zksyncAirdropData?.claimedAmount === 0n && (whiteListData?.amount ?? 0n) > 0n
  }, [whiteListData?.amount, zksyncAirdropData?.claimedAmount])
  const isUserClaimed = useMemo(
    () =>
      (zksyncAirdropData?.claimedAmount === whiteListData?.amount && (whiteListData?.amount ?? 0n) > 0n) ||
      (zksyncAirdropData?.claimedAmount ?? 0n) > 0n,
    [whiteListData?.amount, zksyncAirdropData?.claimedAmount],
  )

  useEffect(() => {
    // Set default gas token to USDC (full sponsorship)
    if (isPaymasterAvailable && paymasterInfo[paymasterTokens[4].wrapped.address].discount === 'FREE')
      setGasToken(paymasterTokens[4])
  }, [isPaymasterAvailable, setGasToken])

  return (
    <ModalV2
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss?.()
      }}
      closeOnOverlayClick
    >
      <ModalContainer style={{ minWidth: '360px', padding: isDesktop ? '24px' : '24px 24px 0 24px' }}>
        <AtomBox justifyContent="space-between" p="24px" maxWidth="420px" height="100%" style={{ margin: '-24px' }}>
          <StyledModalHeader headerBorderColor="transparent">
            <ModalTitle>
              <Flex flexDirection="column">
                <Heading scale="md">{t('AirDrop Claiming')}</Heading>
              </Flex>
            </ModalTitle>
            <ModalCloseButton onDismiss={onDismiss} />
          </StyledModalHeader>
          <ModalBody minHeight={350}>
            <Box
              width="100%"
              height="200px"
              mb="24px"
              style={{ backgroundImage: `url(${asset})`, backgroundSize: 'cover' }}
            />

            <Text bold>
              {isUserClaimed
                ? t('%amount% %token% claimed!', {
                    amount: formatNumber(getBalanceNumber(new BN(zksyncAirdropData?.claimedAmount?.toString() ?? 0))),
                    token: zksyncTokens.zk.symbol,
                  })
                : userCanClaim
                ? t('%amount% %token% available to claim!', {
                    amount: formatNumber(getBalanceNumber(new BN(whiteListData?.amount?.toString() ?? 0))),
                    token: zksyncTokens.zk.symbol,
                  })
                : t('Not eligible')}
            </Text>
            {userCanClaim && isPaymasterAvailable && isPaymasterTokenActive && isEnoughGasBalance && (
              <>
                <Badge ref={tooltipTargetRef}>⛽️ {t('GAS FREE')}</Badge>
                {tooltipVisible && tooltip}
              </>
            )}
            <Text mt="16px" mb="8px">
              {isUserClaimed
                ? t('You have successfully claimed from the ZKsync token airdrop campaign!')
                : userCanClaim
                ? t('Congratulations! You are eligible to claim from the ZKsync token airdrop campaign!')
                : t('Unfortunately, the connected wallet %account% is not eligible for the airdrop campaign.', {
                    account: account ?? '',
                  })}
            </Text>
            <Link href="https://blog.pancakeswap.finance/articles/pancake-swap-airdrops-2-4-million-zk-tokens-to-the-community">
              {t('Learn more about the campaign')}
            </Link>
            {account ? (
              chainId === ChainId.ZKSYNC ? (
                <Button
                  variant={isUserClaimed ? 'secondary' : undefined}
                  mt="24px"
                  isLoading={pendingTx}
                  disabled={isUserClaimed ? false : !userCanClaim}
                  onClick={isUserClaimed ? onDismiss : claimAirDrop}
                >
                  {pendingTx ? t('Claiming') : isUserClaimed ? t('Close') : t('Claim now')}
                </Button>
              ) : (
                <Button mt="24px" disabled={!userCanClaim} onClick={() => switchNetwork(ChainId.ZKSYNC)}>
                  {userCanClaim ? t('Switch network to ZKsync for claiming') : t('Claim now')}
                </Button>
              )
            ) : (
              <ConnectWalletButton mt="24px" />
            )}
          </ModalBody>
        </AtomBox>
      </ModalContainer>
    </ModalV2>
  )
}

export const ZKSyncAirdropModalWithAutoPopup: React.FC = () => {
  const { isOpen, onDismiss } = useZksyncAirDropAutoPopup()
  return <ClaimZksyncAirdropModal isOpen={isOpen} onDismiss={onDismiss} />
}
