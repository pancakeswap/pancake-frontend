export const logTx = ({ account, hash, chainId }: { account: string; hash: string; chainId: number }) => {
  fetch(`/api/_log/${account}/${chainId}/${hash}`)
}
