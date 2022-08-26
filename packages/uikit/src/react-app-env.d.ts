import type { Ethereum } from "@wagmi/core";

interface Window {
  coin98?: true;
  ethereum?: Ethereum & {
    isSafePal?: true;
    isCoin98?: true;
    isBlocto?: true;
    isMathWallet?: true;
  };
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>;
  };
}
