import { useEffect } from 'react'
import { usePriceCakeBusd } from 'state/hooks'

const useGetDocumentTitlePrice = () => {
  const cakePriceUsdNumber = usePriceCakeBusd().toNumber()

  const cakePriceUsdString = Number.isNaN(cakePriceUsdNumber)
    ? ''
    : ` - $${cakePriceUsdNumber.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`

  useEffect(() => {
    document.title = `PancakeSwap${cakePriceUsdString}`
  })
}
export default useGetDocumentTitlePrice
