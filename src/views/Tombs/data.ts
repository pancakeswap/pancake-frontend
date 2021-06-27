import tokens from "config/constants/tokens";

const tableData = [
  {
    id: 1,
    pid: 9,
    name: 'ZMBE-BNB',
    lpAddresses: {
      97: '',
      56: '0x7e317BB3d3c4bE716378F9268aD0629C30D68DA1',
    },
    token: tokens.zmbe,
    quoteToken: tokens.wbnb,
    withdrawalCooldown: '3 days',
    stakingToken: undefined,
    result: {
      tokenWithdrawalDate: '0',
      amount: '0',
    },
    poolInfo: {
      minimumStake : "0"
    },
    pendingZombie: '0',
  },
]

export default tableData;
