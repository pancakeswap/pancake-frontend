import { Card, Radio } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

interface SelectionCardProps {
  name: string
  value?: string | number
  isChecked?: boolean
  onChange: (val: any) => void
  image: string
  disabled?: boolean
}

const Label = styled.label<{ isDisabled: boolean }>`
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.6' : '1')};
`

const Body = styled.div`
  align-items: center;
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

const SelectionCard: React.FC<React.PropsWithChildren<SelectionCardProps>> = ({
  name,
  value,
  isChecked = false,
  image,
  onChange,
  disabled = false,
  children,
  ...props
}) => {
  return (
    <Card isSuccess={isChecked} isDisabled={disabled} mb="16px" {...props}>
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
    </Card>
  )
}

export default SelectionCard
