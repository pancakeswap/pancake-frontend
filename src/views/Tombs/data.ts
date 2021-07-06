import tokens from "config/constants/tokens";

const tableData = [
  {
    id: 1,
    pid: 10,
    name: 'ZMBE-BNB',
    lpAddresses: {
      97: '',
      56: '0x0000000000000000000000000000000000000000',
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
