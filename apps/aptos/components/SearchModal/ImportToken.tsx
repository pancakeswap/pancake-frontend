import { useState, useMemo } from 'react'
import { Token, Currency } from '@pancakeswap/aptos-swap-sdk'
import {
  Button,
  Text,
  ErrorIcon,
  Flex,
  Message,
  Checkbox,
  LinkExternal,
  Tag,
  Grid,
  AutoColumn,
  ListLogo,
} from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import truncateHash from '@pancakeswap/utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllLists, useInactiveListUrls } from 'state/lists/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useAddUserToken } from 'state/user'
import { WrappedTokenInfo, TokenList } from '@pancakeswap/token-lists'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  const lists = useAllLists()
  const inactiveUrls = useInactiveListUrls()

  const tokenListMap: WeakMap<Token, TokenList> = useMemo(() => {
    const map = new WeakMap()
    tokens.forEach((token) => {
      for (const url of inactiveUrls) {
        const list = lists[url].current
        const tokenInList = list?.tokens.some(
          (tokenInfo) => tokenInfo.address === token.address && tokenInfo.chainId === token.chainId,
        )
        if (tokenInList) {
          map.set(token, list)
          break
        }
      }
    })
    return map
  }, [inactiveUrls, lists, tokens])

  return (
    <AutoColumn gap="lg">
      <Message variant="warning">
        <Text>
          {t(
            'Anyone can create a coin on Aptos with any name, including fake versions of existing coins or ones that claim to represent projects that do not have a coin.',
          )}
          <br />
          <br />
          <strong>{t('If you purchase a fraudulent coin, you may be exposed to permanent loss of funds.')}</strong>
        </Text>
      </Message>

      {tokens.map((token) => {
        const tokenList = tokenListMap.get(token)
        const address = token.address ? `${truncateHash(token.address)}` : null
        return (
          <Grid key={token.address} gridTemplateRows="1fr 1fr 1fr" gridGap="4px">
            {tokenList !== undefined ? (
              <Tag
                variant="success"
                outline
                scale="sm"
                startIcon={tokenList.logoURI && <ListLogo logoURI={tokenList.logoURI} size="12px" />}
              >
                {t('via')} {tokenList.name}
              </Tag>
            ) : (
              <Tag variant="failure" outline scale="sm" startIcon={<ErrorIcon color="failure" />}>
                {t('Unknown Source')}
              </Tag>
            )}
            <Flex alignItems="center">
              <Text mr="8px">{token.name}</Text>
              <Text>({token.symbol})</Text>
            </Flex>
            {token.chainId && (
              <Flex justifyContent="space-between" width="100%">
                <Text mr="4px">{address}</Text>
                <LinkExternal isAptosScan href={getBlockExploreLink(token.address, 'token', token.chainId)}>
                  {t('View on %site%', {
                    site: t('Explorer'),
                  })}
                </LinkExternal>
              </Flex>
            )}
          </Grid>
        )
      })}

      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex>
        <Button
          variant="danger"
          disabled={!confirmed}
          onClick={() => {
            tokens.forEach((token) => {
              const inactiveTokenList = tokenListMap.get(token)
              const inactiveTokenInfo = inactiveTokenList?.[chainId]?.[token.address]
              let tokenToAdd = token
              if (inactiveTokenInfo) {
                tokenToAdd = new WrappedTokenInfo({
                  ...token,
                  logoURI: inactiveTokenInfo.logoURI,
                  name: token.name || inactiveTokenInfo.name,
                })
              }
              addToken(tokenToAdd)
            })
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          {t('Import')}
        </Button>
      </Flex>
    </AutoColumn>
  )
}

export default ImportToken
