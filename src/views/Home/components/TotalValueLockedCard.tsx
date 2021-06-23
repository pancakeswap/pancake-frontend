import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import useIntersectionObserver from 'hooks/useIntersectionObserver'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const data = useGetStats(loadData)
  const tvl = data ? data.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading scale="lg" mb="24px">
          {t('Total Value Locked (TVL)')}
        </Heading>
        {data ? (
          <>
            <Heading scale="xl">{`$${tvl}`}</Heading>
            <Text color="textSubtle">{t('Across all LPs and Syrup Pools')}</Text>
          </>
        ) : (
          <>
            <Skeleton height={66} />
            <div ref={observerRef} />
          </>
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
