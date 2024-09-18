import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowUpIcon,
  AtomBox,
  Box,
  Button,
  CheckmarkCircleFillIcon,
  Flex,
  Heading,
  LinkExternal,
  LinkIcon,
  Loading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalV2,
  Spinner,
  Svg,
  SvgProps,
  Text,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePancakeVeSenderV2Contract } from 'hooks/useContract'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useGetBnbBalance, useVeCakeBalance } from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { useMultichainVeCakeWellSynced } from './hooks/useMultichainVeCakeWellSynced'
import { useProfileProxyWellSynced } from './hooks/useProfileProxyWellSynced'

import { ArbitrumIcon, BinanceIcon, EthereumIcon, ZKsyncIcon } from './ChainLogos'
import { NetWorkUpdateToDateDisplay } from './components/NetworkUpdateToDate'
import { CROSS_CHAIN_CONFIG } from './constants'
import { useCrossChainMessage } from './hooks/useCrossChainMessage'
import { useTxnByChain } from './hooks/useTxnByChain'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`

const ChainLogoMap = {
  [ChainId.BSC]: <BinanceIcon />,
  [ChainId.ETHEREUM]: <EthereumIcon width={16} />,
  [ChainId.ARBITRUM_ONE]: <ArbitrumIcon width={20} height={20} />,
  [ChainId.ZKSYNC]: <ZKsyncIcon width={16} />,
}

const StyleUl = styled.ul`
  list-style-type: '\2022';
  list-style-position: outside;
  margin-left: 16px;
  margin-top: 20px;
  li {
    padding-left: 5px;
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 12px;
  }
`

const LogoWrapper = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background: #280d5f;
  border-radius: 8px;
`

export const VeCakeChainBox = styled.div`
  position: relative;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 16px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border: 2px solid transparent;
  transition: border-color 0.25s ease-in-out;
  overflow: hidden;
  &.is-selected {
    border-color: ${({ theme }) => theme.colors.success};
    &::before {
      content: ' ';
      position: absolute;
      border-bottom: 20px solid ${({ theme }) => theme.colors.success};
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      height: 0;
      top: -1px;
      right: -15px;
      width: 35px;
      text-align: center;
      padding-right: 10px;
      line-height: 20px;
      font-size: 12px;
      font-weight: 400;
      transform: rotate(45deg);
      color: ${({ theme }) => theme.colors.white};
      overflow: hidden;
    }
  }
`

const OtherChainsConfig = [
  {
    chainName: 'Arbitrum',
    chainId: ChainId.ARBITRUM_ONE,
    Icon: <ArbitrumIcon width={20} height={20} />,
  },
  {
    chainName: 'Ethereum',
    chainId: ChainId.ETHEREUM,
    Icon: <EthereumIcon width={16} />,
  },
  {
    chainName: 'ZKsync',
    chainId: ChainId.ZKSYNC,
    Icon: <ZKsyncIcon width={16} />,
  },
] as const

