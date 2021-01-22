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
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  overflow: hidden;
  margin-bottom: 16px;
`

const Label = styled.label`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  padding: 8px 16px;
`

const Children = styled.div`
  margin-left: 16px;
`

const StyledBackgroundImage = styled.div<{ src: string }>`
  background-image: url('${({ src }) => src}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 120px;
    height: 120px;
  }
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
