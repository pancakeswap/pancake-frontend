import { CSSProperties } from 'react'
import { Token, Currency } from '@pancakeswap/swap-sdk-core'
import { TokenRowButton } from '@pancakeswap/uikit'
import TokenRowWithCurrencyLogo from './TokenRowWithCurrencyLogo'

interface ImportTokenRowProps {
  token: Token
  style?: CSSProperties
  dim?: boolean
  onCurrencySelect?: (currency: Currency) => void
  list: any
  isActive: boolean
  isAdded: boolean
  setImportToken: (token: Token) => void
  showImportView: () => void
}

const ImportTokenRow: React.FC<React.PropsWithChildren<ImportTokenRowProps>> = ({
  token,
  style,
  dim,
  list,
  onCurrencySelect,
  isActive,
  isAdded,
  setImportToken,
  showImportView,
}) => {
  return (
    <TokenRowWithCurrencyLogo
      style={style}
      token={token}
      dim={dim}
      list={list}
      onCurrencySelect={onCurrencySelect}
      isActive={isActive}
    >
      <TokenRowButton<Token>
        token={token}
        isActive={isActive}
        isAdded={isAdded}
        setImportToken={setImportToken}
        showImportView={showImportView}
      />
    </TokenRowWithCurrencyLogo>
  )
}

export default ImportTokenRow
