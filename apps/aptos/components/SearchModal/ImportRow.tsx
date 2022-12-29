import { CSSProperties } from 'react'
import { Currency, Token } from '@pancakeswap/aptos-swap-sdk'
import {
  Button,
  Text,
  CheckmarkCircleIcon,
  useMatchBreakpoints,
  AutoRow,
  RowFixed,
  AutoColumn,
  Flex,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo/CurrencyLogo'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import styled from 'styled-components'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { useTranslation } from '@pancakeswap/localization'
import { APTOS_COIN } from '@pancakeswap/awgmi'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 10px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
  }
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  onCurrencySelect,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  onCurrencySelect?: (currency: Currency) => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // globals
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const { t } = useTranslation()

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList()
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token) || token.address === APTOS_COIN

  return (
    <TokenSection
      style={style}
      variant="text"
      as={isActive && onCurrencySelect ? Button : 'a'}
      onClick={() => {
        if (isActive) {
          onCurrencySelect?.(token)
        }
      }}
    >
      <CurrencyLogo currency={token} size={isMobile ? '20px' : '24px'} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <Flex
            alignItems={isMobile && token.symbol.length > 14 ? undefined : 'center'}
            flexDirection={isMobile && token.symbol.length > 14 ? 'column' : 'row'}
          >
            <Text mr="8px">{token.symbol}</Text>
            <Text color="textDisabled">
              <NameOverflow
                style={!isMobile && token.symbol.length > 14 ? { maxWidth: '58px' } : {}}
                title={token.name}
              >
                {token.name}
              </NameOverflow>
            </Text>
          </Flex>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <Text fontSize={isMobile ? '10px' : '14px'} mr="4px" color="textSubtle">
              {t('via')} {list.name}
            </Text>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <Button
          scale={isMobile ? 'sm' : 'md'}
          width="fit-content"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token)
            }
            showImportView()
          }}
        >
          {t('Import')}
        </Button>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text color="success">Active</Text>
        </RowFixed>
      )}
    </TokenSection>
  )
}
