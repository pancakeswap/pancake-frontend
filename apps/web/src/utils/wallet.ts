// Set of helper functions to facilitate wallet setup

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  // @ts-ignore
  !window?.ethereum?.isSafePal &&
  // @ts-ignore
  (window?.ethereum?.isMetaMask ||
    // @ts-ignore
    window?.ethereum?.isTrust ||
    // @ts-ignore
    window?.ethereum?.isCoinbaseWallet ||
    // @ts-ignore
    window?.ethereum?.isTokenPocket)
