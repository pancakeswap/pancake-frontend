/* eslint-disable @typescript-eslint/no-this-alias */
// @ts-nocheck
const axiomEndpoint = 'https://api.axiom.co'
const axiomDataset = 'routing'

export async function sendLog(err) {
  if (!AXIOM_TOKEN) {
    return new Promise((res) => {
      console.error(err)
      res()
    })
  }

  const url = `${axiomEndpoint}/v1/datasets/${axiomDataset}/ingest`
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    keepalive: true,
    headers: {
      'Content-Type': 'application/x-ndjson',
      Authorization: `Bearer ${AXIOM_TOKEN}`,
      'User-Agent': 'axiom-cloudflare',
    },
  })
}
