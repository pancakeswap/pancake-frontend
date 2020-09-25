import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import SushiIcon from '../../../components/SushiIcon'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useTokenBalance, { useBurnedBalance } from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'

import Separator from '../../../components/Separator'
import { getSushiAddress, getSushiSupply } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  const [farms] = useFarms()
  const allStakedValue = useAllStakedValue()

  if (allStakedValue && allStakedValue.length) {
    const sumWeth = farms.reduce(
      (c, { id }, i) => c + (allStakedValue[i].totalWethValue.toNumber() || 0),
      0,
    )
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <StyledSpan
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </StyledSpan>
  )
}

const Balances: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))
  const burnedBalance = useBurnedBalance(getSushiAddress(sushi))
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getSushiSupply(sushi)
      setTotalSupply(supply)
    }
    if (sushi) {
      fetchTotalSupply()
    }
  }, [sushi, setTotalSupply])

  return (
    <>
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <SLabel>Your CAKE Balance</SLabel>
            <StyledBalance>
              <SushiIcon />
              <Spacer />
              <div style={{ flex: 1 }}>
                <Value
                  value={!!account ? getBalanceNumber(sushiBalance) : 'Locked'}
                />
              </div>
            </StyledBalance>
          </StyledBalances>
        </CardContent>

        <Footnote>
          Pending harvest
          <FootnoteValue>
            <PendingRewards /> CAKE
          </FootnoteValue>
        </Footnote>
      </Card>
      <Spacer />

      <Card>
        <StyledBalances>
          <CardContent>
            <SLabel>Total CAKE Supply</SLabel>
            <StyledBalance>
              <Value
                value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'}
              />
            </StyledBalance>
          </CardContent>
        </StyledBalances>
        <Footnote>
          New rewards per block
          <FootnoteValue>40 CAKE</FootnoteValue>
        </Footnote>
      </Card>
    </StyledWrapper>

    <RowCard>
      <SLabel2>🔥 Total CAKE Burned from exsitence</SLabel2>
      <Value
        value={!!account ? getBalanceNumber(burnedBalance) : 'Locked'}
        fontSize='20px'
      />
    </RowCard>
    </>
  )
}

const RowCard = styled.div`
  width: 100%;
  box-shadow: 0px 2px 8px rgba(171,133,115,0.21);
  border-radius: 20px;
  background: #fff;
  line-height: 60px;
  padding: 0 25px;
  box-sizing: border-box;
  background: #FFFDFA;
  margin-top: 20px;
  display:flex;
  justify-content: space-between;
`

const SLabel = styled.div`
  line-height: 40px;
  color: #7645D9;
`

const SLabel2 = styled.div`
  color: #7645D9;
`

const Footnote = styled.div`
  font-size: 14px;
  padding: 0 20px;
  line-height: 50px;
  color: #7645D9;
  border-top: solid 1px #7645d938;
  padding: 0 2rem;
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
  height: 50px;
  line-height: 50px;
  color: #7645D9;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;

  line-height: 60px;
`


const StyledSpan  = styled.span`
  color: #12AAB5;
`

export default Balances
