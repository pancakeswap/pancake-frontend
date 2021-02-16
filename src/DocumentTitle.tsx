import React from 'react'
import useTitle from 'react-use/lib/useTitle'
import { usePriceCakeBusd } from './state/hooks'

const DocumentTitle = ({ title, showPrice = true }) => {
  const documentTitle = []

  // Append price if enabled
  const cakePriceUsd = usePriceCakeBusd()
  if (showPrice) {
    documentTitle.push(`$${cakePriceUsd.toFixed(3)}`)
  }

  // Append title
  documentTitle.push(title)

  useTitle(documentTitle.join(' - '))
  return null
}

export default DocumentTitle
