import { Box, ChevronDownIcon, ChevronRightIcon } from '@pancakeswap/uikit'

interface ExpandButtonProps {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({ isExpanded, setIsExpanded }) => {
  return (
    <Box style={{ cursor: 'pointer', alignSelf: 'center' }} mr="8px" onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? <ChevronDownIcon color="textSubtle" /> : <ChevronRightIcon color="textSubtle" />}
    </Box>
  )
}
