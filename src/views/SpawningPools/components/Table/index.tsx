import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@rug-zombie-libs/uikit'
import FrankEarned from '../FrankEarned/FrankEarned'
import StartFarming from '../StartFarming/StartFarming'
import BuyFrank from '../BuyFrank/BuyFrank'
import RugInDetails from '../RugInDetails'
import TableList from './TableList'
import { spawningPoolById } from '../../../../redux/get'

const TableCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

interface TableProps {
  id: number,
  isAllowance: boolean,
  bnbInBusd: number,
  updateAllowance: any,
  updateResult: any,
  zombieUsdPrice: number,
  account: string,
}

const Table: React.FC<TableProps> = ({ id, isAllowance, bnbInBusd, updateAllowance, updateResult, zombieUsdPrice, account }: TableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [poolData, setPoolData] = useState(spawningPoolById(id))
  const openInDetails = (data) => {
    setIsOpen(data);
  }
  const TableListProps = {
    "handler": openInDetails,
    zombieUsdPrice,
    id,
  }

  return (
    <TableCards>
      <div className="test-card active-1">
        <div className="table-top">
          <TableList {...TableListProps} />
        </div>
        {isOpen ? (
          <div className="table-bottom">
            <div className="w-95 mx-auto mt-3">
              <div className="flex-grow">
                <FrankEarned id={id}/>
                <StartFarming updateResult={setPoolData} zombieUsdPrice={zombieUsdPrice} updateAllowance={updateAllowance} id={id} isAllowance={isAllowance}  />
                <BuyFrank id={id} />
              </div>
              <RugInDetails account={account} bnbInBusd={bnbInBusd} id={id} zombieUsdPrice={zombieUsdPrice} />
            </div>
          </div>
        ) : null}
      </div>
    </TableCards>
  )
}

export default Table
