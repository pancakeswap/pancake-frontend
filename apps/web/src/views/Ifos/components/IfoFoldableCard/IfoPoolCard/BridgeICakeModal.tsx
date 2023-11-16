import {
  Button,
  Modal,
  ModalV2,
  ModalBody,
  ModalV2Props,
  Text,
  Flex,
  LinkExternal,
  Card,
  CardBody,
  Spinner,
  CheckmarkCircleIcon,
  LogoRoundIcon,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { formatAmount } from '@pancakeswap/utils/formatFractions'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { useChainName } from '../../../hooks/useChainNames'
import { BridgeState, BRIDGE_STATE, useBridgeMessageUrl, useBridgeSuccessTxUrl } from '../../../hooks/useBridgeICake'
import { ICakeLogo, IfoIcon } from '../../Icons'

type Props = {
  // iCAKE on source chain to bridge
  icake?: CurrencyAmount<Currency>

  sourceChainId?: ChainId
  ifoChainId?: ChainId

  state: BridgeState
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

const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.625rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
`

const ICakeDisplayContainer = styled(Flex).attrs({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
})``

export function BridgeICakeModal({ icake, sourceChainId, ifoChainId, state, ...rest }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const isCurrentChainSourceChain = chainId === sourceChainId
  const sourceChainName = useChainName(sourceChainId)

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
              <Card mt="1rem">
                <StyledCardBody>
                  <ICakeDisplayContainer flex="3">
                    <ICakeLogo />
                    <Flex ml="1rem" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                      <Text fontSize="0.75rem" bold color="secondary">
                        {t('Your iCAKE on %chainName%', {
                          chainName: sourceChainName,
                        })}
                      </Text>
                      <Text fontSize="1.25rem" bold>
                        {formatAmount(icake)}
                      </Text>
                    </Flex>
                  </ICakeDisplayContainer>
                  <Button ml="1.25rem" width="100%" style={{ flex: '4' }}>
                    {isCurrentChainSourceChain ? t('Bridge iCAKE') : t('Switch Network to Bridge')}
                  </Button>
                </StyledCardBody>
              </Card>
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

  const statusIcon = isSuccess ? (
    <CheckmarkCircleIcon color="success" width="50px" height="50px" mt="3rem" mb="3rem" />
  ) : (
    <Spinner />
  )

  return (
    <StyledStateModal title={t('Bridge iCAKE')}>
      <ModalBody>
        <Flex flexDirection="column" justifyContent="flex-start" alignItems="center">
          {statusIcon}
          {!isSuccess && (
            <StateTitle mt="1rem">
              {t('Bridging %amount% iCAKE', {
                amount: formatAmount(icake) || '',
              })}
            </StateTitle>
          )}
          {crossChainInfo}
          <BridgeStateIconDisplay mt="0.75rem" srcChainId={sourceChainId} ifoChainId={ifoChainId} state={state} />
          <Flex mt="1rem" alignItems="center" flexDirection="column">
            {renderTips()}
          </Flex>
          {link}
          {isSuccess && <StateTitle mt="1rem">{t('Transaction receipt')}:</StateTitle>}
          {txLink}
        </Flex>
      </ModalBody>
    </StyledStateModal>
  )
}

type BridgeStateIconDisplayProps = {
  srcChainId?: ChainId
  ifoChainId?: ChainId
  state: BridgeState
} & SpaceProps

export function BridgeStateIconDisplay({ state, srcChainId, ifoChainId, ...props }: BridgeStateIconDisplayProps) {
  const content =
    state.state === BRIDGE_STATE.FINISHED ? (
      <>
        <LogoRoundIcon width="24px" height="24px" />
        <IfoIcon chainId={ifoChainId} ml="0.125rem" />
      </>
    ) : (
      <>
        <LogoRoundIcon width="24px" height="24px" />
        <IfoIcon chainId={srcChainId} ml="0.25rem" />
        <ArrowForwardIcon width="16px" height="16px" ml="0.5rem" color="textSubtle" />
        <IfoIcon chainId={ifoChainId} ml="0.125rem" />
      </>
    )

  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center" {...props}>
      {content}
    </Flex>
  )
}
