import Image from "next/image";
import { memo } from "react";
import { HelpIcon } from "@pancakeswap/uikit";

export const ChainLogo = memo(
  ({ chainId, width = 24, height = 24 }: { chainId?: number; width?: number; height?: number }) => {
    if (chainId) {
      return (
        <Image
          alt={`chain-${chainId}`}
          style={{ maxHeight: `${height}px` }}
          src={`https://assets.pancakeswap.finance/web/chains/${chainId}.png`}
          width={width}
          height={height}
          unoptimized
        />
      );
    }
    return <HelpIcon width={width} height={height} />;
  }
);
