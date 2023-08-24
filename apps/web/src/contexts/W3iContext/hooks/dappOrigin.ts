import { useState } from 'react'

export const useDappOrigin = () => {
  const query = new URLSearchParams(window.location.search)
  const dappOriginQuery = query.get('dappOrigin')
  const dappNameQuery = query.get('dappName')
  const dappIconQuery = query.get('dappIcon')
  const dappNotificationDescriptionQuery = query.get('dappNotificationDescription')

  const [dappOrigin] = useState<string>(dappOriginQuery ?? '')
  const [dappName] = useState<string>(dappNameQuery ?? '')
  const [dappIcon] = useState<string>(dappIconQuery ?? '')
  const [dappNotificationDescription] = useState<string>(dappNotificationDescriptionQuery ?? '')

  // When initializing from a dapp/widget origin, we inject an external stylesheet to...
  if (dappOrigin) {
    const cssId = 'web3inbox-external-style'
    const doc = document
    const head = doc.getElementsByTagName('head')[0]
    const link = doc.createElement('link')
    link.id = cssId
    link.rel = 'stylesheet'
    link.type = 'text/css'

    link.href = `${dappOrigin}/web3inbox.css`
    link.media = 'all'
    head.appendChild(link)
  }

  return { dappOrigin, dappName, dappIcon, dappNotificationDescription }
}
