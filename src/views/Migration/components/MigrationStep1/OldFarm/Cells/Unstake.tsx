import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button } from '@pancakeswap/uikit'

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 32px;
`

export interface UnstakeProps {
  pid: number
}

const Unstake: React.FC<UnstakeProps> = ({ pid }) => {
  const { t } = useTranslation()
  const disabled: boolean = true

  return (
    <Container>
      <Button disabled={disabled} marginLeft="auto" width="148px">
        {disabled ? t('Unstaked') : t('Unstake All')}
      </Button>
    </Container>
  )
}

export default Unstake
