import {
  Button,
  Flex,
  Logo,
  UserMenu,
  UserMenuItem,
  UserMenuDivider,
  Text,
  Box,
  ThemeSwitcher,
  useModal,
  Modal,
  Link,
  RefreshIcon,
  CheckmarkCircleIcon,
  BlockIcon,
  OpenNewIcon,
} from '@pancakeswap/uikit'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import Image from 'next/future/image'
import NextLink from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes'
import { CHAINS_STARGATE, bsc, fantomOpera, avalandche } from '@pancakeswap/wagmi'
import { mainnet, arbitrum, optimism, polygon } from 'wagmi/chains'

const StyledMenuItem = styled.a<any>`
  position: relative;
  display: flex;
  align-items: center;

  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.secondary : theme.colors.textSubtle)};
  font-size: 16px;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};

  padding: 0 16px;
  height: 48px;

  &:hover {
    opacity: 0.65;
  }
`

const TxnIcon = styled(Flex)`
  align-items: center;
  flex: none;
  width: 24px;
`

const Summary = styled.div`
  flex: 1;
  padding: 0 8px;
`

const TxnLink = styled(Link)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  margin-bottom: 16px;
  width: 100%;

  &:hover {
    text-decoration: none;
  }
`

export function Menu() {
  const theme = useTheme()
  const { setTheme } = useNextTheme()

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={1}>
      <Flex>
        <Logo isDark={theme.isDark} href="https://pancakeswap.finance" />

        <Flex pl={['25px', null, '50px']}>
          <Box display={['none', null, 'flex']}>
            <NextLink href="/" passHref>
              <StyledMenuItem $isActive>Bridge</StyledMenuItem>
            </NextLink>
          </Box>
          <StyledMenuItem href="https://pancakeswap.finance/swap">Swap</StyledMenuItem>
        </Flex>
      </Flex>
      <Flex alignItems="center">
        <Box mr="16px">
          <ThemeSwitcher isDark={theme.isDark} toggleTheme={() => setTheme(theme.isDark ? 'light' : 'dark')} />
        </Box>
        <User />
      </Flex>
    </Flex>
  )
}

const UserMenuItems = ({ onShowTx }: { onShowTx: () => void }) => {
  return (
    <>
      <UserMenuItem onClick={onShowTx}>
        <Text>Recent Transactions</Text>
      </UserMenuItem>
      <UserMenuDivider />
      <Box px="16px" py="8px">
        <Text>Select a Network</Text>
      </Box>
      <UserMenuDivider />
      {CHAINS_STARGATE.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => switchNetwork(chain.id)}>
          <Image width={24} height={24} src={`/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

async function switchNetwork(chainId: number) {
  const chain = CHAINS_STARGATE.find((c) => c.id === chainId)
  const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
  if (chain && provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chain.id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default,
                blockExplorerUrls: chain.blockExplorers?.default,
              },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network', error)
          return false
        }
      }
      return false
    }
  }
  return false
}

function useStargateReaction<T>(expression: () => T) {
  const savedExpression = useRef(expression)
  const [value, setValue] = useState<T>()

  useEffect(() => {
    savedExpression.current = expression
  }, [expression])

  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      setValue(savedExpression.current)
      window.stargate.utils.reaction(savedExpression.current, (v: T) => {
        setValue(v)
      })
    })
  }, [])

  return value
}

const renderIcon = (txn: TransactionType) => {
  if (!txn.completed) {
    return <RefreshIcon spin width="24px" />
  }

  if (txn.error) {
    return <BlockIcon color="failure" width="24px" />
  }

  return <CheckmarkCircleIcon color="success" width="24px" />
}

const stargateNetowrk = [
  {
    chainId: 1,
    name: 'Ethereum',
    chain: mainnet,
  },
  {
    name: 'BNB Chain',
    chainId: 2,
    chain: bsc,
  },
  {
    chainId: 9,
    name: 'Matic',
    chain: polygon,
  },
  {
    chainId: 6,
    name: 'Avalanche',
    chain: avalandche,
  },
  {
    chainId: 12,
    name: 'Fantom',
    chain: fantomOpera,
  },
  {
    chainId: 10,
    name: 'Arbitrum',
    chain: arbitrum,
  },
  {
    chainId: 11,
    name: 'Optimism',
    chain: optimism,
  },
]

