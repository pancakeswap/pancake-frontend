import { BottomDrawer, Button, ChevronRightIcon, Column, MoreIcon } from '@pancakeswap/uikit'
import { TokenOverview } from '@pancakeswap/widgets-internal'
import { TokenPairImage } from 'components/TokenImage'
import { memo, ReactNode, useCallback, useState } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { getChainFullName } from '../utils'
import { PoolGlobalAprButton } from './PoolAprButton'
import { ActionItems } from './PoolListItemAction'
import { useColumnMobileConfig } from './useColumnConfig'

const ListContainer = styled.ul``

const ListItemContainer = styled.li`
  display: flex;
  padding: 12px 16px;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: 1px solid ${({ theme }) => theme.card.background};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

interface IPoolListViewProps {
  data: PoolInfo[]
}
export const ListView: React.FC<IPoolListViewProps> = ({ data }) => {
  const [openItem, setOpenItem] = useState<PoolInfo | null>(null)
  const handleDrawerChange = useCallback((status: boolean) => {
    if (!status) setOpenItem(null)
  }, [])

  return (
    <ListContainer>
      {data.map((item) => (
        <ListItemContainer key={`${item.chainId}-${item.lpAddress}`}>
          <Column gap="12px">
            <TokenOverview
              isReady
              token={item.token0}
              quoteToken={item.token1}
              width="48px"
              getChainName={getChainFullName}
              icon={
                <TokenPairImage
                  width={44}
                  height={44}
                  variant="inverted"
                  primaryToken={item.token0}
                  secondaryToken={item.token1}
                />
              }
            />
            <PoolGlobalAprButton pool={item} />
          </Column>

          <Column>
            <Button scale="xs" variant="text" onClick={() => setOpenItem(item)}>
              <MoreIcon />
            </Button>
          </Column>
        </ListItemContainer>
      ))}

      <BottomDrawer
        drawerContainerStyle={{ height: 'auto' }}
        isOpen={openItem !== null}
        setIsOpen={handleDrawerChange}
        content={<ListItemDetails data={openItem} />}
      />
    </ListContainer>
  )
}

const ItemDetailContainer = styled.div``

const ItemDetailHeader = styled.div`
  display: flex;
  padding: 16px 0 8px;
  justify-content: center;
`

const Grabber = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 9999px;
  opacity: 0.1;
  background: ${({ theme }) => theme.colors.contrast};
`
const ItemDetailFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};

  && button {
    display: flex;
    padding: 12px 16px;
    justify-content: space-between;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    line-height: 24px;
    width: 100%;
  }
`

const ItemDetailBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  font-weight: 600;
`

const ListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 150%;
`

const ListItemLabel = styled(Column)`
  text-transform: uppercase;
`

export interface IListItemDetailsProps {
  data: PoolInfo | null
}

const ListItemDetails: React.FC<IListItemDetailsProps> = memo(({ data }) => {
  const columns = useColumnMobileConfig()

  if (!data) {
    return null
  }

  return (
    <ItemDetailContainer>
      <ItemDetailHeader>
        <Grabber />
      </ItemDetailHeader>
      <ItemDetailBody>
        <TokenOverview
          isReady
          token={data.token0}
          quoteToken={data.token1}
          width="48px"
          getChainName={getChainFullName}
          icon={
            <TokenPairImage
              width={44}
              height={44}
              variant="inverted"
              primaryToken={data.token0}
              secondaryToken={data.token1}
            />
          }
        />
        {columns.map((col) => (
          <ListItem key={col.key}>
            <ListItemLabel>
              {typeof col.title === 'function'
                ? col.title()
                : typeof col.title === 'string'
                ? col.title.toUpperCase()
                : col.title}
            </ListItemLabel>
            <Column>
              {col.render
                ? col.render(col.dataIndex ? data[col.dataIndex] : data, data, 0)
                : col.dataIndex
                ? (data[col.dataIndex] as ReactNode)
                : null}
            </Column>
          </ListItem>
        ))}
      </ItemDetailBody>
      <ItemDetailFooter>
        <ActionItems pool={data} icon={<ChevronRightIcon />} />
      </ItemDetailFooter>
    </ItemDetailContainer>
  )
})
