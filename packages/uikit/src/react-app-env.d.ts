interface Window {
  ethereum?: {
    isMetaMask?: true;
    isOpera?: true;
    isCoinbaseWallet?: true;
    isTrust?: true;
    // @ts-ignore
    isSafePal?: true;
    providers?: any[];
    request?: (...args: any[]) => Promise<void>;
  };
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>;
  };
}
