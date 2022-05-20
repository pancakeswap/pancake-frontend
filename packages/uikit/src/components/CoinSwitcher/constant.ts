const IPFS_PATH = `https://pancake.mypinata.cloud/ipfs/QmQzMibRWDRBNagWHj5gULTZEtrtfAsiH3AzzDaAK15bsX/`;

export const BNB2CAKE_PATH = `${IPFS_PATH}1%20-bnbcake/bnb2cake-`;
export const BNB2CAKE_COUNTS = 31;

export const CAKE2BNB_PATH = `${IPFS_PATH}2-cakebnb/cake2bnb-`;
export const CAKE2BNB_COUNTS = 31;

export const BNB_ONCE_PATH = `${IPFS_PATH}3-bnbonce/bnb-once-`;
export const BNB_ONCE_COUNTS = 60;

export const CAKE_ONCE_PATH = `${IPFS_PATH}4-cakeonce/cake-once00`;
export const CAKE_ONCE_COUNTS = 60;

export const BNB_LOOP_PATH = `${IPFS_PATH}5-bnbloop/bnb-loop-00`;
export const BNB_LOOP_COUNTS = 31;

export const CAKE_LOOP_PATH = `${IPFS_PATH}6-cakeloop/cake-loop00`;
export const CAKE_LOOP_COUNTS = 31;

export const FILE_TYPE = `.png`;

const pathGenerator = (path: string) => (d: string, index: number) => {
  if (index < 10) return `${path}0${index}${FILE_TYPE}`;
  return `${path}${index}${FILE_TYPE}`;
};

export const bnb2CakeImages = () => {
  let result: string[] = new Array(BNB2CAKE_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(BNB2CAKE_PATH));
  return result;
};

export const cake2BnbImages = () => {
  let result: string[] = new Array(CAKE2BNB_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(CAKE2BNB_PATH));
  return result;
};

export const bnbLoopImages = () => {
  let result: string[] = new Array(BNB_LOOP_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(BNB_LOOP_PATH));
  return result;
};

export const cakeLoopImages = () => {
  let result: string[] = new Array(CAKE_LOOP_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(CAKE_LOOP_PATH));
  return result;
};

export const bnbOnceImages = () => {
  let result: string[] = new Array(BNB_ONCE_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(BNB_ONCE_PATH));
  return result;
};

export const cakeOnceImages = () => {
  let result: string[] = new Array(CAKE_ONCE_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(CAKE_ONCE_PATH));
  return result;
};
