import React from 'react'
import { Button, ButtonProps, RefreshIcon, CheckmarkIcon } from '@pancakeswap-libs/uikit'

interface ConfirmButtonProps extends ButtonProps {
  isConfirmed?: boolean
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  isLoading,
  isConfirmed,
  children,
  endIcon,
  disabled,
  ...props
}) => {
  const handleRenderIcon = () => {
    if (endIcon) {
      return endIcon
    }

    if (isLoading) {
      return <RefreshIcon color="white" />
    }

    if (isConfirmed) {
      return <CheckmarkIcon color="textDisabled" width="17px" />
    }

    return null
  }

  return (
    <Button endIcon={handleRenderIcon()} {...props} isLoading={isLoading} disabled={disabled || isConfirmed}>
      {children}
    </Button>
  )
}

export default ConfirmButton
