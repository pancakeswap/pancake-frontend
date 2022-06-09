import styled from 'styled-components'
import { useState, useCallback } from 'react'
import { Flex, Box, Card, Text, CardFooter, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const PotClaimContainer = styled(Box)``

const PotClaim: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PotClaimContainer>
      <h1>Claim</h1>
    </PotClaimContainer>
  )
}

export default PotClaim
