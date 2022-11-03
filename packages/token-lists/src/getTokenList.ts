/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { TokenList } from '@uniswap/token-lists'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import Ajv from 'ajv'
import uniswapSchema from './schema/uniswap.json'
import aptosSchema from './schema/aptos.json'

const uniswapTokenListValidator = new Ajv({ allErrors: true }).compile(uniswapSchema)
const aptosTokenListValidator = new Ajv({ allErrors: true }).compile(aptosSchema)

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 */
export default async function getTokenList(listUrl: string, isAptos: boolean): Promise<TokenList> {
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
    const tokenListValidator = isAptos ? aptosTokenListValidator : uniswapTokenListValidator
    if (!tokenListValidator(json)) {
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
