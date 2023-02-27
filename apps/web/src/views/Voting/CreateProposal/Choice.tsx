import { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import { Box, CloseIcon, IconButton, Input, InputProps } from '@pancakeswap/uikit'

interface ChoiceProps extends InputProps, InputHTMLAttributes<HTMLInputElement> {
  onTextInput: (value: string) => void
  onRemove?: () => void
}

const Choice: React.FC<React.PropsWithChildren<ChoiceProps>> = ({ onRemove, onTextInput, ...props }) => {
  const [isWarning, setIsWarning] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    onTextInput(value)
  }

  return (
    <Box position="relative" mb="16px">
      <Input {...props} onChange={handleChange} isWarning={isWarning} />
      {onRemove && (
        <Box position="absolute" right="8px" top="0px" zIndex={30}>
          <IconButton variant="text" onClick={onRemove}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default Choice
