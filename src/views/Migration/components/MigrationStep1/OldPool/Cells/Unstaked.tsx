import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 14px 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 14px 0 0;
    align-items: center;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 32px;
  }
`

export interface UnstakeProps {
  pool: DeserializedPool
}

const Unstake: React.FC<UnstakeProps> = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const disabled: boolean = true

  const handleUnstake = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  return (
    <Container>
      <Button disabled={disabled} onClick={handleUnstake} marginLeft="auto" width={isDesktop ? '148px' : '120px'}>
        {disabled ? t('Unstaked') : t('Unstake All')}
      </Button>
    </Container>
  )
}

export default Unstake
