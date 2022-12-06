import { CAKE_PID } from 'config/constants'

const isVaultPool = (pool) => pool?.sousId === CAKE_PID

export default isVaultPool
