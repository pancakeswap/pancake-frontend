import Web3 from 'web3'

export default function getLibrary(provider: any) {
  return new Web3(provider)
}
