import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import {
  BlockIcon,
  Box,
  Button,
  CheckmarkCircleIcon,
  Flex,
  Link,
  Logo,
  Modal,
  OpenNewIcon,
  RefreshIcon,
  Text,
  ThemeSwitcher,
  useModal,
  UserMenu,
  UserMenuDivider,
  UserMenuItem,
} from '@pancakeswap/uikit'
import { useTheme as useNextTheme } from 'next-themes'
import Image from 'next/future/image'
import NextLink from 'next/link'
import { useEffect, useReducer, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { getTimePeriods } from './getTimePeriods'
import { CHAINS_STARGATE } from './stargate/config'
import { findChainByStargateId } from './stargate/network'

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

const Summary = styled(Flex)`
  flex: 1;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
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
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={9}>
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
          <Image width={24} height={24} src={`/chains/${chain.id}.png`} unoptimized alt={`chain-${chain.name}`} />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
      <UserMenuDivider />
      <UserMenuItem onClick={() => window?.stargate.wallet.disconnect()}>
        <Text>Disconnect</Text>
      </UserMenuItem>
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
      {transactions?.map((txn, i) => {
        const txnChain = findChainByStargateId(txn.chainId)
        return (
          <TxnLink
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            href={
              txn.confirmation
                ? `${findChainByStargateId(txn.confirmation.chainId)?.chain.blockExplorers?.default.url}/tx/${
                    txn.confirmation.hash
                  }`
                : `${txnChain?.chain.blockExplorers?.default.url}/tx/${txn.hash}`
            }
            external
          >
            <TxnIcon>{renderIcon(txn)}</TxnIcon>
            <Summary>
              {txn.type === 'APPROVE' && (
                <>
                  {`Approve ${txn?.input?.amount?.currency?.symbol ?? ''}`}{' '}
                  <Image
                    width={18}
                    height={18}
                    src={`/chains/${txnChain?.chain.id}.png`}
                    unoptimized
                    alt={`${txnChain?.chain.name}`}
                  />
                </>
              )}
              {txn.type === 'TRANSFER' && (
                <>
                  Transfer {txn.input.amount.toSignificant(2)} {txn.input.from.token.symbol}
                  <Image
                    width={18}
                    height={18}
                    src={`/chains/${findChainByStargateId(txn.input.from.chainId)?.chain.id}.png`}
                    unoptimized
                    alt={`chain-${findChainByStargateId(txn.input.from.chainId)?.chain.name}`}
                  />
                  to {txn.input.to.token.symbol}{' '}
                  <Image
                    width={18}
                    height={18}
                    src={`/chains/${findChainByStargateId(txn.input.to.chainId)?.chain.id}.png`}
                    alt={`chain-${findChainByStargateId(txn.input.to.chainId)?.chain.name}`}
                    unoptimized
                  />
                </>
              )}
            </Summary>
            <Flex>
              {txn.type === 'TRANSFER' && !txn.completed && txn.expected && <CountDown expected={txn.expected} />}
              <TxnIcon>
                <OpenNewIcon width="24px" color="primary" />
              </TxnIcon>
            </Flex>
          </TxnLink>
        )
      })}
    </Modal>
  )
}

function CountDown({ expected }: { expected: string }) {
  const secondLeft = (Date.now() - new Date(expected).getTime()) / 1000
  const { hours, minutes, seconds } = getTimePeriods(secondLeft)
  const [, forceUpdate] = useReducer((s) => s + 1, 0)

  useEffect(() => {
    setInterval(() => forceUpdate(), 1000)
  }, [])

  if (secondLeft > 0) {
    return null
  }

  return (
    <Flex>
      {hours ? `${hours} h` : null} {hours || minutes ? `${minutes} m` : null} {`${parseInt(String(seconds))} s`}
    </Flex>
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
    amount: CurrencyAmount<Token>
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
  amount: CurrencyAmount<Token>
  minAmount: CurrencyAmount<Token>
  nativeFee: CurrencyAmount<Token>
  dstNativeAmount: CurrencyAmount<Token>
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

  const { account, chainId } = wallet || {}

  const chain = findChainByStargateId(chainId)

  const isWrongNetwork = chainId && !chain
  const hasPendingTransactions = pending.length > 0

  if (isWrongNetwork) {
    return (
      <UserMenu text="Network" variant="danger">
        {() => <UserMenuItems onShowTx={() => showRecentTxModal()} />}
      </UserMenu>
    )
  }

  if (account) {
    return (
      <UserMenu
        variant={hasPendingTransactions ? 'pending' : 'default'}
        account={account}
        text={hasPendingTransactions ? `${pending.length} Pending` : ''}
        avatarSrc={chain ? `/chains/${chain?.chain.id}.png` : undefined}
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
