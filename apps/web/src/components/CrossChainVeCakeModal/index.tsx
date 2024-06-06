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
  Text,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import {} from 'ethers'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePancakeVeSenderV2Contract } from 'hooks/useContract'
import { useGetBnbBalance, useVeCakeBalance } from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { useProfileProxyWellSynced } from './hooks/useProfileProxyWellSynced'
// import { encodeFunctionData } from 'viem'
import { ArbitrumIcon, BinanceIcon, EthereumIcon } from './ChainLogos'
import { useCrossChianMessage } from './hooks/useCrossChainMessage'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`

const LayerZeroEIdMap = {
  [ChainId.ETHEREUM]: 30101,
  [ChainId.BSC]: 30102,
  [ChainId.ARBITRUM_ONE]: 30110,
}

const LayerZeroFee = {
  [ChainId.ETHEREUM]: 114670586267181697n,
  [ChainId.ARBITRUM_ONE]: 262309998201766n,
}

const ChainNameMap = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.ARBITRUM_ONE]: 'Arbitrum',
}

const chainDstGasMap = {
  [ChainId.ETHEREUM]: 650000n,
  [ChainId.ARBITRUM_ONE]: 850000n,
}

const ChainLogoMap = {
  [ChainId.BSC]: <BinanceIcon />,
  [ChainId.ETHEREUM]: <EthereumIcon width={16} />,
  [ChainId.ARBITRUM_ONE]: <ArbitrumIcon width={20} height={20} />,
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

export const CrossChainVeCakeModal: React.FC<{
  modalTitle?: string
  onDismiss?: () => void
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}> = ({ onDismiss, modalTitle, isOpen }) => {
  const { isDesktop } = useMatchBreakpoints()
  const { address: account, chain } = useAccount()
  const { t } = useTranslation()
  const veCakeSenderV2Contract = usePancakeVeSenderV2Contract(ChainId.BSC)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [selectChainId, setSelectChainId] = useState<ChainId | undefined>(undefined)
  const [txByChain, setTxByChain] = useState<Record<number, string>>({
    [ChainId.ARBITRUM_ONE]: '',
    [ChainId.ETHEREUM]: '',
  })
  const [modalState, setModalState] = useState<'list' | 'ready' | 'submitted' | 'done'>('list')
  const { balance: veCakeOnBsc } = useVeCakeBalance(ChainId.BSC)
  const { balance: bnbBalance } = useGetBnbBalance()
  const [nativeFee, setNativeFee] = useState<bigint>(0n)
  const { hasProfile, isInitialized } = useProfile()

  const syncVeCake = useCallback(
    async (chainId: ChainId) => {
      if (!account || !veCakeSenderV2Contract || !chainId || !isInitialized) return
      setModalState('ready')
      let syncFee = BigInt(new BigNumber(LayerZeroFee[chainId].toString()).times(1.1).toNumber().toFixed(0))

      try {
        const feeData = await veCakeSenderV2Contract.read.getEstimateGasFees(
          [LayerZeroEIdMap[chainId], chainDstGasMap[chainId]],
          { account },
        )
        if (feeData.nativeFee !== 0n) {
          syncFee = BigInt(new BigNumber(feeData.nativeFee.toString()).times(1.1).toNumber().toFixed(0))
        }
      } catch (e) {
        console.error({ e }, 'feeData error and use the cached value')
      } finally {
        setNativeFee(syncFee)
      }

      if (bnbBalance <= syncFee) return
      const receipt = await fetchWithCatchTxError(async () => {
        return veCakeSenderV2Contract.write.sendSyncMsg(
          [LayerZeroEIdMap[chainId], account, true, hasProfile, chainDstGasMap[chainId]],
          {
            account,
            chain,
            value: syncFee, // payable BNB for cross chain fee
          },
        )
      })
      if (receipt?.status) {
        toastSuccess(
          `${t('Syncing VeCake')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your VeCake is Syncing to')} {ChainNameMap[chainId]}
          </ToastDescriptionWithTx>,
        )
        setTxByChain((prev) => ({ ...prev, [chainId]: receipt.transactionHash }))
        setModalState('submitted')
      }
    },
    [
      account,
      veCakeSenderV2Contract,
      fetchWithCatchTxError,
      chain,
      toastSuccess,
      t,
      bnbBalance,
      hasProfile,
      isInitialized,
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
            <ModalBody minHeight={450}>
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" fontWeight={600} mb="8px">
                {t('My veCAKE')}
              </Text>
              <BinanceChainCard />
              <Text fontSize={12} color="textSubtle" textTransform="uppercase" fontWeight={600} mt="24px" mb="8px">
                {t('Network to Sync')}
              </Text>
              <Flex flexDirection="column" style={{ gap: 12 }}>
                <OtherChainsCard
                  chainName={t('Arbitrum')}
                  chainId={ChainId.ARBITRUM_ONE}
                  onSelected={setSelectChainId}
                  Icon={<ArbitrumIcon width={20} height={20} />}
                  isSelected={selectChainId === ChainId.ARBITRUM_ONE}
                  veCakeOnBsc={veCakeOnBsc}
                  hash={txByChain[ChainId.ARBITRUM_ONE]}
                />
                <OtherChainsCard
                  chainName={t('Ethereum')}
                  chainId={ChainId.ETHEREUM}
                  onSelected={setSelectChainId}
                  Icon={<EthereumIcon width={16} />}
                  isSelected={selectChainId === ChainId.ETHEREUM}
                  veCakeOnBsc={veCakeOnBsc}
                  hash={txByChain[ChainId.ETHEREUM]}
                />
              </Flex>
              <InfoBox />
              <Flex style={{ gap: 10 }} mt="20px">
                {account ? (
                  <Button
                    width="50%"
                    disabled={!selectChainId}
                    onClick={() => {
                      if (selectChainId) syncVeCake(selectChainId)
                    }}
                  >
                    {t('Sync')}
                  </Button>
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
  const { t } = useTranslation()
  const { balance } = useVeCakeBalance(ChainId.BSC)
  return (
    <VeCakeChainBox>
      <Flex alignItems="center" style={{ gap: 5 }}>
        <LogoWrapper>
          <BinanceIcon />
        </LogoWrapper>
        <Text>{t('BNB')}</Text>
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
  const { data: crossChainMessage, isLoading: isCrossChainLoading } = useCrossChianMessage(chainId, hash)
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
        {isLoading || isLayerZeroHashProcessing ? (
          <Loading />
        ) : isLayerZeroHashProcessing && !isSynced ? (
          <LinkExternal external href={`https://layerzeroscan.com/tx/${hash}`}>
            {t('In Progress')}
          </LinkExternal>
        ) : (
          <Text fontSize="16px">{isSynced ? t('Synced') : t('To be Synced')}</Text>
        )}
      </Flex>
      <Flex flexDirection="column">
        <Text fontSize="14px" color="textSubtle">
          {t('veCAKE')}
        </Text>
        {isLayerZeroHashProcessing ? (
          <Flex alignItems="center" justifyContent="center" mt="7px" pb="4px">
            <Loading width="14px" height="14px" />
          </Flex>
        ) : (
          <Text fontSize="16px" textAlign="right">
            {formatNumber(getBalanceNumber(balance))}
          </Text>
        )}
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
        {t('veCake Sync')}
      </Text>
      <Text fontSize={12} mt="12px">
        {t('From BSC to')} {ChainNameMap[chainId]}
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
      {bnbBalance <= nativeFee && <Text color="warning">{t('Insufficient BNB balance')}</Text>}
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
        {t('veCake Sync Submitted')}
      </Text>
      <Text fontSize={12} mt="12px">
        {t('From BSC to')} {ChainNameMap[chainId]}
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
