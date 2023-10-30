import parse from 'url-parse'

export function updateQuery(url: string, query: object) {
  const parsed = parse(url, true)
  const queries = {
    ...parsed.query,
    ...query,
  }
  for (const key of Object.keys(queries)) {
    if (queries[key] === undefined) {
      delete queries[key]
    }
  }

  parsed.set('query', queries)
  return parsed.toString()
}

export function getPathWithQueryPreserved(currentUrl: string, newPath: string) {
  const parsed = parse(currentUrl, true)
  parsed.set('pathname', newPath)
  return parsed.toString()
}
