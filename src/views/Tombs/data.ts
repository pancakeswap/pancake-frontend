import tokens from "config/constants/tokens";

const tableData = [
  {
    id: 1,
    pid: 9,
    name: 'ZMBE-BNB',
    lpAddresses: {
      97: '',
      56: '0x5DB353e774655E76b52EcDE1e938011F60D7d3F3',
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
