import { ReactNode } from "react";
import BigNumber from "bignumber.js";
import { Token } from "@pancakeswap/sdk";

export interface FarmTableEarnedProps {
  earnings: number;
  pid: number;
}

export interface FarmTableAmountProps {
  amount: number;
}

export interface FarmTableLiquidityProps {
  liquidity: BigNumber;
  updatedAt?: number;
  inactive?: boolean;
}

export interface FarmTableMultiplierProps {
  multiplier: string;
  rewardCakePerSecond?: boolean;
  farmCakePerSecond?: string;
  totalMultipliers?: string;
}

export interface FarmTableFarmTokenInfoProps {
  label: string;
  pid: number;
  token: Token;
  quoteToken: Token;
  isReady: boolean;
  isStaking?: boolean;
  children?: ReactNode;
  isCommunity?: boolean;
}

export type ColumnsDefTypes = {
  id: number;
  label: string;
  name: string;
  sortable: boolean;
};

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    sortable: true,
    label: "",
  },
  {
    id: 2,
    name: "earned",
    sortable: true,
    label: "Earned",
  },
  {
    id: 3,
    name: "apr",
    sortable: true,
    label: "APR",
  },
  {
    id: 6,
    name: "details",
    sortable: true,
    label: "",
  },
];

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    sortable: true,
    label: "",
  },
  {
    id: 2,
    name: "type",
    sortable: false,
    label: "",
  },
  {
    id: 3,
    name: "earned",
    sortable: true,
    label: "Earned",
  },
  {
    id: 4,
    name: "apr",
    sortable: true,
    label: "APR",
  },
  {
    id: 5,
    name: "liquidity",
    sortable: true,
    label: "Staked Liquidity",
  },
  {
    id: 6,
    name: "multiplier",
    sortable: true,
    label: "Multiplier",
  },
  {
    id: 7,
    name: "details",
    sortable: true,
    label: "",
  },
];

export const V3DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    sortable: true,
    label: "",
  },
  {
    id: 2,
    name: "type",
    sortable: false,
    label: "",
  },
  {
    id: 3,
    name: "earned",
    sortable: true,
    label: "Earned",
  },
  {
    id: 4,
    name: "apr",
    sortable: true,
    label: "APR",
  },
  {
    id: 5,
    name: "stakedLiquidity",
    sortable: true,
    label: "Staked Liquidity",
  },
  {
    id: 6,
    name: "multiplier",
    sortable: true,
    label: "Multiplier",
  },
  {
    id: 7,
    name: "availableLp",
    sortable: false,
    label: "Available",
  },
  {
    id: 8,
    name: "stakedLp",
    sortable: false,
    label: "Staked",
  },
  {
    id: 7,
    name: "details",
    sortable: true,
    label: "",
  },
];
