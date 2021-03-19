import React from 'react'
import { Box, Button, Flex, Text, Input, InputProps } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  value: string
  onSelectMax?: () => void
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
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
      <Flex alignItems="center">
        <Input onChange={onChange} placeholder="0" value={value} />
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
      </Flex>
    </Box>
  )
}

export default TokenInput
