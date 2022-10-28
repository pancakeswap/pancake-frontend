export const logTx = ({ account, hash, chainId }: { account: string; hash: string; chainId: number }) => {
  fetch(`/_log/${account}/${chainId}/${hash}`)
}
