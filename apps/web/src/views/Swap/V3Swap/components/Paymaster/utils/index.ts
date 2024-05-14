export const getEip712Domain = (transaction) => {
  const message = transactionToMessage(transaction as any)

  return {
    domain: {
      name: 'zkSync',
      version: '2',
      chainId: transaction.chainId,
    },
    types: {
      Transaction: [
        { name: 'txType', type: 'uint256' },
        { name: 'from', type: 'uint256' },
        { name: 'to', type: 'uint256' },
        { name: 'gasLimit', type: 'uint256' },
        { name: 'gasPerPubdataByteLimit', type: 'uint256' },
        { name: 'maxFeePerGas', type: 'uint256' },
        { name: 'maxPriorityFeePerGas', type: 'uint256' },
        { name: 'paymaster', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'factoryDeps', type: 'bytes32[]' },
        { name: 'paymasterInput', type: 'bytes' },
      ],
    },
    primaryType: 'Transaction',
    message,
  }
}

function transactionToMessage(transaction: any): any {
  const {
    gas,
    nonce,
    to,
    from,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    factoryDeps,
    paymaster,
    paymasterInput,
    gasPerPubdata,
    data,
  } = transaction

  return {
    txType: 113n,
    from: BigInt(from),
    to: to ? BigInt(to) : 0n,
    gasLimit: gas ?? 0n,
    gasPerPubdataByteLimit: gasPerPubdata ?? 0n,
    maxFeePerGas: maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
    paymaster: paymaster ? BigInt(paymaster) : 0n,
    nonce: nonce ? BigInt(nonce) : 0n,
    value: value ?? 0n,
    data: data || '0x0',
    factoryDeps: factoryDeps ?? [],
    paymasterInput: paymasterInput || '0x0',
  }
}
