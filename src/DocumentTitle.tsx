import { usePriceCakeBusd } from './state/hooks'

const DocumentTitle = ({ title, showPrice = true }) => {
  const documentTitlePrice = []

  const cakePriceUsd = usePriceCakeBusd()

  if (showPrice) {
    documentTitlePrice.push(title)
    documentTitlePrice.push(`$${cakePriceUsd.toFixed(3)}`)
    document.title = documentTitlePrice.join(' - ')
  }

  return null
}

export default DocumentTitle
