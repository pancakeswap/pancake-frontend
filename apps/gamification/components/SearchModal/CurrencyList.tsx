import { Currency, ERC20Token } from '@pancakeswap/sdk'
import { Flex, Text } from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

const StyledCurrencyList = styled(Flex)<{ disable?: boolean }>`
  padding: 4px 20px;

  &:hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.background};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.dropdown};
  opacity: ${({ disable }) => disable && '0.4'};
`

interface CurrencyListProps {
  height: number
  selectedCurrency: Currency
  currencies: Currency[]
  onCurrencySelect: (value: Currency) => void
}

export const CurrencyList: React.FC<CurrencyListProps> = ({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
}) => {
  return (
    <Flex height={height} flexDirection={['column']}>
      {Object.assign(currencies).map((currency: Currency) => {
        const isNative = currency?.isNative
        const tokenAddress = isNative ? currency?.wrapped?.address : currency?.address

        const disable =
          tokenAddress.toLowerCase() === selectedCurrency?.wrapped?.address?.toLowerCase() &&
          currency?.chainId === selectedCurrency?.chainId &&
          currency.symbol === selectedCurrency?.symbol

        let newToken: Currency
        if (isNative) {
          newToken = currency
        } else {
          const { chainId, address, decimals, symbol, name, projectLink } = currency
          newToken = new ERC20Token(chainId, address, decimals, symbol, name, projectLink)
        }

        return (
          <StyledCurrencyList
            key={`${tokenAddress}-${currency.symbol}`}
            disable={disable}
            onClick={() => !disable && onCurrencySelect(newToken)}
          >
            <CurrencyLogo style={{ alignSelf: 'center' }} currency={currency} />
            <Flex ml="8px" flexDirection="column">
              <Text bold>{currency?.symbol}</Text>
              <Text color="textSubtle" small ellipsis maxWidth="200px">
                {currency?.name}
              </Text>
            </Flex>
          </StyledCurrencyList>
        )
      })}
    </Flex>
  )
}
