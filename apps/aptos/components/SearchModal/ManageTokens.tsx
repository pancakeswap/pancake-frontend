import { Coin, PAIR_LP_TYPE_TAG, Token } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN, isStructTag, useAccount, useAccountBalance, useAccountBalances } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import {
  AddCircleIcon,
  AptosIcon,
  AutoColumn,
  Button,
  Column,
  DeleteOutlineIcon,
  IconButton,
  Input,
  Link,
  Modal,
  ModalV2,
  Row,
  RowBetween,
  RowFixed,
  Text,
} from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { CoinRegisterButton } from 'components/CoinRegisterButton'
import { CurrencyLogo } from 'components/Logo'
import { L0_USDC } from 'config/coins'
import { useAllTokens, useToken } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useNetwork'
import { useRouter } from 'next/router'
import { RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { Field, selectCurrency, useSwapState } from 'state/swap'
import { useRemoveUserAddedToken, useUserAddedTokens } from 'state/user'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import ImportRow from './ImportRow'
import ImportToken from './ImportToken'
import { CurrencyModalView } from './types'

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

function CoinRegisterButtonWithHooks({ token }: { token: Token }) {
  const { account } = useAccount()
  const { data, isLoading } = useAccountBalance({
    address: account?.address,
    coin: token.address,
    enabled: !!token,
    watch: true,
  })

  return token && account && !isLoading && !data ? <CoinRegisterButton currency={token} /> : null
}

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const chainId = useActiveChainId()

  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // FIXME: better not including swap/liquidity state
  const [{ INPUT, OUTPUT }, dispatch] = useSwapState()

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  // if they input an address, use it
  const { data: searchToken } = useToken(searchQuery)

  // all tokens for local list
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const { query } = useRouter()

  const clearQuery = useCallback(
    (address: string) => {
      if (query.inputCurrency === address || INPUT.currencyId === address) {
        replaceBrowserHistory('inputCurrency', APTOS_COIN)
        dispatch(selectCurrency({ field: Field.INPUT, currencyId: APTOS_COIN }))
      }
      if (query.outputCurrency === address || OUTPUT.currencyId === address) {
        replaceBrowserHistory('outputCurrency', L0_USDC[chainId]?.address)
        dispatch(selectCurrency({ field: Field.OUTPUT, currencyId: L0_USDC[chainId]?.address }))
      }
    },
    [INPUT.currencyId, OUTPUT.currencyId, chainId, dispatch, query.inputCurrency, query.outputCurrency],
  )

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.forEach((token) => {
        clearQuery(token.address)
        return removeToken(chainId, token.address)
      })
    }
  }, [chainId, userAddedTokens, clearQuery, removeToken])

  const { account } = useAccount()

  const balances = useAccountBalances({ address: account?.address, watch: true })?.map((b) => b.data)
  const allTokens = useAllTokens()

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size="20px" />
            <Link external href={getBlockExploreLink(token.address, 'token', chainId)} color="textSubtle" ml="10px">
              {token.symbol}
            </Link>
            <Text color="textSubtle" fontSize="14px" ml="8px" mr="3px">
              {token.name}
            </Text>
            <a href={getBlockExploreLink(token.address, 'token', chainId)} target="_blank" rel="noreferrer noopener">
              <IconButton scale="sm" variant="text">
                <AptosIcon color="textSubtle" width="16px" />
              </IconButton>
            </a>
          </RowFixed>
          <RowFixed>
            <CoinRegisterButtonWithHooks token={token} />
            <IconButton
              variant="text"
              scale="sm"
              onClick={() => {
                clearQuery(token.address)
                setTimeout(() => {
                  removeToken(chainId, token.address)
                })
              }}
            >
              <DeleteOutlineIcon color="textSubtle" />
            </IconButton>
          </RowFixed>
        </RowBetween>
      ))
    )
  }, [chainId, userAddedTokens, removeToken, clearQuery])

  const isAddressValid = searchQuery === '' || isStructTag(searchQuery)

  const discoverRegisterTokens = useMemo(
    () =>
      balances
        .filter((b) => b && !allTokens[b.address] && b.address !== APTOS_COIN && !b.address.includes(PAIR_LP_TYPE_TAG))
        .map((b) => b && new Coin(chainId, b.address, b.decimals, b.symbol, b.name)) as Coin[],
    [allTokens, balances, chainId],
  )

  const [warningTokens, setWarningTokens] = useState<Token[]>([])

  return (
    <Wrapper>
      <Column gap="24px" style={{ width: '100%', flex: '1 1' }}>
        <AutoColumn gap="14px">
          <Row>
            <Input
              id="token-search-input"
              scale="lg"
              placeholder="0x0000"
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              isWarning={!isAddressValid}
            />
          </Row>
          {!isAddressValid && <Text color="failure">{t('Enter valid token address')}</Text>}
          {searchToken && (
            <ImportRow
              token={searchToken}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              style={{ height: 'fit-content' }}
            />
          )}
        </AutoColumn>
        <AutoColumn gap="8px">{tokenList}</AutoColumn>
        {Boolean(discoverRegisterTokens.length) && (
          <>
            <Text color="textSubtle">{t('Discovered from registered coins')}</Text>
            <AutoColumn gap="8px">
              {discoverRegisterTokens.map((discoveredToken) => (
                <RowBetween key={discoveredToken.address} width="100%">
                  <RowFixed>
                    <CurrencyLogo currency={discoveredToken} size="20px" />
                    <Link
                      external
                      href={getBlockExploreLink(discoveredToken.address, 'token', chainId)}
                      color="textSubtle"
                      ml="10px"
                    >
                      {discoveredToken.symbol}
                    </Link>
                    <Text color="textSubtle" fontSize="14px" ml="8px">
                      {discoveredToken.name}
                    </Text>
                  </RowFixed>
                  <RowFixed>
                    <IconButton variant="text" scale="sm" onClick={() => setWarningTokens([discoveredToken])}>
                      <AddCircleIcon color="textSubtle" />
                    </IconButton>
                    <a
                      href={getBlockExploreLink(discoveredToken.address, 'token', chainId)}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <IconButton scale="sm" variant="text">
                        <AptosIcon color="textSubtle" width="16px" />
                      </IconButton>
                    </a>
                  </RowFixed>
                </RowBetween>
              ))}
            </AutoColumn>
          </>
        )}
        <Footer>
          <Text bold color="textSubtle">
            {userAddedTokens?.length} {userAddedTokens.length === 1 ? t('Imported Token') : t('Imported Tokens')}
          </Text>
          {userAddedTokens.length > 0 && (
            <Button variant="tertiary" onClick={handleRemoveAll}>
              {t('Clear all')}
            </Button>
          )}
        </Footer>
      </Column>
      <ModalV2 isOpen={Boolean(warningTokens.length)}>
        <Modal title={t('Import Token')} onDismiss={() => setWarningTokens([])}>
          <div style={{ maxWidth: '380px' }}>
            <ImportToken tokens={warningTokens} handleCurrencySelect={() => setWarningTokens([])} />
          </div>
        </Modal>
      </ModalV2>
    </Wrapper>
  )
}
