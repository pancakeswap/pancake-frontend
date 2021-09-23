import { ethers } from 'ethers'

const RPC_URL = process.env.REACT_APP_NODE_BSC

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)

export default null
