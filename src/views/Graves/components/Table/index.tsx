import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import FrankEarned from '../FrankEarned/FrankEarned'
import StartFarming from '../StartFarming/StartFarming'
import BuyFrank from '../BuyFrank/BuyFrank'
import RugInDetails from '../RugInDetails'
import TableList from './TableList'

const TableCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

interface TableData {
  id: number,
  name: string,
  subtitle: string,
  path: string,
  type: string,
  withdrawalCooldown: string,
  nftRevivalTime: string,
  rug: any,
  artist?: any,
  stakingToken: any,
  pid: number,
  result : any,
  poolInfo: any,
  pendingZombie: any,
  totalGraveAmount: any,
  pcsVersion: any,
  liquidityDetails: any
}

interface TableProps {
  details: TableData,
  isAllowance: boolean,
  bnbInBusd: number,
  updateAllowance: any,
  updateResult: any,
  zombieUsdPrice: number,
  zombieAllowance: number,
}

const Table: React.FC<TableProps> = ({ details, isAllowance, bnbInBusd, updateAllowance, updateResult, zombieUsdPrice, zombieAllowance }: TableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const openInDetails = (data) => {
    setIsOpen(data);
  }

  const TableListProps = {
    "handler": openInDetails,
    zombieUsdPrice,
    details,
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
                <FrankEarned pid={details.pid} pendingZombie={details.pendingZombie}/>
                <StartFarming updateResult={updateResult} zombieUsdPrice={zombieUsdPrice} zombieAllowance={zombieAllowance} updateAllowance={updateAllowance} details={details} isAllowance={isAllowance}  />
                <BuyFrank details={details} />
              </div>
              <RugInDetails bnbInBusd={bnbInBusd} details={details} zombieUsdPrice={zombieUsdPrice} />
            </div>
          </div>
        ) : null}
      </div>
    </TableCards>
  )
}

export default Table
