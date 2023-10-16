import { decodeFunctionData, Hex, decodeAbiParameters, ParseAbiParameters } from 'viem'
import { UniversalRouterABI } from '../../src/abis/UniversalRouter'
import { ABI_PARAMETER, CommandType } from '../../src/utils/routerCommands'

export type DecodedCommand = {
  command: string
  args: {
    type: string
    name: string
    value: unknown
  }[]
}

export function decodeUniversalCalldata(calldata: Hex): DecodedCommand[] {
  const { functionName, args } = decodeFunctionData({
    abi: UniversalRouterABI,
    data: calldata,
  })
  if (functionName !== 'execute') throw RangeError(`Invalid function called: ${functionName}, support 'execute' only`)

  const commands =
    args[0]
      .toString()
      .match(/../g)
      ?.splice(1)
      .map((str) => BigInt(`0x${str}`).toString()) ?? []

  const decoded: DecodedCommand[] = []

  for (const [index, command] of Object.entries(commands)) {
    // @ts-expect-error do not check this
    const abi: ParseAbiParameters<string> = ABI_PARAMETER[command]

    // @ts-expect-error do not check this
    const commandName = CommandType[command]

    const parameters = decodeAbiParameters(abi, args[1][Number(index)])

    const formatedArgs: DecodedCommand['args'] = []

    for (const [i, p] of Object.entries(abi)) {
      formatedArgs.push({
        type: p.type,
        name: p.name!,
        value: parameters[Number(i)],
      })
    }

    decoded.push({
      command: commandName,
      args: formatedArgs,
    })
  }

  return decoded
}
