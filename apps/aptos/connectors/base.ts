// dApps can make requests to the wallet from their website:
// - `connect()`: prompts the user to allow connection from the dApp (*neccessary to make other requests*)
// - `isConnected()`: returns if the dApp has established a connection with the wallet
// - `account()`: gets the address of the account signed into the wallet
// - `signAndSubmitTransaction(transaction)`: signs the given transaction and submits to chain
// - `signTransaction(transaction)`: signs the given transaction and returns it to be submitted by the dApp
// - `disconnect()`: Removes connection between dApp and wallet. Useful when the user wants to remove the connection.

export abstract class BaseConnector<Provider = any> {
  atpos?: any

  abstract readonly ready: boolean

  // constructor() {
  //   //
  // }

  abstract connect(): Promise<unknown>

  abstract disconnect(): Promise<void>

  abstract account(): Promise<string>

  abstract signAndSubmitTransaction(transaction?: unknown): Promise<unknown>

  abstract signTransaction(transaction?: unknown): Promise<unknown>

  // abstract getChainId(): Promise<number>;
  // abstract getProvider(config?: {
  //   chainId?: number;
  // }): Promise<Provider>;
  // abstract getSigner(config?: { chainId?: number }): Promise<Signer>;
  abstract isConnected(): Promise<boolean>
}