const findChainByStargateId = (chainId: number) => stargateNetowrk.find((s) => s.chainId === chainId)

function RecentTransactionsModal({
  onDismiss,
  transactions,
}: {
  onDismiss?: () => void
  transactions: TransactionType[]
}) {
  return (
    <Modal title="Recent Transactions" onDismiss={onDismiss}>
      <Box mb="16px" style={{ textAlign: 'right' }}>
        <Button scale="sm" onClick={() => window.stargate.transaction.clear()} variant="text" px="0">
          Clear all
        </Button>
      </Box>
      {transactions?.map((txn, i) => (
        <TxnLink
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          href={
            txn.confirmation
              ? `${findChainByStargateId(txn.confirmation.chainId)?.chain.blockExplorers?.default.url}/tx/${
                  txn.confirmation.hash
                }`
              : `${findChainByStargateId(txn.chainId)?.chain.blockExplorers?.default.url}/tx/${txn.hash}`
          }
          external
        >
          <TxnIcon>{renderIcon(txn)}</TxnIcon>
          <Summary>
            {txn.type === 'APPROVE'
              ? `Approve ${txn?.input?.amount?.currency?.symbol}`
              : `Transfer ${txn.input.amount.toSignificant(2)} ${txn.input.from.token.symbol} to ${
                  findChainByStargateId(txn.input.to.chainId)?.name
                }`}
          </Summary>
          <TxnIcon>
            <OpenNewIcon width="24px" color="primary" />
          </TxnIcon>
        </TxnLink>
      ))}
    </Modal>
  )
}

type BaseTxnType = {
  chainId: number
  progress: number
  completed: boolean
  hash: string
  expected: string // date
  exceeded: boolean
  submitted: string // date
  confirmations: number
  confirmation?: {
    hash: string
    chainId: number
  }
  error?: any // ??
}

type TransactionApprove = {
  type: 'APPROVE'
  input: {
    amount: CurrencyAmount
    spender: string
    account: string
  }
} & BaseTxnType

type TransactionTransfer = {
  type: 'TRANSFER'
  input: TransferInput
} & BaseTxnType

type TransactionType = TransactionApprove | TransactionTransfer

type TransferInput = {
  from: {
    account: string
    chainId: number
    token: Token
  }
  to: {
    account: string
    chainId: number
    token: Token
  }
  amount: CurrencyAmount
  minAmount: CurrencyAmount
  nativeFee: CurrencyAmount
  dstNativeAmount: CurrencyAmount
}

function User() {
  const wallet = useStargateReaction(() => window.stargate.wallet.ethereum)
  const [pending, setPending] = useState([])
  const transactions = useStargateReaction(() => window.stargate.transaction.transactions)
  const [showRecentTxModal] = useModal(<RecentTransactionsModal transactions={transactions} />, true, true, 'recent-tx')

  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      setInterval(() => {
        setPending(window.stargate.transaction.pickPendingTransactions())
      }, 1000)
    })
  }, [])

  const { account, chainId, active } = wallet || {}

  const chain = CHAINS_STARGATE.find((c) => c.id === chainId)

  const isWrongNetwork = chainId && !chain
  const hasPendingTransactions = pending.length > 0

  if (isWrongNetwork) {
    return (
      <UserMenu text="Network" variant="danger">
        {() => <UserMenuItems onShowTx={() => showRecentTxModal()} />}
      </UserMenu>
    )
  }

  if (active) {
    return (
      <UserMenu
        variant={hasPendingTransactions ? 'pending' : 'default'}
        account={account}
        text={hasPendingTransactions ? `${pending.length} Pending` : ''}
        avatarSrc={chainId ? `/chains/${chainId}.png` : undefined}
      >
        {() => <UserMenuItems onShowTx={() => showRecentTxModal()} />}
      </UserMenu>
    )
  }

  return (
    <Button scale="sm" onClick={() => window.stargate.ui.connectWalletPopup.open()}>
      <Box display={['none', null, null, 'block']}>Connect Wallet</Box>
      <Box display={['block', null, null, 'none']}>Connect</Box>
    </Button>
  )
}
