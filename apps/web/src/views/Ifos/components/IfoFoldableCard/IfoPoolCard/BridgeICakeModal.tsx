import { Button, Modal, ModalV2, ModalBody, ModalV2Props, Text, Flex, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { useCallback } from 'react'
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

import { useChainName } from '../../../hooks/useChainNames'
import { BridgeState, BRIDGE_STATE, useBridgeMessageUrl, useBridgeSuccessTxUrl } from '../../../hooks/useBridgeICake'

type Props = {
  // iCAKE on source chain to bridge
  icake?: CurrencyAmount<Currency>

  sourceChainId?: ChainId
  ifoChainId?: ChainId

  state: BridgeState

  onBridge?: (icake?: CurrencyAmount<Currency>) => void
} & ModalV2Props

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 514px;
  }
`

const BodyTextMain = styled(Text).attrs({
  fontSize: '0.875rem',
})``

const BodyText = styled(Text).attrs({
  fontSize: '0.875rem',
  color: 'textSubtle',
})``

const MessageLink = styled(LinkExternal).attrs({
  external: true,
  bold: true,
})``

export function BridgeICakeModal({ icake, sourceChainId, ifoChainId, state, onBridge, ...rest }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { switchNetworkAsync } = useSwitchNetwork()
  const isCurrentChainSourceChain = chainId === sourceChainId
  const switchToSourceChain = useCallback(
    () => sourceChainId && !isCurrentChainSourceChain && switchNetworkAsync(sourceChainId),
    [sourceChainId, switchNetworkAsync, isCurrentChainSourceChain],
  )

  const onBridgeClick = useCallback(async () => {
    if (isCurrentChainSourceChain) {
      onBridge?.(icake)
      return
    }
    try {
      await switchToSourceChain()
    } catch (e) {
      console.error(e)
    }
  }, [icake, isCurrentChainSourceChain, switchToSourceChain, onBridge])

  const renderModal = () => {
    switch (state.state) {
      case BRIDGE_STATE.INITIAL:
        return (
          <StyledModal title={t('Bridge iCAKE')}>
            <ModalBody>
              <BodyText>
                {t(
                  'To participate in the cross chain Public Sale, you need to bridge your iCAKE to the blockchain where the IFO will be hosted on.',
                )}
              </BodyText>
              <BodyText mt="1rem">
                {t(
                  'Before or during the sale, you may bridge you iCAKE again if you’ve added more CAKE or extended your lock staking position.',
                )}
              </BodyText>
              <Button mt="1.5rem" width="100%" onClick={onBridgeClick}>
                {isCurrentChainSourceChain ? t('Bridge iCAKE') : t('Switch Network to Bridge')}
              </Button>
            </ModalBody>
          </StyledModal>
        )
      case BRIDGE_STATE.PENDING_WALLET_SIGN:
      case BRIDGE_STATE.PENDING_SOURCE_CHAIN_TX:
      case BRIDGE_STATE.PENDING_CROSS_CHAIN_TX:
      case BRIDGE_STATE.FINISHED:
        return <BridgeStateModal icake={icake} state={state} sourceChainId={sourceChainId} ifoChainId={ifoChainId} />
      default:
        return null
    }
  }

  return <ModalV2 {...rest}>{renderModal()}</ModalV2>
}

const StyledStateModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 343px;
  }
`

const StateTitle = styled(Text).attrs({
  bold: true,
  fontSize: '1rem',
})``

type BridgeStateModalProps = {
  sourceChainId?: ChainId
  ifoChainId?: ChainId
  icake?: CurrencyAmount<Currency>
  state: BridgeState
}

export function BridgeStateModal({ state, icake, sourceChainId, ifoChainId }: BridgeStateModalProps) {
  const { t } = useTranslation()
  const sourceChainName = useChainName(sourceChainId)
  const ifoChainName = useChainName(ifoChainId)
  const messageUrl = useBridgeMessageUrl(state)
  const txUrl = useBridgeSuccessTxUrl(state)

  const isSuccess = state.state === BRIDGE_STATE.FINISHED
  const crossChainInfo = !isSuccess ? (
    <BodyTextMain mt="0.75rem">
      {t('From %sourceChainName% to %ifoChainName%', {
        sourceChainName,
        ifoChainName,
      })}
    </BodyTextMain>
  ) : null
  const title = isSuccess
    ? t('Transaction receipt')
    : t('Bridge %amount% iCAKE', {
        amount: icake?.toExact() || '',
      })

  const link =
    messageUrl && !isSuccess ? (
      <MessageLink href={messageUrl} mt="1rem">
        {t('Track in LayerZero Explorer')}
      </MessageLink>
    ) : null

  const txLink = txUrl ? (
    <MessageLink href={txUrl} mt="1rem" width="250px" ellipsis>
      {t('View on %ifoChainName% %tx%', {
        ifoChainName,
        tx: state.state === BRIDGE_STATE.FINISHED ? `${state.dstTxHash?.slice(0, 8)}...` || '' : '',
      })}
    </MessageLink>
  ) : null

  if (!icake || !sourceChainId || !ifoChainId) {
    return null
  }

  const renderTips = () => {
    switch (state.state) {
      case BRIDGE_STATE.PENDING_WALLET_SIGN:
        return <BodyText>{t('Proceed in your wallet')}</BodyText>
      case BRIDGE_STATE.PENDING_SOURCE_CHAIN_TX:
        return <BodyText>{t('Waiting for transaction to be confirmed')}</BodyText>
      case BRIDGE_STATE.PENDING_CROSS_CHAIN_TX:
        return (
          <>
            <BodyText>{t('Est. time: 2-5 minutes')}</BodyText>
            <BodyText>{t('Waiting for bridge to confirm')}</BodyText>
          </>
        )
      default:
        return null
    }
  }

  return (
    <StyledStateModal title={t('Bridge iCAKE')}>
      <ModalBody>
        <Flex flexDirection="column" justifyContent="flex-start" alignItems="center">
          <StateTitle>{title}</StateTitle>
          {crossChainInfo}
          {renderTips()}
          {link}
          {txLink}
        </Flex>
      </ModalBody>
    </StyledStateModal>
  )
}
