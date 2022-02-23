import React from 'react'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { Table, Th, Td, useMatchBreakpoints, MoreHorizontalIcon, SyncAltIcon, Text, useModal } from '@pancakeswap/uikit'

import { useCurrency } from 'hooks/Tokens'

import CurrencyFormat from './CurrencyFormat'
import CellFormat from './CellFormat'
import TextIcon from './TextIcon'
import { DetailLimitOrderModal } from './DetailLimitOrderModal'

const FullRow: React.FC<{ order: Order }> = ({ order }) => {
  const inputToken = useCurrency(order.inputToken)
  const outputToken = useCurrency(order.outputToken)
  const [openDetailLimitOrderModal] = useModal(<DetailLimitOrderModal />)
  return (
    <tr>
      <Td>
        <CellFormat firstRow={1200} secondRow={<CurrencyFormat bold currency={inputToken} />} />
      </Td>
      <Td>
        <CellFormat firstRow={1200} secondRow={<CurrencyFormat bold currency={outputToken} />} />
      </Td>
      <Td>
        <CellFormat
          firstRow={1200}
          secondRow={<TextIcon text={`${inputToken?.symbol}/${outputToken?.symbol}`} icon={<SyncAltIcon />} />}
        />
      </Td>
      <Td>
        <MoreHorizontalIcon onClick={openDetailLimitOrderModal} />
      </Td>
    </tr>
  )
}

export default FullRow
