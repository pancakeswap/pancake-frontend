/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { TokenInfo, TokenList } from '@pancakeswap/token-lists'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import Ajv from 'ajv'
import remove from 'lodash/remove'
import schema from '../schema/pancakeswap.json'

export const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)
const validateWhiteList = ['0x14016E85a25aeb13065688cAFB43044C2ef86784']
// TUSD(Old)

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 */
export default async function getTokenList(listUrl: string): Promise<TokenList> {
  const urls: string[] = uriToHttp(listUrl)

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url)
    } catch (error) {
      console.error('Failed to fetch list', listUrl, error)
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    const json = await response.json()
    if (json.tokens) {
      remove<TokenInfo>(json.tokens, (token: any) => {
        return token.symbol ? token.symbol.length === 0 : true
      })
    }
    const filteredTokenListJson = {
      ...json,
      tokens: json.tokens.filter((d: any) => validateWhiteList.indexOf(d.address) === -1),
    }
    if (!tokenListValidator(filteredTokenListJson)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${(error as any).dataPath} ${error.message ?? ''}`
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`
        }, '') ?? 'unknown error'
      throw new Error(`Token list failed validation: ${validationErrors}`)
    }
    return json as TokenList
  }
  throw new Error('Unrecognized list URL protocol.')
}