export const CrossChainVeCakeModal: React.FC<{
  modalTitle?: string
  onDismiss?: () => void
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  targetChainId?: (typeof OtherChainsConfig)[number]['chainId']
}> = ({ onDismiss, modalTitle, isOpen, targetChainId }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { isDesktop } = useMatchBreakpoints()
  const { address: account, chain } = useAccount()
  const { switchNetworkAsync } = useSwitchNetwork()
  const veCakeSenderV2Contract = usePancakeVeSenderV2Contract(ChainId.BSC)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { balance: veCakeOnBsc } = useVeCakeBalance(ChainId.BSC)
  const { balance: bnbBalance } = useGetBnbBalance()

  const [selectChainId, setSelectChainId] = useState<ChainId | undefined>(targetChainId || undefined)

  const [txByChain, setTxByChain] = useTxnByChain()

  const [modalState, setModalState] = useState<'list' | 'ready' | 'submitted' | 'done'>('list')
  const [nativeFee, setNativeFee] = useState<bigint>(0n)
  const [isSwitching, setIsSwitching] = useState(false)

  const { hasProfile, isInitialized } = useProfile()
  const { isVeCakeWillSync, isLoading: isVeCakeSyncedLoading } = useMultichainVeCakeWellSynced(selectChainId)
  const { isSynced, isLoading: isProfileSyncedLoading } = useProfileProxyWellSynced(selectChainId)
  const shouldNotSyncAgain = useMemo(() => {
    return (isVeCakeWillSync && isSynced) || Boolean(txByChain[selectChainId ?? -1])
  }, [isVeCakeWillSync, isSynced, txByChain, selectChainId])
  const { data: crossChainMessage, isLoading: isCrossChainLoading } = useCrossChainMessage(
    selectChainId,
    txByChain[selectChainId ?? -1],
  )

  const isLayerZeroHashProcessing = useMemo(() => {
    if (isCrossChainLoading || crossChainMessage?.status === 'INFLIGHT') {
      return true
    }
    return false
  }, [isCrossChainLoading, crossChainMessage])

  const handleSwitchNetwork = useCallback(async () => {
    try {
      setIsSwitching(true)
      await switchNetworkAsync(ChainId.BSC)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSwitching(false)
    }
  }, [switchNetworkAsync, setIsSwitching])

  const syncVeCake = useCallback(
    async (chainId: ChainId) => {
      if (!account || !veCakeSenderV2Contract || !chainId || !isInitialized) return
      setModalState('ready')
      let syncFee = BigInt(
        new BigNumber(CROSS_CHAIN_CONFIG[chainId].layerZeroFee.toString())
          .times(CROSS_CHAIN_CONFIG[chainId].layerZeroFeeBufferTimes ?? 1.1)
          .toNumber()
          .toFixed(0),
      )

      try {
        const feeData = await veCakeSenderV2Contract.read.getEstimateGasFees(
          [CROSS_CHAIN_CONFIG[chainId].eid, CROSS_CHAIN_CONFIG[chainId].dstGas],
          { account },
        )
        if (feeData.nativeFee !== 0n) {
          syncFee = BigInt(
            new BigNumber(feeData.nativeFee.toString())
              .times(CROSS_CHAIN_CONFIG[chainId].layerZeroFeeBufferTimes ?? 1.1)
              .toNumber()
              .toFixed(0),
          )
        }
      } catch (e) {
        console.error({ e }, 'feeData error and use the cached value')
      } finally {
        setNativeFee(syncFee)
      }

      if (bnbBalance <= syncFee) return
      const receipt = await fetchWithCatchTxError(async () => {
        return veCakeSenderV2Contract.write.sendSyncMsg(
          [CROSS_CHAIN_CONFIG[chainId].eid, account, true, hasProfile, CROSS_CHAIN_CONFIG[chainId].dstGas],
          {
            account,
            chain,
            value: syncFee, // payable BNB for cross chain fee
          },
        )
      })
      if (receipt?.status) {
        toastSuccess(
          `${t('Syncing veCAKE')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your veCAKE is Syncing to')} {CROSS_CHAIN_CONFIG[chainId].name}
          </ToastDescriptionWithTx>,
        )
        setTxByChain((prev) => ({ ...prev, [chainId]: receipt.transactionHash }))
        setModalState('submitted')
      }
    },
    [
      account,
      chain,
      bnbBalance,
      hasProfile,
      isInitialized,
      veCakeSenderV2Contract,
      t,
      setTxByChain,
      toastSuccess,
      fetchWithCatchTxError,
    ],
  )
  return (
    <ModalV2
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss?.()
        setModalState('list')
      }}
      closeOnOverlayClick
    >
      <ModalContainer style={{ minWidth: '375px', padding: isDesktop ? '24px' : '24px 24px 0 24px' }}>
        {modalState === 'list' ? (
          <AtomBox justifyContent="space-between" p="24px" maxWidth="420px" height="100%" style={{ margin: '-24px' }}>
            <StyledModalHeader headerBorderColor="transparent">
              <ModalTitle>
                <Flex flexDirection="column">
                  <Heading scale="md">{modalTitle ?? t('veCAKE Sync')}</Heading>
                  <Text fontSize={14} color="textSubtle">
                    {t('Sync your veCAKE and Pancake Profile across all supported networks.')}
                  </Text>
                </Flex>
              </ModalTitle>
              <ModalCloseButton onDismiss={onDismiss} />
            </StyledModalHeader>
            <ModalBody>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" fontWeight={600} mb="8px">
                {t('My veCAKE')}
              </Text>
              <BinanceChainCard />
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" fontWeight={600} mt="24px" mb="8px">
                {t('Network to Sync')}
              </Text>
              <Flex flexDirection="column" style={{ gap: 12 }}>
                {OtherChainsConfig.filter((config) => !targetChainId || config.chainId === targetChainId).map(
                  (config) => (
                    <OtherChainsCard
                      key={config.chainId}
                      chainName={config.chainName}
                      chainId={config.chainId}
                      onSelected={setSelectChainId}
                      Icon={config.Icon}
                      isSelected={selectChainId === config.chainId}
                      veCakeOnBsc={veCakeOnBsc}
                      hash={txByChain[config.chainId]}
                    />
                  ),
                )}
              </Flex>
              <InfoBox />
              {shouldNotSyncAgain && (
                <Box mt="20px">
                  <NetWorkUpdateToDateDisplay />
                </Box>
              )}
              <Flex style={{ gap: 10 }} mt="20px">
                {account ? (
                  chain?.id !== ChainId.BSC ? (
                    <Button width="50%" onClick={handleSwitchNetwork} disabled={isSwitching}>
                      {t('Switch Chain')}
                      {isSwitching && <Loading width="14px" height="14px" ml="7px" />}
                    </Button>
                  ) : (
                    <Button
                      width="50%"
                      disabled={!selectChainId || isLayerZeroHashProcessing}
                      isLoading={pendingTx || isVeCakeSyncedLoading || isProfileSyncedLoading}
                      onClick={() => {
                        if (selectChainId) syncVeCake(selectChainId)
                      }}
                    >
                      {t('Sync')}
                    </Button>
                  )
                ) : (
                  <ConnectWalletButton />
                )}
                <Button variant="secondary" width="50%" onClick={onDismiss}>
                  {t('Close')}
                </Button>
              </Flex>
            </ModalBody>
          </AtomBox>
        ) : (
          <>
            <StyledModalHeader headerBorderColor="transparent">
              <ModalTitle />
              <ModalCloseButton onDismiss={() => setModalState('list')} />
            </StyledModalHeader>
            {modalState === 'ready' && selectChainId && (
              <ReadyToSyncView chainId={selectChainId} nativeFee={nativeFee} bnbBalance={bnbBalance} />
            )}
            {modalState === 'submitted' && selectChainId && (
              <SubmittedView chainId={selectChainId} hash={txByChain[selectChainId] ?? ''} />
            )}
          </>
        )}
      </ModalContainer>
    </ModalV2>
  )
}

const InfoBox = () => {
  const { t } = useTranslation()
  return (
    <StyleUl>
      <li>{t('Once synced, your veCAKE on the selected network will stay in sync with BNB Chain.')}</li>
      <li>{t('You will need to sync again after extending or adding more CAKE to your CAKE Staking position.')}</li>
      <li>{t('Your Pancake Profile will be synced along with your veCAKE.')}</li>
    </StyleUl>
  )
}

const BinanceChainCard = () => {
  const { balance } = useVeCakeBalance(ChainId.BSC)
  return (
    <VeCakeChainBox>
      <Flex alignItems="center" style={{ gap: 5 }}>
        <LogoWrapper>
          <BinanceIcon />
        </LogoWrapper>
        <Text>BNB</Text>
      </Flex>
      <Text>{formatNumber(getBalanceNumber(balance))}</Text>
      <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="cross-chain-vecake" />
    </VeCakeChainBox>
  )
}

const OtherChainsCard: React.FC<{
  chainName: string
  chainId: ChainId
  Icon: React.ReactElement
  onSelected: (chainId: ChainId) => void
  isSelected: boolean
  veCakeOnBsc: BigNumber
  hash?: string
}> = ({ chainName, chainId, Icon, onSelected, isSelected, hash }) => {
  const { balance } = useVeCakeBalance(chainId)
  const { t } = useTranslation()
  const { isSynced, isLoading } = useProfileProxyWellSynced(chainId)
  const { isVeCakeWillSync } = useMultichainVeCakeWellSynced(chainId)
  const { data: crossChainMessage, isLoading: isCrossChainLoading } = useCrossChainMessage(chainId, hash)
  const { address: account } = useAccount()
  const isLayerZeroHashProcessing = useMemo(() => {
    if (isCrossChainLoading || crossChainMessage?.status === 'INFLIGHT') {
      return true
    }
    return false
  }, [isCrossChainLoading, crossChainMessage])

  return (
    <VeCakeChainBox onClick={() => onSelected(chainId)} className={isSelected ? 'is-selected' : undefined}>
      {isSelected && <CheckMarkRightTop />}
      <Flex alignItems="center" style={{ gap: 5 }}>
        <LogoWrapper> {Icon}</LogoWrapper>
        <Text>{chainName}</Text>
      </Flex>
      <Flex flexDirection="column">
        <Text fontSize="14px" color="textSubtle">
          {t('Profile')}
        </Text>
        {isLayerZeroHashProcessing && !isSynced ? (
          <LinkExternal external href={`https://layerzeroscan.com/tx/${hash}`}>
            {t('In Progress')}
          </LinkExternal>
        ) : isLoading ? (
          <Loading width="14px" height="14px" />
        ) : (
          <>{account ? <Text fontSize="16px">{isSynced ? t('Synced') : t('To be Synced')}</Text> : '-'}</>
        )}
      </Flex>
      <Flex style={{ gap: 10 }}>
        <Flex flexDirection="column">
          <Text fontSize="14px" color="textSubtle">
            {t('veCAKE')}
          </Text>
          {isLayerZeroHashProcessing && !isVeCakeWillSync ? (
            <Flex alignItems="center" justifyContent="center" mt="7px" pb="4px">
              <Loading width="14px" height="14px" />
            </Flex>
          ) : (
            <Text fontSize="16px" textAlign="right">
              {formatNumber(getBalanceNumber(balance))}
            </Text>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt="7px" pb="4px">
          {isVeCakeWillSync ? <SyncedIcon /> : balance.isZero() ? <NotSyncIcon /> : <OutdatedIcon />}
        </Flex>
      </Flex>
    </VeCakeChainBox>
  )
}

const ReadyToSyncView: React.FC<{ chainId: ChainId; nativeFee: bigint; bnbBalance: bigint }> = ({
  chainId,
  nativeFee,
  bnbBalance,
}) => {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ gap: 10 }}>
      <Spinner size={120} />
      <Text fontSize={16} fontWeight={600} mt="16px">
        {t('veCAKE Sync')}
      </Text>
      <Text fontSize={12} mt="12px">
        {t('From %chain% to', { chain: 'BSC' })} {CROSS_CHAIN_CONFIG[chainId].name}
      </Text>
      <Flex justifyContent="flex-end" alignItems="flex-end" style={{ gap: 5 }} mt="12px">
        <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="cross-chain-vecake" />
        <LogoWrapper> {ChainLogoMap[ChainId.BSC]}</LogoWrapper>
        <Box>
          <LinkIcon color="success" />
        </Box>
        <LogoWrapper> {ChainLogoMap[chainId]}</LogoWrapper>
      </Flex>
      <Text mt="30px" color="textSubtle">
        {t('Cross chain fee')}: {getBalanceNumber(new BigNumber(nativeFee.toString()))} BNB
      </Text>
      {bnbBalance <= nativeFee && <Text color="warning">{t('Insufficient %symbol% balance', { symbol: 'BNB' })}</Text>}
      <Text mt="16px" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>
      <Text mt="16px" color="textSubtle">
        {t('Est. time: 2-5 minutes')}
      </Text>
    </Flex>
  )
}

