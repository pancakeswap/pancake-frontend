import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 32px;
`

export interface UnstakeProps {
  pool: DeserializedPool
}

const Unstake: React.FC<UnstakeProps> = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Button marginLeft="auto" width="148px">
        {t('Unstake All')}
      </Button>
    </Container>
  )
}

export default Unstake
