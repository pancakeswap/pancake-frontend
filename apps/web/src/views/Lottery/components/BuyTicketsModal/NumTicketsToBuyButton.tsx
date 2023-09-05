import { styled } from 'styled-components'
import { Button } from '@pancakeswap/uikit'

interface NumTicketsToBuyButtonProps {
  onClick: () => void
  disabled?: boolean
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const NumTicketsToBuyButton: React.FC<React.PropsWithChildren<NumTicketsToBuyButtonProps>> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <StyledButton disabled={disabled} scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={onClick}>
      {children}
    </StyledButton>
  )
}

export default NumTicketsToBuyButton
