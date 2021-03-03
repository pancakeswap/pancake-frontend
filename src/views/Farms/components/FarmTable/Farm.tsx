import React from 'react'
import styled from 'styled-components'
import { useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { Text } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'

export interface FarmProps {
  label: string
  pid: number
  image: string
}

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`

const IconImage = styled.img`
  margin-right: 8px;
  min-width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 40px;
    height: 40px;
  }
`

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ image, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const TranslateString = useI18n()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold>
          {TranslateString(999, 'FARMING')}
        </Text>
      )
    }

    return null
  }

  return (
    <Container>
      <IconImage src={`/images/farms/${image}.svg`} alt="icon" />
      <div>
        {handleRenderFarming()}
        <Label>{label}</Label>
      </div>
    </Container>
  )
}

export default Farm
