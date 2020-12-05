import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { httpProvider } from 'utils/web3'
import { getBalanceNumber } from '../utils/formatBalance'
import { getTokenBalance } from '../utils/erc20'
import useBlock from './useBlock'

const BUSD_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const CAKE_ADDRESS = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
const LP_BNB_BUSD_ADDRESS = '0x1B96B92314C44b159149f7E0303511fB2Fc4774f'
const LP_CAKE_BNB_ADDRESS = '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6'

export const useBnbPriceUSD = () => {
  const [price, setPrice] = useState(0)
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const busd = await getTokenBalance(httpProvider, BUSD_ADDRESS, LP_BNB_BUSD_ADDRESS)
      const bnb = await getTokenBalance(httpProvider, WBNB_ADDRESS, LP_BNB_BUSD_ADDRESS)
      setPrice(getBalanceNumber(new BigNumber(busd)) / getBalanceNumber(new BigNumber(bnb)))
    }

    fetchBalance()
  }, [block])

  return price
}

export const useCakePriceUSD = () => {
  const [price, setPrice] = useState(0)
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const busd = await getTokenBalance(httpProvider, BUSD_ADDRESS, LP_BNB_BUSD_ADDRESS)
      const bnb0 = await getTokenBalance(httpProvider, WBNB_ADDRESS, LP_BNB_BUSD_ADDRESS)
      const bnbPrice = getBalanceNumber(new BigNumber(busd)) / getBalanceNumber(new BigNumber(bnb0))

      const cake = await getTokenBalance(httpProvider, CAKE_ADDRESS, LP_CAKE_BNB_ADDRESS)
      const bnb1 = await getTokenBalance(httpProvider, WBNB_ADDRESS, LP_CAKE_BNB_ADDRESS)
      const cakebnb = getBalanceNumber(new BigNumber(bnb1)) / getBalanceNumber(new BigNumber(cake))
      const cakePrice = cakebnb * bnbPrice

      setPrice(cakePrice)
    }

    fetchBalance()
  }, [block])

  return price
}
