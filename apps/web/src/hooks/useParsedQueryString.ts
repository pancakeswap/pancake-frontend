import { parse, ParsedQs } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function parsedQueryString(search?: string): ParsedQs {
  let s = search

  if (!s) {
    // react-router-dom places search string in the hash
    const { hash } = window.location
    s = hash.substr(hash.indexOf('?'))
  }
  return s && s.length > 1 ? parse(s, { parseArrays: false, ignoreQueryPrefix: true }) : {}
}

export default function useParsedQueryString(): ParsedQs {
  const { search } = useLocation()
  return useMemo(() => parsedQueryString(search), [search])
}
