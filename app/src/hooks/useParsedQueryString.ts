import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

export default function useParsedQueryString(): ParsedUrlQuery {
  const { query } = useRouter()
  return query
}
