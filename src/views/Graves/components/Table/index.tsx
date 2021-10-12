import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@rug-zombie-libs/uikit'
import FrankEarned from '../FrankEarned/FrankEarned'
import StartFarming from '../StartFarming/StartFarming'
import BuyFrank from '../BuyFrank/BuyFrank'
import RugInDetails from '../RugInDetails'
import TableList from './TableList'
import { account, grave } from '../../../../redux/get'

const TableCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

interface TableProps {
  pid: number,
  isAllowance: boolean,
  bnbInBusd: number,
  updateAllowance: any,
  updateResult: any,
  zombieUsdPrice: number,
}

const Table: React.FC<TableProps> = ({ pid, isAllowance, bnbInBusd, updateAllowance, updateResult, zombieUsdPrice }: TableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [graveData, setGraveData] = useState(grave(pid))
  const openInDetails = (data) => {
    setIsOpen(data);
  }
  const TableListProps = {
    "handler": openInDetails,
    zombieUsdPrice,
    pid,
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
                <FrankEarned pid={pid}/>
                <StartFarming updateResult={setGraveData} zombieUsdPrice={zombieUsdPrice} updateAllowance={updateAllowance} pid={pid} isAllowance={isAllowance}  />
                <BuyFrank pid={pid} />
              </div>
              <RugInDetails bnbInBusd={bnbInBusd} pid={pid} zombieUsdPrice={zombieUsdPrice} account={account()} />
            </div>
          </div>
        ) : null}
      </div>
    </TableCards>
  )
}

export default Table