const SubmittedView: React.FC<{ chainId: ChainId; hash: string }> = ({ chainId, hash }) => {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ gap: 10 }}>
      <ArrowUpIcon color="success" width="90px" />
      <Text fontSize={16} fontWeight={600} mt="16px">
        {t('veCAKE Sync Submitted')}
      </Text>
      <Text fontSize={12} mt="12px">
        {t('From %chain% to', { chain: 'BSC' })} {CROSS_CHAIN_CONFIG[chainId].name}
      </Text>
      <Flex justifyContent="flex-end" alignItems="flex-end" style={{ gap: 5 }} mt="12px">
        <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="cross-chain-vecake" />
        <LogoWrapper> {ChainLogoMap[ChainId.BSC]}</LogoWrapper>
        <Box>
          <LinkIcon color="success" />
        </Box>
        <LogoWrapper> {ChainLogoMap[chainId]}</LogoWrapper>
      </Flex>
      <Text mt="30px" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>
      <Text mt="16px" color="textSubtle">
        {t('Est. time: 2-5 minutes')}
      </Text>
      <LinkExternal external href={`https://layerzeroscan.com/tx/${hash}`}>
        {t('Track in LayerZero Explorer')}
      </LinkExternal>
    </Flex>
  )
}

const CheckMarkRightTopSvg = styled(CheckmarkCircleFillIcon)`
  position: absolute;
  top: -4px;
  left: -4px;
  color: ${({ theme }) => theme.colors.success};
  path {
    fill: ${({ theme }) => theme.colors.success};
  }
`
export const CheckMarkRightTop = () => {
  return (
    <Box width="13px" height="13px" background="white" position="absolute" top="4px" right="4px" borderRadius="25%">
      <CheckMarkRightTopSvg />
    </Box>
  )
}

const SyncedIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 28 29" fill="none" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 3.5C5.68629 3.5 3 6.18629 3 9.5V19.5C3 22.8137 5.68629 25.5 9 25.5H19C22.3137 25.5 25 22.8137 25 19.5V9.5C25 6.18629 22.3137 3.5 19 3.5H9ZM9.83346 18.8666C8.62784 18.8666 7.59427 18.4394 6.74413 17.5893C5.89398 16.7392 5.4668 15.7056 5.4668 14.5C5.4668 13.2943 5.89398 12.2608 6.74413 11.4106C7.59427 10.5605 8.62784 10.1333 9.83346 10.1333H12.3335C12.6199 10.1333 12.8696 10.2324 13.0686 10.4315C13.2677 10.6305 13.3668 10.8802 13.3668 11.1666C13.3668 11.4531 13.2677 11.7027 13.0686 11.9018C12.8696 12.1009 12.6199 12.2 12.3335 12.2H9.83346C9.19146 12.2 8.65223 12.4224 8.20405 12.8706C7.75587 13.3187 7.53346 13.858 7.53346 14.5C7.53346 15.142 7.75587 15.6812 8.20405 16.1294C8.65223 16.5776 9.19146 16.8 9.83346 16.8H12.3335C12.6199 16.8 12.8696 16.899 13.0686 17.0981C13.2677 17.2972 13.3668 17.5468 13.3668 17.8333C13.3668 18.1198 13.2677 18.3694 13.0686 18.5685C12.8696 18.7676 12.6199 18.8666 12.3335 18.8666H9.83346ZM11.5001 15.5333C11.2137 15.5333 10.964 15.4342 10.765 15.2351C10.5659 15.0361 10.4668 14.7864 10.4668 14.5C10.4668 14.2135 10.5659 13.9639 10.765 13.7648C10.964 13.5657 11.2137 13.4666 11.5001 13.4666H16.5001C16.7866 13.4666 17.0362 13.5657 17.2353 13.7648C17.4344 13.9639 17.5335 14.2135 17.5335 14.5C17.5335 14.7864 17.4344 15.0361 17.2353 15.2351C17.0362 15.4342 16.7866 15.5333 16.5001 15.5333H11.5001ZM15.6668 18.8666C15.3803 18.8666 15.1307 18.7676 14.9316 18.5685C14.7325 18.3694 14.6335 18.1198 14.6335 17.8333C14.6335 17.5468 14.7325 17.2972 14.9316 17.0981C15.1307 16.899 15.3803 16.8 15.6668 16.8H18.1668C18.8088 16.8 19.348 16.5776 19.7962 16.1294C20.2444 15.6812 20.4668 15.142 20.4668 14.5C20.4668 13.858 20.2444 13.3187 19.7962 12.8706C19.348 12.4224 18.8088 12.2 18.1668 12.2H15.6668C15.3803 12.2 15.1307 12.1009 14.9316 11.9018C14.7325 11.7027 14.6335 11.4531 14.6335 11.1666C14.6335 10.8802 14.7325 10.6305 14.9316 10.4315C15.1307 10.2324 15.3803 10.1333 15.6668 10.1333H18.1668C19.3724 10.1333 20.406 10.5605 21.2561 11.4106C22.1063 12.2608 22.5335 13.2943 22.5335 14.5C22.5335 15.7056 22.1063 16.7392 21.2561 17.5893C20.406 18.4394 19.3724 18.8666 18.1668 18.8666H15.6668ZM12.9272 18.4271C12.8673 18.4869 12.802 18.5356 12.7314 18.573C12.802 18.5356 12.8673 18.4869 12.9272 18.4271C13.0869 18.2673 13.1668 18.0694 13.1668 17.8333C13.1668 17.5972 13.0869 17.3993 12.9272 17.2396C12.7675 17.0798 12.5696 17 12.3335 17H9.83346C9.13902 17 8.54874 16.7569 8.06263 16.2708C7.57652 15.7847 7.33346 15.1944 7.33346 14.5C7.33346 13.8055 7.57652 13.2152 8.06263 12.7291C8.30722 12.4845 8.57818 12.3015 8.87551 12.18C8.57816 12.3015 8.30718 12.4845 8.06258 12.7291C7.57647 13.2153 7.33341 13.8055 7.33341 14.5C7.33341 15.1944 7.57647 15.7847 8.06258 16.2708C8.54869 16.7569 9.13897 17 9.83341 17H12.3334C12.5695 17 12.7674 17.0798 12.9272 17.2396C13.0869 17.3993 13.1667 17.5972 13.1667 17.8333C13.1667 18.0694 13.0869 18.2673 12.9272 18.4271ZM17.0938 15.0937C17.0339 15.1536 16.9687 15.2023 16.8981 15.2397C16.9687 15.2023 17.034 15.1536 17.0939 15.0937C17.2536 14.934 17.3335 14.7361 17.3335 14.5C17.3335 14.2639 17.2536 14.0659 17.0939 13.9062C16.9342 13.7465 16.7362 13.6666 16.5001 13.6666H11.5001C11.4758 13.6666 11.4519 13.6675 11.4284 13.6692C11.4519 13.6675 11.4758 13.6666 11.5001 13.6666H16.5001C16.7362 13.6666 16.9341 13.7465 17.0938 13.9062C17.2536 14.066 17.3334 14.2639 17.3334 14.5C17.3334 14.7361 17.2536 14.934 17.0938 15.0937ZM21.1147 17.4479C20.9116 17.651 20.6978 17.8287 20.4734 17.9811C20.6978 17.8287 20.9116 17.651 21.1147 17.4479C21.9272 16.6354 22.3334 15.6528 22.3334 14.5C22.3334 13.3472 21.9272 12.3646 21.1147 11.5521C20.3022 10.7396 19.3195 10.3333 18.1667 10.3333H15.6667C15.6427 10.3333 15.6191 10.3341 15.5959 10.3358C15.6192 10.3341 15.6428 10.3333 15.6668 10.3333H18.1668C19.3196 10.3333 20.3022 10.7396 21.1147 11.5521C21.9272 12.3646 22.3335 13.3472 22.3335 14.5C22.3335 15.6527 21.9272 16.6354 21.1147 17.4479ZM18.1668 17C18.2536 17 18.3388 16.9962 18.4223 16.9886C18.3388 16.9962 18.2536 17 18.1667 17H15.6667C15.6301 17 15.5943 17.0019 15.5594 17.0058C15.5943 17.0019 15.6301 17 15.6668 17H18.1668Z"
        fill="#31D0AA"
      />
    </Svg>
  )
}

