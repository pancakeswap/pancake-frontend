import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { BigNumber } from 'bignumber.js'
import numeral from 'numeral'
import { useZombie } from '../../../hooks/useContract'
import { getDrFrankensteinAddress } from '../../../utils/addressHelpers'
import { BIG_ZERO } from '../../../utils/bigNumber'
import { getBalanceAmount } from '../../../utils/formatBalance'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

interface TotalValueLockedCardReactProps {
  zombieUsdPrice: number,
}

const TotalValueLockedCard:  React.FC<TotalValueLockedCardReactProps> = ({ zombieUsdPrice }: TotalValueLockedCardReactProps) => {
  const { t } = useTranslation()
  const zombie = useZombie()
  const [balance, setBalance] = useState(BIG_ZERO)
  useEffect(()=> {
    zombie.methods.balanceOf(getDrFrankensteinAddress()).call()
      .then(res => {
        setBalance(getBalanceAmount(res).times(zombieUsdPrice))
      })
  }, [zombie.methods, zombieUsdPrice])
  console.log(balance.toString())

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="24px">
          {t('Total Value Locked In Graves')}
        </Heading>
          <>
            <Heading size="xl">{`$${numeral(balance).format('(0.00 a)') }`}</Heading>
            <Text color="textSubtle">{t('Tomb stats coming soon!')}</Text>
          </>

      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
