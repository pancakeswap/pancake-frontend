import { AutoColumn, LinkExternal, Text, Box } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Transaction, TransactionType } from '../../types'
import { formatTime } from '../../utils/date'
import { formatAmount, formatDollarAmount } from '../../utils/numbers'
import { DarkGreyCard } from '../Card'
import HoverInlineText from '../HoverInlineText'
import Loader from '../Loader'
import { RowFixed } from '../Row'
import { Arrow, Break, PageButtons } from '../shared'
import { getEtherscanLink, shortenAddress } from '../../utils'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 1.5fr repeat(5, 1fr);

  @media screen and (max-width: 940px) {
    grid-template-columns: 1.5fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 1.5fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1.5fr repeat(1, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const SortText = styled.button<{ active: boolean }>`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 500 : 400)};
  margin-right: 0.75rem !important;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0px;
  color: ${({ active, theme }) => (active ? theme.colors.text : theme.colors.textSubtle)};
  outline: none;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

const DataRow = ({ transaction, color }: { transaction: Transaction; color?: string }) => {
  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const { chainId } = useActiveChainId()
  const { theme } = useTheme()

  return (
    <ResponsiveGrid>
      <LinkExternal href={getEtherscanLink(chainId, transaction.hash, 'transaction')}>
        <Text fontWeight={400}>
          {transaction.type === TransactionType.MINT
            ? `Add ${transaction.token0Symbol} and ${transaction.token1Symbol}`
            : transaction.type === TransactionType.SWAP
            ? `Swap ${inputTokenSymbol} for ${outputTokenSymbol}`
            : `Remove ${transaction.token0Symbol} and ${transaction.token1Symbol}`}
        </Text>
      </LinkExternal>
      <Text fontWeight={400}>{formatDollarAmount(transaction.amountUSD)}</Text>
      <Text fontWeight={400}>
        <HoverInlineText text={`${formatAmount(abs0)}  ${transaction.token0Symbol}`} maxCharacters={16} />
      </Text>
      <Text fontWeight={400}>
        <HoverInlineText text={`${formatAmount(abs1)}  ${transaction.token1Symbol}`} maxCharacters={16} />
      </Text>
      <Text fontWeight={400}>
        <LinkExternal
          href={getEtherscanLink(chainId, transaction.sender, 'address')}
          style={{ color: color ?? theme.colors.primary }}
        >
          {shortenAddress(transaction.sender)}
        </LinkExternal>
      </Text>
      <Text fontWeight={400}>{formatTime(transaction.timestamp, 0)}</Text>
    </ResponsiveGrid>
  )
}

export default function TransactionTable({
  transactions,
  maxItems = 10,
  color,
}: {
  transactions: Transaction[]
  maxItems?: number
  color?: string
}) {
  // theming
  const { theme } = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (transactions.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(transactions.length / maxItems) + extraPages)
  }, [maxItems, transactions])

  // filter on txn type
  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

  const sortedTransactions = useMemo(() => {
    return transactions
      ? transactions
          .slice()
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Transaction] > b[sortField as keyof Transaction]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .filter((x) => {
            return txFilter === undefined || x.type === txFilter
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [transactions, maxItems, page, sortField, sortDirection, txFilter])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    },
    [sortDirection, sortField],
  )

  if (!transactions) {
    return <Loader />
  }

  return (
    <Wrapper>
      <AutoColumn gap="16px">
        <ResponsiveGrid>
          <RowFixed>
            <SortText
              onClick={() => {
                setTxFilter(undefined)
              }}
              active={txFilter === undefined}
            >
              All
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.SWAP)
              }}
              active={txFilter === TransactionType.SWAP}
            >
              Swaps
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.MINT)
              }}
              active={txFilter === TransactionType.MINT}
            >
              Adds
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.BURN)
              }}
              active={txFilter === TransactionType.BURN}
            >
              Removes
            </SortText>
          </RowFixed>
          <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.amountUSD)}>
            Total Value {arrow(SORT_FIELD.amountUSD)}
          </Text>
          <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.amountToken0)}>
            Token Amount {arrow(SORT_FIELD.amountToken0)}
          </Text>
          <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.amountToken1)}>
            Token Amount {arrow(SORT_FIELD.amountToken1)}
          </Text>
          <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.sender)}>
            Account {arrow(SORT_FIELD.sender)}
          </Text>
          <Text color={theme.colors.textSubtle} onClick={() => handleSort(SORT_FIELD.timestamp)}>
            Time {arrow(SORT_FIELD.timestamp)}
          </Text>
        </ResponsiveGrid>
        <Break />

        {sortedTransactions.map((t) => {
          if (t) {
            return (
              <React.Fragment key={`${t.hash}transactionRecord`}>
                <DataRow transaction={t} color={color} />
                <Break />
              </React.Fragment>
            )
          }
          return null
        })}
        {sortedTransactions.length === 0 ? <Text>No Transactions</Text> : undefined}
        <PageButtons>
          <Box
            onClick={() => {
              setPage(page === 1 ? page : page - 1)
            }}
          >
            <Arrow faded={page === 1}>←</Arrow>
          </Box>
          <Text>{`Page ${page} of ${maxPage}`}</Text>
          <Box
            onClick={() => {
              setPage(page === maxPage ? page : page + 1)
            }}
          >
            <Arrow faded={page === maxPage}>→</Arrow>
          </Box>
        </PageButtons>
      </AutoColumn>
    </Wrapper>
  )
}
