import {
  InputEntryFunctionData,
  InputGenerateTransactionPayloadData,
  InputMultiSigData,
  InputScriptData,
} from '@aptos-labs/ts-sdk'
import type { Types } from 'aptos'

function isInputEntryFunctionData(data: InputGenerateTransactionPayloadData): data is InputEntryFunctionData {
  return Boolean((data as InputEntryFunctionData).function)
}

function isInputScriptData(data: InputGenerateTransactionPayloadData): data is InputScriptData {
  return Boolean((data as InputScriptData).bytecode)
}

function isInputMultiSigData(data: InputGenerateTransactionPayloadData): data is InputMultiSigData {
  return Boolean((data as InputMultiSigData).multisigAddress)
}

export function convertTransactionPayloadToOldFormat(
  payload?: InputGenerateTransactionPayloadData,
): Types.TransactionPayload | undefined {
  if (!payload) {
    return undefined
  }
  if (isInputMultiSigData(payload)) {
    return {
      type: 'multisig_payload',
      multisig_address: payload.multisigAddress.toString(),
      transaction_payload: {
        arguments: payload.functionArguments,
        function: payload.function,
        type_arguments: payload.typeArguments?.map((a) => a.toString()) || [],
      },
    }
  }

  if (isInputEntryFunctionData(payload)) {
    return {
      type: 'entry_function_payload',
      arguments: payload.functionArguments,
      function: payload.function,
      type_arguments: payload.typeArguments?.map((a) => a.toString()) || [],
    }
  }

  if (isInputScriptData(payload)) {
    return {
      type: '',
      arguments: payload.functionArguments,
      code: {
        bytecode: payload.bytecode.toString(),
      },
      type_arguments: payload.typeArguments?.map((a) => a.toString()) || [],
    }
  }

  throw new Error('Invalid payload data to format')
}
