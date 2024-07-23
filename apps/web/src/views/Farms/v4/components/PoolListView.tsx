import { TokenPairImage } from 'components/TokenImage'
import { TokenOverview } from '@pancakeswap/widgets-internal'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { BottomDrawer, Column, Button, MoreIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import { ReactNode, useCallback, useMemo, useState } from 'react'
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

  const drawerContent = useMemo(() => <ListItemDetails data={openItem} />, [openItem])

  return (
    <ListContainer>
      {data.map((item) => (
        <ListItemContainer key={item.pid}>
          <Column gap="12px">
            <TokenOverview
              isReady
              token={item.token0}
              quoteToken={item.token1}
              width="48px"
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
            <div>{(Number(item.lpApr) * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%</div>
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
        content={drawerContent}
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
`

export const StyledButton = styled(Button)`
  display: flex;
  padding: 12px 16px;
  justify-content: space-between;
  gap: 8px;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  line-height: 24px;
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

const ListItemDetails: React.FC<IListItemDetailsProps> = ({ data }) => {
  const { t } = useTranslation()
  const columns = useColumnMobileConfig<PoolInfo>()

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
        {columns
          .filter((col) => col.dataIndex !== null)
          .map((col) => (
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
        <StyledButton scale="sm" variant="text" as="a">
          {t('View pool details')}
          <ChevronRightIcon />
        </StyledButton>
        <StyledButton scale="sm" variant="text" as="a">
          {t('Add Liquidity')}
          <ChevronRightIcon />
        </StyledButton>
        <StyledButton scale="sm" variant="text" as="a">
          {t('View info page')}
          <ChevronRightIcon />
        </StyledButton>
      </ItemDetailFooter>
    </ItemDetailContainer>
  )
}
