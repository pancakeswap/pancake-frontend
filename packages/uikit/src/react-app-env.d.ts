interface Window {
  coin98?: true;
  ethereum?: {
    isMetaMask?: true;
    isOpera?: true;
    isBraveWallet?: true;
    isTokenPocket?: true;
    isCoinbaseWallet?: true;
    isSafePal?: true;
    isTrust?: true;
    isCoin98?: true;
    isBlocto?: true;
    isMathWallet?: true;
    providers?: any[];
    request?: (...args: any[]) => Promise<void>;
  };
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>;
  };
}
