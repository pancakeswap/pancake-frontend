
import {useEffect} from 'react'
import {usePriceCakeBusd } from 'state/hooks'

const usePriceUsd = () => {
    const cakePriceUsd = usePriceCakeBusd()
    useEffect(() => {
    document.title = `PancakeSwap - $${Number(cakePriceUsd).toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3})}`
    }, [cakePriceUsd])
    return null
}

export default usePriceUsd