import React from 'react'
import { Box, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Input, { InputProps } from '../Input'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const TranslateString = useI18n()

  return (
    <Box>
      <Flex justifyContent="flex-end" minHeight="21px" mb="8px">
        <Text color="primary" fontSize="14px">
          {max.toLocaleString()} {symbol} {TranslateString(526, 'Available')}
        </Text>
      </Flex>
      <Input
        endAdornment={
          <Flex alignItems="center">
            <Text bold color="primary" textTransform="uppercase" mx="8px">
              {symbol}
            </Text>
            <div>
              <Button scale="sm" onClick={onSelectMax}>
                {TranslateString(452, 'Max')}
              </Button>
            </div>
          </Flex>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
      />
    </Box>
  )
}

export default TokenInput
