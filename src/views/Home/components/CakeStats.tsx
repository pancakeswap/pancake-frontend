import React, { useEffect, useState } from 'react'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from 'contexts/Localization'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const totalSupply = useTotalSupply(loadData)
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress(), loadData))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <StyledCakeStats>
      {!loadData && <div ref={observerRef} />}
      <CardBody>
        <Heading scale="xl" mb="24px">
          {t('Cake Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{t('Total CAKE Supply')}</Text>
          {cakeSupply > 0 ? <CardValue fontSize="14px" value={cakeSupply} /> : <Skeleton width="77px" height="14px" />}
        </Row>
        <Row>
          <Text fontSize="14px">{t('Total CAKE Burned')}</Text>
          {burnedBalance > 0 ? (
            <CardValue fontSize="14px" decimals={0} value={burnedBalance} />
          ) : (
            <Skeleton width="77px" height="14px" />
          )}
        </Row>
        <Row>
          <Text fontSize="14px">{t('New CAKE/block')}</Text>
          <CardValue fontSize="14px" decimals={0} value={20} />
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
