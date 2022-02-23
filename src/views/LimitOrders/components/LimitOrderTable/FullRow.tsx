import React from 'react'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { Td, MoreHorizontalIcon, SyncAltIcon } from '@pancakeswap/uikit'

import { useCurrency } from 'hooks/Tokens'

import CurrencyFormat from './CurrencyFormat'
import CellFormat from './CellFormat'
import TextIcon from './TextIcon'

const FullRow: React.FC<{ order: Order }> = ({ order }) => {
  const inputToken = useCurrency(order.inputToken)
  const outputToken = useCurrency(order.outputToken)
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
        <MoreHorizontalIcon />
      </Td>
    </tr>
  )
}

export default FullRow
