import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { BigNumber } from 'bignumber.js'
import numeral from 'numeral'
import { useZombie } from '../../../hooks/useContract'
import { getAddress, getDrFrankensteinAddress, getTombLpAddress } from '../../../utils/addressHelpers'
import { BIG_ZERO } from '../../../utils/bigNumber'
import { getBalanceAmount } from '../../../utils/formatBalance'
import { getPancakePair } from '../../../utils/contractHelpers'
import { getBnbPriceinBusd } from '../../../state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`
const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

interface TotalValueLockedCardReactProps {
  zombieUsdPrice: number,
}

const TotalValueLockedCard:  React.FC<TotalValueLockedCardReactProps> = ({ zombieUsdPrice }: TotalValueLockedCardReactProps) => {
  const { t } = useTranslation()
  const zombie = useZombie()
  const [tvl, setTvl] = useState(BIG_ZERO)
  const [zombiePrice, setZombiePrice] = useState(0)

  useEffect(() => {
    if(zombiePrice === 0) {
      setZombiePrice(zombieUsdPrice)
    }
  },[zombiePrice, zombieUsdPrice])

  useEffect(()=> {
    zombie.methods.balanceOf(getDrFrankensteinAddress()).call()
      .then(zombieBalanceRes => {
        const lpTokenContract = getPancakePair(getTombLpAddress(0))
        lpTokenContract.methods.totalSupply().call()
          .then((resSupply) => {
            const lpSupply = getBalanceAmount(resSupply)
            lpTokenContract.methods.balanceOf(getDrFrankensteinAddress()).call()
              .then((resStaked) => {
                lpTokenContract.methods.getReserves().call()
                  .then(reserves => {
                    getBnbPriceinBusd().then(bnbPriceRes => {
                      const reservesUsd = [getBalanceAmount(reserves[0]).times(zombiePrice), getBalanceAmount(reserves[1]).times(bnbPriceRes.data.price)]
                      const bnbLpTokenPrice = reservesUsd[0].plus(reservesUsd[1]).div(lpSupply)
                      const bnbLpTokensStaked = getBalanceAmount(resStaked)
                      const bnbTombTvl = bnbLpTokensStaked.times(bnbLpTokenPrice)
                      const zombieBalance = getBalanceAmount(zombieBalanceRes).times(zombiePrice)

                      if(tvl === BIG_ZERO) {
                        setTvl(bnbTombTvl.plus(zombieBalance))
                      }
                    })
                  })
              })
          })
      })

  }, [tvl, zombie.methods, zombiePrice])

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="24px">
          {t('Total Value Locked (TVL)')}
        </Heading>
          <>
            <Heading size="xl">{`$${numeral(tvl).format('(0.00 a)') }`}</Heading>
            <Row>

            <Text fontSize="14px">{t('Across all Tombs and Graves')}</Text>
            </Row>
          </>

      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
