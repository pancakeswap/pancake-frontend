import React from 'react'
import styled from 'styled-components'
import { Card, Radio } from '@pancakeswap-libs/uikit'

interface SelectionCardProps {
  name: string
  value: string | number
  isChecked?: boolean
  onChange: (val: any) => void
  image: string
}

const StyledCard = styled(Card)`
  ${({ isSuccess }) => !isSuccess && 'box-shadow: none;'}
  border-radius: 16px;
  margin-bottom: 16px;
`

const Label = styled.label`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  children,
  ...props
}) => {
  return (
    <StyledCard isSuccess={isChecked} mb="16px" {...props}>
      <Label>
        <Body>
          <Radio name={name} checked={isChecked} value={value} onChange={(e) => onChange(e.target.value)} />
          <Children>{children}</Children>
        </Body>
        <StyledBackgroundImage src={`/images/nfts/${image}`} />
      </Label>
    </StyledCard>
  )
}

export default SelectionCard
