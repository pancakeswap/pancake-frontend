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
import { bnbPriceUsd, zmbeBnbTomb, zombiePriceUsd } from '../../../redux/get'

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
  withdrawalCooldown: string,
  artist?: any,
  stakingToken: any,
  pid: number,
  result : any,
  poolInfo: any,
  pendingZombie: any
  quoteToken: any,
  token: any,
  lpAddresses: any,
}

interface TableProps {
  details: TableData,
  isAllowance: boolean,
  bnbInBusd: number,
  updateAllowance:any,
  updateResult:any,
}

const Table: React.FC<TableProps> = ({ details, isAllowance, bnbInBusd, updateResult, updateAllowance }: TableProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openInDetails = (data) => {
    setIsOpen(data);
  }
  const reserves = zmbeBnbTomb().result.reserves
  const lpTotalSupply = zmbeBnbTomb().result.totalSupply
  const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePriceUsd()), getBalanceAmount(reserves[1]).times(bnbPriceUsd())]
  const lpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpTotalSupply)
  const totalLpTokenStaked = new BigNumber(zmbeBnbTomb().result.totalStaked)
  const tvl = totalLpTokenStaked.times(lpTokenPrice)

  const TableListProps = {
    "handler": openInDetails,
    lpTokenPrice,
    tvl,
    totalLpTokenStaked,
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
                <FrankEarned pid={details.pid} pendingZombie={details.pendingZombie} lpTokenPrice={lpTokenPrice} totalLpTokenStaked={totalLpTokenStaked}/>
                <StartFarming updateAllowance={updateAllowance} updateResult={updateResult} lpTokenAddress={getAddress(details.lpAddresses)} details={details} isAllowance={isAllowance} />
                <BuyFrank details={details}/>
              </div>
              <RugInDetails bnbInBusd={bnbInBusd} details={details} tvl={tvl} totalLpTokensStaked={totalLpTokenStaked} lpTokenPrice={lpTokenPrice}/>
            </div>
          </div>
        ) : null}
      </div>
    </TableCards>
  )
}

export default Table
