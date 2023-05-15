import type { WindowProvider } from "wagmi/window";

interface Window {
  coin98?: true;
  ethereum?: WindowProvider & {
    isSafePal?: true;
    isCoin98?: true;
    isBlocto?: true;
    isMathWallet?: true;
  };
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>;
  };
}
