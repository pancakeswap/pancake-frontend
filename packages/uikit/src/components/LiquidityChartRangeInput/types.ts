import { BigintIsh } from "@pancakeswap/sdk";

export interface ChartEntry {
  activeLiquidity: number;
  price0: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ZoomLevels {
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
}

export interface LiquidityChartRangeInputProps {
  // to distringuish between multiple charts in the DOM
  id?: string;

  data: {
    series: ChartEntry[];
    current: number;
  };
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };

  styles: {
    area: {
      // color of the ticks in range
      selection: string;
    };

    brush: {
      handle: {
        west: string;
        east: string;
      };
    };
  };

  dimensions: Dimensions;
  margins: Margins;

  interactive?: boolean;

  brushLabels: (d: "w" | "e", x: number) => string;
  brushDomain: [number, number] | undefined;
  onBrushDomainChange: (domain: [number, number], mode: string | undefined) => void;

  zoomLevels: ZoomLevels;
  showZoomButtons?: boolean;
}

export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

export interface TickDataRaw {
  tick: string | number;
  liquidityGross: BigintIsh;
  liquidityNet: BigintIsh;
}

// Tick with fields parsed to bigints, and active liquidity computed.
export interface TickProcessed {
  tick: number;
  liquidityActive: bigint;
  liquidityNet: bigint;
  price0: string;
}
