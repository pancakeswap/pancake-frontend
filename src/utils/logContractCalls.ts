import contracts from 'config/constants/contracts'
import { mainnetTokens } from 'config/constants/tokens'
import farmAddresses from 'config/constants/farms'
import pools from 'config/constants/pools'

const mainnetAddressMap = Object.keys(contracts).reduce(
  (result, key) => ({ ...result, [contracts[key][process.env.NEXT_PUBLIC_CHAIN_ID]]: key }),
  {},
)
const mainnetTokenMap = Object.keys(mainnetTokens).reduce(
  (result, key) => ({ ...result, [mainnetTokens[key].address]: key }),
  {},
)
const mainnetFarmMap = farmAddresses.reduce(
  (result, ele) => ({
    ...result,
    [ele.lpAddresses[process.env.NEXT_PUBLIC_CHAIN_ID]]: ele.lpSymbol,
  }),
  {},
)

const mainnetPoolMap = pools.reduce(
  (result, ele) => ({
    ...result,
    [ele.contractAddress[
      process.env.NEXT_PUBLIC_CHAIN_ID
    ]]: `${ele.stakingToken.symbol}-${ele.earningToken.symbol} pool`,
  }),

  {},
)

const addressMap = {
  ...mainnetAddressMap,
  ...mainnetTokenMap,
  ...mainnetFarmMap,
  ...mainnetPoolMap,
}

export default function logContractCalls(label: string, calls: any[]): void {
  // eslint-disable-next-line no-console
  console.groupCollapsed(`${label} - total ${calls?.length}`)

  calls.forEach((call) => {
    const contractName = addressMap[call.address]
    const readableParam = Array.isArray(call.params) ? call.params.map((c) => addressMap[c] || c).join(',') : ''

    if (contractName) {
      console.info(`${contractName}.${call.name}(${readableParam})`)
    } else {
      console.info(`${call.address}.${call.name}(${readableParam})`)
    }
  })

  // eslint-disable-next-line no-console
  console.groupEnd()
}
