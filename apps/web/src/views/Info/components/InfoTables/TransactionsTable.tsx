// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { useCallback, useState, useMemo, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { formatDistanceToNowStrict } from 'date-fns'
import { Text, Flex, Box, Radio, Skeleton, LinkExternal, ArrowForwardIcon, ArrowBackIcon } from '@pancakeswap/uikit'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { Transaction, TransactionType } from 'state/info/types'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { useTranslation } from 'contexts/Localization'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'

const Wrapper = styled.div`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 2fr 0.8fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 2fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(2, 1fr);
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
    grid-template-columns: 2fr 1fr;
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

const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

const TableLoader: React.FC = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const { t } = useTranslation()
  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? transaction.token0Symbol : transaction.token1Symbol

  return (
    <ResponsiveGrid>
      <LinkExternal href={getBscScanLink(transaction.hash, 'transaction')}>
        <Text>
          {transaction.type === TransactionType.MINT
            ? t('Add %token0% and %token1%', { token0: transaction.token0Symbol, token1: transaction.token1Symbol })
            : transaction.type === TransactionType.SWAP
            ? t('Swap %token0% for %token1%', { token0: inputTokenSymbol, token1: outputTokenSymbol })
            : t('Remove %token0% and %token1%', { token0: transaction.token0Symbol, token1: transaction.token1Symbol })}
        </Text>
      </LinkExternal>
      <Text>${formatAmount(transaction.amountUSD)}</Text>
      <Text>
        <Text>{`${formatAmount(abs0)} ${transaction.token0Symbol}`}</Text>
      </Text>
      <Text>
        <Text>{`${formatAmount(abs1)} ${transaction.token1Symbol}`}</Text>
      </Text>
      <LinkExternal href={getBscScanLink(transaction.sender, 'address')}>
        {truncateHash(transaction.sender)}
      </LinkExternal>
      <Text>{formatDistanceToNowStrict(parseInt(transaction.timestamp, 10) * 1000)}</Text>
    </ResponsiveGrid>
  )
}

const TransactionTable: React.FC<{
  transactions: Transaction[]
}> = ({ transactions }) => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

  const sortedTransactions = useMemo(() => {
    const toBeAbsList = [SORT_FIELD.amountToken0, SORT_FIELD.amountToken1]
    return transactions
      ? transactions
          .slice()
          .sort((a, b) => {
            if (a && b) {
              const firstField = a[sortField as keyof Transaction]
              const secondField = b[sortField as keyof Transaction]
              const [first, second] = toBeAbsList.includes(sortField)
                ? [Math.abs(firstField as number), Math.abs(secondField as number)]
                : [firstField, secondField]
              return first > second ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .filter((x) => {
            return txFilter === undefined || x.type === txFilter
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [transactions, page, sortField, sortDirection, txFilter])

  // Update maxPage based on amount of items & applied filtering
  useEffect(() => {
    if (transactions) {
      const filteredTransactions = transactions.filter((tx) => {
        return txFilter === undefined || tx.type === txFilter
      })
      if (filteredTransactions.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE))
      } else {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE) + 1)
      }
    }
  }, [transactions, txFilter])

  const handleFilter = useCallback(
    (newFilter: TransactionType) => {
      if (newFilter !== txFilter) {
        setTxFilter(newFilter)
        setPage(1)
      }
    },
    [txFilter],
  )

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  return (
    <Wrapper>
      <Flex mb="16px">
        <Flex flexDirection={['column', 'row']}>
          <RadioGroup onClick={() => handleFilter(undefined)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === undefined} />
            <Text ml="8px">{t('All')}</Text>
          </RadioGroup>

          <RadioGroup onClick={() => handleFilter(TransactionType.SWAP)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.SWAP} />
            <Text ml="8px">{t('Swaps')}</Text>
          </RadioGroup>
        </Flex>

        <Flex flexDirection={['column', 'row']}>
          <RadioGroup onClick={() => handleFilter(TransactionType.MINT)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.MINT} />
            <Text ml="8px">{t('Adds')}</Text>
          </RadioGroup>

          <RadioGroup onClick={() => handleFilter(TransactionType.BURN)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.BURN} />
            <Text ml="8px">{t('Removes')}</Text>
          </RadioGroup>
        </Flex>
      </Flex>
      <TableWrapper>
        <ResponsiveGrid>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Action')}
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountUSD)}
            textTransform="uppercase"
          >
            {t('Total Value')} {arrow(SORT_FIELD.amountUSD)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountToken0)}
            textTransform="uppercase"
          >
            {t('Token Amount')} {arrow(SORT_FIELD.amountToken0)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountToken1)}
            textTransform="uppercase"
          >
            {t('Token Amount')} {arrow(SORT_FIELD.amountToken1)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.sender)}
            textTransform="uppercase"
          >
            {t('Account')} {arrow(SORT_FIELD.sender)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.timestamp)}
            textTransform="uppercase"
          >
            {t('Time')} {arrow(SORT_FIELD.timestamp)}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />

        {transactions ? (
          <>
            {sortedTransactions.map((transaction, index) => {
              if (transaction) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={index}>
                    <DataRow transaction={transaction} />
                    <Break />
                  </Fragment>
                )
              }
              return null
            })}
            {sortedTransactions.length === 0 ? (
              <Flex justifyContent="center">
                <Text>{t('No Transactions')}</Text>
              </Flex>
            ) : undefined}
            <PageButtons>
              <Arrow
                onClick={() => {
                  setPage(page === 1 ? page : page - 1)
                }}
              >
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>

              <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
              <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1)
                }}
              >
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </>
        ) : (
          <>
            <TableLoader />
            {/* spacer */}
            <Box />
          </>
        )}
      </TableWrapper>
    </Wrapper>
  )
}

export default TransactionTable
