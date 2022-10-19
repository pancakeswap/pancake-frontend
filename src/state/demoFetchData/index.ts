import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { fetchBalance } from './actions'
import { fetchTokenBlance } from './demoFetchData'

export const GetTokenBalance = (tokenAddress:string, account:string, chainId:number) => {
    const data = useSelector<AppState, AppState['demoRedux']>((state) => state.demoRedux)
    const dataUser = data.balance
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const getTokenBalance = async () => {
            try {
                const result = await fetchTokenBlance(tokenAddress, account, chainId)
                dispatch(fetchBalance(result))
            } catch (e) {
                console.log(e)
            }
        }
        getTokenBalance()
    }, [tokenAddress, account, chainId])
    return [ dataUser ]
}