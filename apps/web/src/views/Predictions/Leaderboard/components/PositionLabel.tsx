import styled from 'styled-components'
import { ArrowDownIcon, ArrowUpIcon } from '@pancakeswap/uikit'
import { BetPosition } from 'state/types'
import { useTranslation } from 'contexts/Localization'

interface PositionLabelProps {
  position: BetPosition
}

const StyledPositionLabel = styled.div<{ bgColor: string }>`
  align-items: center;
  background-color: ${({ theme, bgColor }) => theme.colors[bgColor]};
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  height: 32px;
  min-width: 16px;
  padding-left: 8px;
  padding-right: 8px;
`

const Label = styled.div`
  color: #fff;
  display: none;
  text-transform: uppercase;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    margin-left: 4px;
  }
`

const PositionLabel: React.FC<PositionLabelProps> = ({ position }) => {
  const { t } = useTranslation()
  const isBull = position === BetPosition.BULL
  const bgColor = isBull ? 'success' : 'failure'
  const icon = isBull ? <ArrowUpIcon width="24px" color="white" /> : <ArrowDownIcon width="24px" color="white" />

  return (
    <StyledPositionLabel bgColor={bgColor}>
      {icon}
      <Label>{isBull ? t('Up') : t('Down')}</Label>
    </StyledPositionLabel>
  )
}

export default PositionLabel
