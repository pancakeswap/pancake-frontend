import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { NATIVE } from '@pancakeswap/sdk'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  Button,
  Flex,
  InfoIcon,
  Text,
  UserMenu,
  UserMenuDivider,
  UserMenuItem,
  useTooltip,
} from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveChainId, useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useNetworkConnectorUpdater } from 'hooks/useActiveWeb3React'
import { useHover } from 'hooks/useHover'
import { useSessionChainId } from 'hooks/useSessionChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useUserShowTestnet } from 'hooks/useUserShowTestnet'
import { useMemo } from 'react'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains } from 'utils/wagmi'
import { useAccount } from 'wagmi'
import { ChainLogo } from './Logo/ChainLogo'

const NetworkSelect = ({
  switchNetwork,
  chainId,
  isWrongNetwork,
}: {
  chainId: ChainId
  isWrongNetwork: boolean
  switchNetwork: (network: ChainId) => void
}) => {
  const { t } = useTranslation()
  const [showTestnet] = useUserShowTestnet()

  return (
    <>
      <Box px="16px" py="8px">
        <Text color="textSubtle">{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains
        .filter((chain) => {
          if (chain.id === chainId) return true
          if ('testnet' in chain && chain.testnet) {
            return showTestnet
          }
          return true
        })
        .map((chain) => (
          <UserMenuItem
            key={chain.id}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => (chain.id !== chainId || isWrongNetwork) && switchNetwork(chain.id)}
          >
            <ChainLogo chainId={chain.id} />
            <Text
              color={chain.id === chainId && !isWrongNetwork ? 'secondary' : 'text'}
              bold={chain.id === chainId && !isWrongNetwork}
              pl="12px"
            >
              {chainNameConverter(chain.name)}
            </Text>
          </UserMenuItem>
        ))}
    </>
  )
}

const WrongNetworkSelect = ({
  switchNetwork,
  chainId,
}: {
  chainId: ChainId
  switchNetwork: (network: ChainId) => void
}) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'The URL you are accessing (Chain id: %chainId%) belongs to %network%; mismatching your wallet’s network. Please switch the network to continue.',
      {
        chainId,
        network: chains.find((c) => c.id === chainId)?.name ?? 'Unknown network',
      },
    ),
    {
      placement: 'auto-start',
      hideTimeout: 0,
    },
  )
  const { chain } = useAccount()
  const localChainId = useLocalNetworkChain() || ChainId.BSC
  const [, setSessionChainId] = useSessionChainId()

  const localChainName = chains.find((c) => c.id === localChainId)?.name ?? 'BSC'

  const [ref1, isHover] = useHover<HTMLButtonElement>()

  return (
    <>
      <Flex ref={targetRef} alignItems="center" px="16px" py="8px">
        <InfoIcon color="textSubtle" />
        <Text color="textSubtle" pl="6px">
          {t('Please switch network')}
        </Text>
      </Flex>
      {tooltipVisible && tooltip}
      <UserMenuDivider />
      {chain && (
        <UserMenuItem ref={ref1} onClick={() => setSessionChainId(chain.id)} style={{ justifyContent: 'flex-start' }}>
          <ChainLogo chainId={chain.id} />
          <Text color="secondary" bold pl="12px">
            {chainNameConverter(chain.name)}
          </Text>
        </UserMenuItem>
      )}
      <Box px="16px" pt="8px">
        {isHover ? <ArrowUpIcon color="text" /> : <ArrowDownIcon color="text" />}
      </Box>
      <UserMenuItem onClick={() => switchNetwork(localChainId)} style={{ justifyContent: 'flex-start' }}>
        <ChainLogo chainId={localChainId} />
        <Text pl="12px">{chainNameConverter(localChainName)}</Text>
      </UserMenuItem>
      <Button mx="16px" my="8px" scale="sm" onClick={() => switchNetwork(localChainId)}>
        {t('Switch network in wallet')}
      </Button>
    </>
  )
}

const SHORT_SYMBOL = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC]: 'BNB',
  [ChainId.BSC_TESTNET]: 'tBNB',
  [ChainId.GOERLI]: 'GOR',
  [ChainId.ARBITRUM_ONE]: 'ARB',
  [ChainId.ARBITRUM_GOERLI]: 'tARB',
  [ChainId.POLYGON_ZKEVM]: 'Polygon zkEVM',
  [ChainId.POLYGON_ZKEVM_TESTNET]: 'tZkEVM',
  [ChainId.ZKSYNC]: 'zkSync',
  [ChainId.ZKSYNC_TESTNET]: 'tZkSync',
  [ChainId.LINEA]: 'Linea',
  [ChainId.LINEA_TESTNET]: 'tLinea',
  [ChainId.OPBNB]: 'opBNB',
  [ChainId.OPBNB_TESTNET]: 'tOpBNB',
  [ChainId.BASE]: 'Base',
  [ChainId.BASE_TESTNET]: 'tBase',
  [ChainId.SCROLL_SEPOLIA]: 'tScroll',
  [ChainId.SEPOLIA]: 'sepolia',
  [ChainId.BASE_SEPOLIA]: 'Base Sepolia',
  [ChainId.ARBITRUM_SEPOLIA]: 'Arb Sepolia',
} as const satisfies Record<ChainId, string>

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork, isNotMatched } = useActiveChainId()
  const { isLoading, canSwitch, switchNetworkAsync } = useSwitchNetwork()

  useNetworkConnectorUpdater()

  const foundChain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])
  const symbol =
    (foundChain?.id ? SHORT_SYMBOL[foundChain.id as ChainId] ?? NATIVE[foundChain.id as ChainId]?.symbol : undefined) ??
    foundChain?.nativeCurrency?.symbol
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Unable to switch network. Please try it on your wallet'),
    { placement: 'bottom' },
  )

  const cannotChangeNetwork = !canSwitch

  return (
    <Box ref={cannotChangeNetwork ? targetRef : null} height="100%">
      {cannotChangeNetwork && tooltipVisible && tooltip}
      <UserMenu
        mr="8px"
        placement="bottom"
        variant={isLoading ? 'pending' : isWrongNetwork ? 'danger' : 'default'}
        avatarSrc={`${ASSET_CDN}/web/chains/${chainId}.png`}
        disabled={cannotChangeNetwork}
        text={
          isLoading ? (
            t('Requesting')
          ) : isWrongNetwork ? (
            t('Network')
          ) : foundChain ? (
            <>
              <Box display={['none', null, null, null, null, 'block']}>{chainNameConverter(foundChain.name)}</Box>
              <Box display={['block', null, null, null, null, 'none']}>{symbol}</Box>
            </>
          ) : (
            t('Select a Network')
          )
        }
      >
        {() =>
          isNotMatched ? (
            <WrongNetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} />
          ) : (
            <NetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} isWrongNetwork={isWrongNetwork} />
          )
        }
      </UserMenu>
    </Box>
  )
}
