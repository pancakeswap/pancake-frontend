import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Card, CardBody } from '@pancakeswap-libs/uikit'
import Label from 'components/Label'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import Image from './Image'
import Value from './Value'

interface HarvestProps {
  pid: number
  earnings: BigNumber
}

const Harvest: React.FC<HarvestProps> = ({ pid, earnings }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)

  return (
    <Card>
      <CardBody>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Image src="/images/tokens/CAKE.png" alt="cake" />
            <Value value={getBalanceNumber(earnings)} fontSize="40px" />
            <Label text={TranslateString(330, 'CAKE Earned')} />
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={!earnings.toNumber() || pendingTx}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            >
              {pendingTx ? 'Collecting CAKE' : 'Harvest'}
            </Button>
          </StyledCardActions>
        </StyledCardContentInner>
      </CardBody>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Harvest
