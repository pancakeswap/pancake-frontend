import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import FrankEarned from '../FrankEarned/FrankEarned'
import StartFarming from '../StartFarming/StartFarming'
import BuyFrank from '../BuyFrank/BuyFrank'
import RugInDetails from '../RugInDetails'
import TableList from './TableList'
import { useERC20 } from '../../../hooks/useContract'
import { getAddress, getDrFrankensteinAddress } from '../../../utils/addressHelpers'
import { getBalanceAmount } from '../../../utils/formatBalance'
import { BIG_ZERO } from '../../../utils/bigNumber'
import { getContract, getLpContract, getPancakePair } from '../../../utils/contractHelpers'
import pancakeFactoryAbi from '../../../config/abi/pancakeFactoryAbi.json'
import erc20Abi from '../../../config/abi/erc20.json'
import tokens from '../../../config/constants/tokens'
import { bnbPriceUsd, tombByPid, zmbeBnbTomb, zombiePriceUsd } from '../../../redux/get'

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
  updateAllowance:any,
  updateResult:any,
}

const Table: React.FC<TableProps> = ({ pid, isAllowance, bnbInBusd, updateResult, updateAllowance }: TableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tomb = tombByPid(pid)
  const { poolInfo: { totalStaked, reserves, lpTotalSupply } } = tomb
  const openInDetails = (data) => {
    setIsOpen(data);
  }
  const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePriceUsd()), getBalanceAmount(reserves[1]).times(bnbPriceUsd())]
  const lpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpTotalSupply)
  const tvl = totalStaked.times(lpTokenPrice)

  const TableListProps = {
    "handler": openInDetails,
    lpTokenPrice,
    tvl,
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
                <FrankEarned pid={pid} lpTokenPrice={lpTokenPrice}/>
                <StartFarming pid={pid} updateAllowance={updateAllowance} updateResult={updateResult} isAllowance={isAllowance} />
                <BuyFrank pid={pid}/>
              </div>
              <RugInDetails pid={pid} bnbInBusd={bnbInBusd} tvl={tvl} lpTokenPrice={lpTokenPrice}/>
            </div>
          </div>
        ) : null}
      </div>
    </TableCards>
  )
}

export default Table
