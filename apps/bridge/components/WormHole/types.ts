export enum WidgetEnvs {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}

export type Env = keyof typeof WidgetEnvs