export const OutdatedIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 28 29" fill="none" {...props}>
      <mask
        id="mask0_8159_40147"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="28"
        height="29"
      >
        <rect y="0.5" width="28" height="28" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_8159_40147)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9 3.5C5.68629 3.5 3 6.18629 3 9.5V19.5C3 22.8137 5.68629 25.5 9 25.5H19C22.3137 25.5 25 22.8137 25 19.5V9.5C25 6.18629 22.3137 3.5 19 3.5H9ZM19.7717 18.2564L18.2839 16.7189L18.5891 16.635C19.0732 16.5019 19.4622 16.2468 19.7624 15.8686C20.0606 15.4928 20.2104 15.0555 20.2104 14.5485C20.2104 13.9462 20.0018 13.4402 19.5813 13.0197C19.1608 12.5992 18.6548 12.3906 18.0525 12.3906H15.7069C15.4381 12.3906 15.2039 12.2976 15.0171 12.1108C14.8303 11.924 14.7374 11.6898 14.7374 11.4211C14.7374 11.1523 14.8303 10.9181 15.0171 10.7313C15.2039 10.5445 15.4381 10.4515 15.7069 10.4515H18.0525C19.1836 10.4515 20.1534 10.8523 20.951 11.65C21.7487 12.4476 22.1495 13.4174 22.1495 14.5485C22.1495 15.3256 21.9479 16.0438 21.545 16.6992C21.1419 17.3552 20.5905 17.8551 19.8943 18.1963L19.7717 18.2564ZM16.9571 15.3996L15.1366 13.579H16.4887C16.7575 13.579 16.9917 13.672 17.1785 13.8588C17.3653 14.0455 17.4583 14.2797 17.4583 14.5485C17.4583 14.7045 17.4269 14.851 17.3603 14.9843C17.295 15.1148 17.2036 15.2235 17.0865 15.3072L16.9571 15.3996ZM8.14845 11.0084C7.71043 11.2655 7.32638 11.606 6.99731 12.0291C6.42415 12.766 6.13683 13.608 6.13683 14.5485C6.13683 15.6797 6.53763 16.6494 7.33527 17.4471C8.13291 18.2447 9.10264 18.6455 10.2338 18.6455H12.5794C12.8482 18.6455 13.0824 18.5525 13.2692 18.3658C13.456 18.179 13.5489 17.9448 13.5489 17.676C13.5489 17.4072 13.456 17.173 13.2692 16.9862C13.0824 16.7994 12.8482 16.7065 12.5794 16.7065H10.2338C9.63145 16.7065 9.12553 16.4978 8.70503 16.0773C8.28453 15.6568 8.07586 15.1509 8.07586 14.5485C8.07586 13.9462 8.28453 13.4402 8.70503 13.0197C8.97243 12.7523 9.27439 12.5706 9.61372 12.4737L11.0553 13.9153C10.9036 14.092 10.828 14.3062 10.828 14.5485C10.828 14.8173 10.921 15.0515 11.1078 15.2383C11.2946 15.4251 11.5288 15.518 11.7975 15.518H12.6581L19.5617 22.4217C19.7437 22.6037 19.9755 22.6917 20.2417 22.6917C20.5079 22.6917 20.7397 22.6037 20.9217 22.4217C21.1037 22.2397 21.1917 22.0079 21.1917 21.7417C21.1917 21.4755 21.1037 21.2437 20.9217 21.0617L7.62996 7.76997C7.44799 7.588 7.21618 7.5 6.94997 7.5C6.68376 7.5 6.45195 7.588 6.26997 7.76997C6.088 7.95195 6 8.18375 6 8.44997C6 8.71618 6.088 8.94799 6.26997 9.12996L8.14845 11.0084ZM21.3852 16.6009C21.0969 17.07 20.7298 17.4549 20.2838 17.7554C20.7297 17.4549 21.0968 17.07 21.3851 16.6009C21.7696 15.9754 21.9618 15.2913 21.9618 14.5485C21.9618 13.467 21.5806 12.545 20.8183 11.7827C20.056 11.0204 19.134 10.6392 18.0524 10.6392H15.7068C15.6792 10.6392 15.652 10.6404 15.6255 10.6427C15.6521 10.6404 15.6792 10.6392 15.7069 10.6392H18.0525C19.1341 10.6392 20.056 11.0204 20.8183 11.7827C21.5806 12.545 21.9618 13.4669 21.9618 14.5485C21.9618 15.2913 21.7696 15.9754 21.3852 16.6009ZM16.4887 13.7667C16.7103 13.7667 16.896 13.8416 17.0458 13.9914C17.1957 14.1413 17.2706 14.327 17.2706 14.5485C17.2706 14.6788 17.2445 14.7961 17.1924 14.9004C17.1403 15.0046 17.0686 15.0893 16.9774 15.1545L16.9774 15.1545C17.0686 15.0893 17.1403 15.0046 17.1924 14.9004C17.2445 14.7961 17.2706 14.6788 17.2706 14.5485C17.2706 14.327 17.1956 14.1413 17.0458 13.9915C16.8959 13.8416 16.7102 13.7667 16.4887 13.7667H15.5896L15.5896 13.7667H16.4887Z"
          fill="#BDC2C4"
        />
      </g>
    </Svg>
  )
}

