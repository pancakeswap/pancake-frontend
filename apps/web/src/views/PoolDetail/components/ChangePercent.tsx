import { Flex, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import styled from 'styled-components'

const StyledChangePercent = styled(Flex)<{ $negative: boolean }>`
  background: ${({ theme, $negative }) => ($negative ? theme.colors.destructive10 : theme.colors.positive10)};
  border-radius: 999px;
  padding: 0 4px;
`

type ChangePercentProps = {
  percent: number
}

const IconUp = () => {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.54169 7.83956C1.29241 7.83956 1.1108 7.73331 0.996849 7.52081C0.882899 7.30831 0.892408 7.0988 1.02537 6.89228L5.12919 0.735738C5.25383 0.555304 5.42358 0.465088 5.63844 0.465088C5.8533 0.465088 6.02305 0.555304 6.14769 0.735738L10.2515 6.89228C10.3845 7.0988 10.394 7.30831 10.28 7.52081C10.1661 7.73331 9.98446 7.83956 9.73519 7.83956H1.54169Z"
        fill="#129E7D"
      />
    </svg>
  )
}

const IconDown = () => {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.54169 0.160436C1.29241 0.160436 1.1108 0.266686 0.996849 0.479187C0.882899 0.691686 0.892408 0.901199 1.02537 1.10772L5.12919 7.26426C5.25383 7.4447 5.42358 7.53491 5.63844 7.53491C5.8533 7.53491 6.02305 7.4447 6.14769 7.26426L10.2515 1.10772C10.3845 0.901199 10.394 0.691686 10.28 0.479187C10.1661 0.266686 9.98446 0.160436 9.73519 0.160436H1.54169Z"
        fill="#ED4B9E"
      />
    </svg>
  )
}

export const ChangePercent: React.FC<ChangePercentProps> = ({ percent }) => {
  const negative = percent < 0
  const absValue = useMemo(() => {
    const p = Math.abs(percent)
    return p.toFixed(2)
  }, [percent])
  return (
    <StyledChangePercent $negative={negative} alignItems="center">
      {negative ? <IconDown /> : <IconUp />}
      <Text ml="3px" fontSize={16}>
        {absValue}%
      </Text>
    </StyledChangePercent>
  )
}
