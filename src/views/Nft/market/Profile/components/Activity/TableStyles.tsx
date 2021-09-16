import React from 'react'
import styled from 'styled-components'
import { Grid, Flex, Skeleton } from '@pancakeswap/uikit'

export const TableRow = styled(Grid)`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  grid-template-columns: 1fr minmax(auto, 1fr) 1fr 1fr 1fr;
  column-gap: 12px;
  padding: 20px 24px;
`

export const GridItem = styled(Flex)`
  align-items: center;
`

export const LoadingRow: React.FC = () => (
  <TableRow>
    <GridItem>
      <Skeleton height={68} width="100%" />
    </GridItem>
    <GridItem justifyContent="flex-end">
      <Skeleton height={20} width={52} />
    </GridItem>
    <GridItem justifyContent="flex-end">
      <Skeleton height={32} width={96} />
    </GridItem>
    <GridItem justifyContent="flex-end">
      <Skeleton height={48} width={124} />
    </GridItem>
    <GridItem justifyContent="center">
      <Skeleton height={20} width={96} />
    </GridItem>
  </TableRow>
)

export const TableLoader: React.FC = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)