export const NotSyncIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 28 29" fill="none" {...props}>
      <mask
        id="mask0_8159_40165"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="28"
        height="29"
      >
        <rect y="0.5" width="28" height="28" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_8159_40165)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9 3.5C5.68629 3.5 3 6.18629 3 9.5V19.5C3 22.8137 5.68629 25.5 9 25.5H19C22.3137 25.5 25 22.8137 25 19.5V9.5C25 6.18629 22.3137 3.5 19 3.5H9ZM23 14.5983C23 14.7148 22.9055 14.8093 22.789 14.8093H21.0313C20.9148 14.8093 20.8203 14.7148 20.8203 14.5983C20.8203 13.9212 20.5858 13.3525 20.1131 12.8798C19.6404 12.4071 19.0717 12.1726 18.3946 12.1726H15.7359C15.4337 12.1726 15.1721 12.0679 14.9683 11.8548C14.7669 11.6442 14.6681 11.382 14.6681 11.0827C14.6681 10.7806 14.7726 10.5173 14.9825 10.3074C15.1925 10.0974 15.4558 9.99292 15.7579 9.99292H18.3946C19.6661 9.99292 20.7562 10.4435 21.6528 11.3401C22.5494 12.2367 23 13.3268 23 14.5983ZM16.6148 19.2037C16.3126 19.2037 16.051 19.099 15.8472 18.8859C15.6458 18.6753 15.547 18.4132 15.547 18.1139C15.547 17.8118 15.6515 17.5485 15.8614 17.3385C16.0714 17.1286 16.3347 17.0241 16.6368 17.0241H18.1836V15.4772C18.1836 15.1751 18.2881 14.9118 18.4981 14.7018C18.7081 14.4919 18.9713 14.3874 19.2735 14.3874C19.5756 14.3874 19.8389 14.4919 20.0488 14.7018C20.2588 14.9118 20.3633 15.1751 20.3633 15.4772V17.0241H21.9102C22.2123 17.0241 22.4756 17.1286 22.6855 17.3385C22.8955 17.5485 23 17.8118 23 18.1139C23 18.416 22.8955 18.6793 22.6855 18.8893C22.4756 19.0992 22.2123 19.2037 21.9102 19.2037H20.3633V20.7506C20.3633 21.0527 20.2588 21.316 20.0488 21.5259C19.8389 21.7359 19.5756 21.8404 19.2735 21.8404C18.9713 21.8404 18.7081 21.7359 18.4981 21.5259C18.2881 21.316 18.1836 21.0527 18.1836 20.7506V19.2037H16.6148ZM12.2423 19.2037H9.60565C8.3341 19.2037 7.24403 18.7532 6.34741 17.8566C5.45078 16.9599 5.00024 15.8699 5.00024 14.5983C5.00024 13.3268 5.45078 12.2367 6.34741 11.3401C7.24403 10.4435 8.3341 9.99292 9.60565 9.99292H12.2423C12.5445 9.99292 12.8077 10.0974 13.0177 10.3074C13.2277 10.5173 13.3322 10.7806 13.3322 11.0827C13.3322 11.3849 13.2277 11.6481 13.0177 11.8581C12.8077 12.0681 12.5445 12.1726 12.2423 12.1726H9.60565C8.92854 12.1726 8.35983 12.4071 7.88715 12.8798C7.41447 13.3525 7.1799 13.9212 7.1799 14.5983C7.1799 15.2754 7.41447 15.8441 7.88715 16.3168C8.35983 16.7895 8.92854 17.0241 9.60565 17.0241H12.2423C12.5445 17.0241 12.8077 17.1286 13.0177 17.3385C13.2277 17.5485 13.3322 17.8118 13.3322 18.1139C13.3322 18.416 13.2277 18.6793 13.0177 18.8893C12.8077 19.0992 12.5445 19.2037 12.2423 19.2037ZM11.3634 15.6881C11.0613 15.6881 10.798 15.5837 10.5881 15.3737C10.3781 15.1637 10.2736 14.9005 10.2736 14.5983C10.2736 14.2962 10.3781 14.0329 10.5881 13.823C10.798 13.613 11.0613 13.5085 11.3634 13.5085H16.6368C16.9389 13.5085 17.2022 13.613 17.4122 13.823C17.6221 14.0329 17.7266 14.2962 17.7266 14.5983C17.7266 14.9005 17.6221 15.1637 17.4122 15.3737C17.2022 15.5837 16.9389 15.6881 16.6368 15.6881H11.3634Z"
          fill="#1FC7D4"
        />
      </g>
    </Svg>
  )
}
