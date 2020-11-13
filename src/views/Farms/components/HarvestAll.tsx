import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import useSushi from '../../../hooks/useSushi'
import Card from '../../../components/Card'
import TranslatedText from '../../../components/TranslatedText/TranslatedText'
import { getFarms } from '../../../sushi/utils'
import { useAllEarnings } from '../../../hooks/useEarnings'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useAllReward } from '../../../hooks/useReward'
import Value from '../../../components/Value'

const HarvestAll: React.FC = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const allPIDS = farms.map((i) => {
    return i.pid
  })
  const allEarnings = useAllEarnings(allPIDS)
  const filteredList = allEarnings.filter((account) => {
    return account.balance.toNumber() > 0
  })
  const pidList = filteredList.map((pid) => {
    return pid.id
  })
  const onlyNumbers = filteredList.map((number) => {
    return getBalanceNumber(number.balance)
  })
  const totalCake = onlyNumbers.reduce((a, b) => {
    return a + b
  }, 0)
  const { onReward } = useAllReward(pidList)

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    await onReward()
    setPendingTx(false)
  }, [onReward])

  return (
    <>
      {filteredList.length > 0 && (
        <StyledContainer>
          <Card>
            <StyledColumn>
              <SLabel>
                <TranslatedText translationId={300}>Pending harvest</TranslatedText>
              </SLabel>
              {filteredList.length > 0 && (
                <ValueContainer>
                  <Value value={totalCake} />
                </ValueContainer>
              )}
              <Button disabled={filteredList.length < 0 || pendingTx} onClick={harvestAllFarms}>
                {pendingTx ? 'Collecting CAKE' : 'Harvest All'}
              </Button>
            </StyledColumn>
          </Card>
        </StyledContainer>
      )}
    </>
  )
}

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 20px;
`
const ValueContainer = styled.div`
  margin-bottom: 20px;
`

const StyledColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[3]}px;
  width: 240px;
`
const SLabel = styled.div`
  line-height: 40px;
  color: ${(props) => props.theme.colors.secondary};
`

export default HarvestAll
