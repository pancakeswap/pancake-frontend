import { ReactNode } from "react";
import BigNumber from "bignumber.js";
import { Token } from "@pancakeswap/sdk";

export interface FarmTableEarnedProps {
  earnings: number;
  pid: number;
}

export interface FarmTableLiquidityProps {
  liquidity: BigNumber;
}

export interface FarmTableMultiplierProps {
  multiplier: string;
  rewardCakePerSecond?: boolean;
}

export interface FarmTableFarmTokenInfoProps {
  label: string;
  pid: number;
  token: Token;
  quoteToken: Token;
  isReady: boolean;
  isStable?: boolean;
  stakedBalance?: BigNumber;
  children?: ReactNode;
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
    label: "Liquidity",
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
