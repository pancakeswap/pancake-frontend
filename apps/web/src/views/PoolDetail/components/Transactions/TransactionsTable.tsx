import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AutoColumn,
  Box,
  Flex,
  RowFixed,
  ScanLink,
  SortArrowIcon,
  Text,
} from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import orderBy from 'lodash/orderBy'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainLinkSupportChains, multiChainId } from 'state/info/constant'
import { useChainIdByQuery, useChainNameByQuery } from 'state/info/hooks'
import { getBlockExploreLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { Arrow, Break, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import HoverInlineText from 'views/V3Info/components/HoverInlineText'
import { shortenAddress } from 'views/V3Info/utils'
import { formatTime } from 'views/V3Info/utils/date'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import {
  BodyCell,
  ClickableColumnHeader,
  HeadCell,
  LastCell,
  ResponsiveGrid,
  SortButton,
  SortText,
  TableHeader,
} from './styled'
import { SortDirection, Transaction, TransactionType } from './type'

enum SortField {
  TransactionValue = 'amountUSD',
  Account = 'sender',
  Timestamp = 'timestamp',
}

const DataRow = ({ transaction }: { transaction: Transaction; color?: string }) => {
  const abs0 = Math.abs(transaction.amount0)
  const abs1 = Math.abs(transaction.amount1)
  const chainName = useChainNameByQuery()
  const chainId = useChainIdByQuery()

  const token0Symbol = getTokenSymbolAlias(
    transaction.token0.wrapped.address,
    chainId,
    transaction.token0.wrapped.symbol,
  )
  const token1Symbol = getTokenSymbolAlias(
    transaction.token1.wrapped.address,
    chainId,
    transaction.token1.wrapped.symbol,
  )
  const outputTokenSymbol = transaction.amount0 < 0 ? token0Symbol : token1Symbol
  const inputTokenSymbol = transaction.amount1 < 0 ? token0Symbol : token1Symbol

  return (
    <ResponsiveGrid>
      <HeadCell>
        <ScanLink
          useBscCoinFallback={ChainLinkSupportChains.includes(chainId)}
          href={getBlockExploreLink(transaction.transactionHash, 'transaction', chainId)}
        >
          <Text fontWeight={600}>
            {transaction.type === TransactionType.Add
              ? `Add ${token0Symbol} and ${token1Symbol}`
              : transaction.type === TransactionType.Swap
              ? `Swap ${inputTokenSymbol} for ${outputTokenSymbol}`
              : `Remove ${token0Symbol} and ${token1Symbol}`}
          </Text>
        </ScanLink>
        <Flex>
          <Text fontWeight={400}>{formatDollarAmount(transaction.amountUSD)}</Text>&nbsp;
          <Text color="textSubtle">
            <Flex>
              (
              <HoverInlineText color="textSubtle" text={`${formatAmount(abs0)}  ${token0Symbol}`} maxCharacters={16} />
              ,&nbsp;
              <HoverInlineText color="textSubtle" text={`${formatAmount(abs1)}  ${token1Symbol}`} maxCharacters={16} />)
            </Flex>
          </Text>
        </Flex>
      </HeadCell>

      <BodyCell>
        <Text fontWeight={400} textAlign="right">
          {formatDollarAmount(transaction.amountUSD)}
        </Text>
        <Text color="textSubtle">
          <Flex justifyContent="flex-end">
            (<HoverInlineText color="textSubtle" text={`${formatAmount(abs0)} ${token0Symbol}`} maxCharacters={16} />
            ,&nbsp;
            <HoverInlineText color="textSubtle" text={`${formatAmount(abs1)} ${token1Symbol}`} maxCharacters={16} />)
          </Flex>
        </Text>
      </BodyCell>

      <BodyCell>
        <Text fontWeight={400} textAlign="right">
          <Flex justifyContent="flex-end">
            <ScanLink
              useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
              href={getBlockExploreLink(transaction.sender, 'address', multiChainId[chainName])}
              fontWeight={400}
            >
              {shortenAddress(transaction.sender)}
            </ScanLink>
          </Flex>
        </Text>
      </BodyCell>
      <LastCell>
        <Text fontWeight={400} textAlign="right">
          {formatTime(transaction.timestamp.toString(), 0)}
        </Text>

        <ScanLink
          useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
          href={getBlockExploreLink(transaction.transactionHash, 'transaction', multiChainId[chainName])}
          fontWeight={400}
        >
          {truncateHash(transaction.transactionHash, 8, 0)}
        </ScanLink>
      </LastCell>
    </ResponsiveGrid>
  )
}

type TransactionTableProps = {
  transactions: Transaction[]
  maxItems?: number
}

const DEFAULT_FIELD_SORT_DIRECTION = {
  [SortField.TransactionValue]: SortDirection.IDLE,
  [SortField.Account]: SortDirection.IDLE,
  [SortField.Timestamp]: SortDirection.IDLE,
}

export const TransactionsTable: React.FC<TransactionTableProps> = ({ transactions, maxItems = 10 }) => {
  const { t } = useTranslation()

  // for sorting
  const [sortField, setSortField] = useState(SortField.Timestamp)
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Descending)
  const fieldSortDirection = useMemo(() => {
    return {
      ...DEFAULT_FIELD_SORT_DIRECTION,
      [sortField]: sortDirection,
    }
  }, [sortField, sortDirection])

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

  useEffect(() => {
    let extraPages = 1
    if (
      transactions.filter((x) => {
        return txFilter === undefined || x.type === txFilter
      }).length %
        maxItems ===
      0
    ) {
      extraPages = 0
    }
    const maxPageResult =
      Math.floor(
        transactions.filter((x) => {
          return txFilter === undefined || x.type === txFilter
        }).length / maxItems,
      ) + extraPages
    setMaxPage(maxPageResult)
    if (maxPageResult === 0) setPage(0)
    else setPage(1)
  }, [maxItems, transactions, txFilter])

  const sortedTransactions = useMemo(() => {
    const field = fieldSortDirection[sortField] === SortDirection.IDLE ? SortField.Timestamp : sortField
    return transactions
      ? orderBy(transactions, field, sortDirection !== SortDirection.Ascending ? 'desc' : 'asc')
          .filter((x) => {
            return txFilter === undefined || x.type === txFilter
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [fieldSortDirection, sortField, transactions, sortDirection, maxItems, page, txFilter])

  const handleSort = useCallback(
    (newField: SortField) => {
      if (sortField === newField) {
        setSortDirection((direction) => {
          if (newField === SortField.Timestamp) {
            return direction !== SortDirection.Descending ? SortDirection.Descending : SortDirection.Ascending
          }
          if (direction === SortDirection.IDLE) return SortDirection.Descending
          if (direction === SortDirection.Descending) return SortDirection.Ascending
          return SortDirection.IDLE
        })
      } else {
        setSortField(newField)
        setSortDirection(SortDirection.Descending)
      }
    },
    [sortField],
  )

  return (
    <TableWrapper>
      <AutoColumn gap="16px">
        <TableHeader>
          <RowFixed>
            <SortText
              onClick={() => {
                setTxFilter(undefined)
              }}
              $active={txFilter === undefined}
            >
              {t('All')}
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.Swap)
              }}
              $active={txFilter === TransactionType.Swap}
            >
              {t('Swaps')}
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.Add)
              }}
              $active={txFilter === TransactionType.Add}
            >
              {t('Adds')}
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.Remove)
              }}
              $active={txFilter === TransactionType.Remove}
            >
              {t('Removes')}
            </SortText>
          </RowFixed>
          <ClickableColumnHeader color="secondary" textTransform="uppercase">
            {t('transaction value')}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SortField.TransactionValue)}
              $direction={fieldSortDirection[SortField.TransactionValue]}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
          <ClickableColumnHeader color="secondary" textTransform="uppercase">
            {t('account')}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SortField.Account)}
              $direction={fieldSortDirection[SortField.Account]}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
          <ClickableColumnHeader color="secondary" textTransform="uppercase">
            {t('time')}
            <SortButton
              scale="sm"
              variant="subtle"
              onClick={() => handleSort(SortField.Timestamp)}
              className={fieldSortDirection[SortField.Timestamp]}
            >
              <SortArrowIcon />
            </SortButton>
          </ClickableColumnHeader>
        </TableHeader>

        {sortedTransactions.map((d) => {
          if (d) {
            return (
              <React.Fragment
                key={`${d.transactionHash}/${d.timestamp}/${d.type}/${d.token0.wrapped.address}/${d.token1.wrapped.address}/transactionRecord`}
              >
                <DataRow transaction={d} />
                <Break />
              </React.Fragment>
            )
          }
          return null
        })}
        {sortedTransactions.length === 0 && (
          <Flex justifyContent="center">
            <Text>{t('No Transactions')}</Text>
          </Flex>
        )}
        <PageButtons>
          <Box
            onClick={() => {
              if (page > 1) setPage(page - 1)
            }}
          >
            <Arrow>
              <ArrowBackIcon color={page <= 1 ? 'textDisabled' : 'primary'} />
            </Arrow>
          </Box>
          <Text>{`Page ${page} of ${maxPage}`}</Text>
          <Box
            onClick={() => {
              if (page !== maxPage) setPage(page + 1)
            }}
          >
            <Arrow>
              <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </Box>
        </PageButtons>
      </AutoColumn>
    </TableWrapper>
  )
}
