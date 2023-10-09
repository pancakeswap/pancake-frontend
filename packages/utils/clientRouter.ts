import parse from 'url-parse'

export function updateQuery(url: string, query: object) {
  const parsed = parse(url, true)
  parsed.set('query', {
    ...parsed.query,
    ...query,
  })
  return parsed.toString()
}

export function getPathWithQueryPreserved(currentUrl: string, newPath: string) {
  const parsed = parse(currentUrl, true)
  parsed.set('pathname', newPath)
  return parsed.toString()
}
