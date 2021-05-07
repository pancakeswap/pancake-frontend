import React from 'react'
import styled from 'styled-components'
import { Card, Radio } from '@pancakeswap/uikit'

interface SelectionCardProps {
  name: string
  value: string | number
  isChecked?: boolean
  onChange: (val: any) => void
  image: string
  disabled?: boolean
}

const StyledCard = styled(Card)`
  ${({ isSuccess }) => !isSuccess && 'box-shadow: none;'}
  border-radius: 16px;
  margin-bottom: 16px;
`

const Label = styled.label<{ isDisabled: boolean }>`
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.6' : '1')};
`

const Body = styled.div`
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 16px 0 0 16px;
  display: flex;
  flex-grow: 1;
  height: 80px;
  padding: 8px 16px;
`

const Children = styled.div`
  margin-left: 16px;
`

const StyledBackgroundImage = styled.div<{ src: string }>`
  align-self: stretch;
  background-image: url('${({ src }) => src}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex: none;
  width: 80px;
`

const SelectionCard: React.FC<SelectionCardProps> = ({
  name,
  value,
  isChecked = false,
  image,
  onChange,
  disabled,
  children,
  ...props
}) => {
  return (
    <StyledCard isSuccess={isChecked} isDisabled={disabled} mb="16px" {...props}>
      <Label isDisabled={disabled}>
        <Body>
          <Radio
            name={name}
            checked={isChecked}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{ flex: 'none' }}
          />
          <Children>{children}</Children>
        </Body>
        <StyledBackgroundImage src={image} />
      </Label>
    </StyledCard>
  )
}

export default SelectionCard
