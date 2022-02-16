import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button } from '@pancakeswap/uikit'

const Container = styled.div`
  display: flex;
  align-items: flex-end;
`

export interface UnstakeProps {
  pid: number
}

const Unstake: React.FC<UnstakeProps> = ({ pid }) => {
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
