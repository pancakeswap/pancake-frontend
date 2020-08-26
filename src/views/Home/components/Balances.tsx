import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from 'use-wallet'

import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import YamIcon from '../../../components/YamIcon'

import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnharvested from '../../../hooks/useUnharvested'
import useYam from '../../../hooks/useYam'
import useBlock from '../../../hooks/useBlock'
import useAllEarnings from '../../../hooks/useAllEarnings'

import { bnToDec } from '../../../utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { getSushiSupply, getSushiContract } from '../../../sushi/utils'
import { getSushiAddress } from '../../../sushi/utils'
import BigNumber from 'bignumber.js'
import CountUp from 'react-countup'

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

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
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
    </span>
  )
}

const Balances: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const yam = useYam()
  const sushiBalance = useTokenBalance(getSushiAddress(yam))
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  const block = useBlock()
  const chainId = ethereum ? parseInt(ethereum.chainId) : 0
  const startBlock = chainId == 1 ? 10750000 : 20504000
  const farmStarted = ethereum && block >= startBlock

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getSushiSupply(yam)
      setTotalSupply(supply)
    }
    if (yam) {
      fetchTotalSupply()
    }
  }, [yam, setTotalSupply])

  return (
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <YamIcon />
              <Spacer />
              <div style={{ flex: 1 }}>
                <Label text="Your SUSHI Balance" />
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
            <PendingRewards /> SUSHI
          </FootnoteValue>
        </Footnote>
      </Card>
      <Spacer />

      {farmStarted ? (
        <Card>
          <CardContent>
            <Label text="Total SUSHI Supply" />
            <Value
              value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'}
            />
          </CardContent>
          <Footnote>
            New rewards per block
            <FootnoteValue>1,000 SUSHI</FootnoteValue>
          </Footnote>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Label text="# of blocks until rewards begin" />
            <Value
              decimals={0}
              value={ethereum ? startBlock - block : 'Locked'}
            />
          </CardContent>
          <Footnote>
            SUSHI rewards start at block
            <FootnoteValue>#{startBlock}</FootnoteValue>
          </Footnote>
        </Card>
      )}
    </StyledWrapper>
  )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.grey[400]};
  border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
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
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Balances
