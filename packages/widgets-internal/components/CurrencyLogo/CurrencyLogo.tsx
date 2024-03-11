import { Currency } from "@pancakeswap/sdk";
import { ChainId } from "@pancakeswap/chains";
import { useMemo } from "react";
import { styled } from "styled-components";
import { space, SpaceProps } from "styled-system";
import { useHttpLocations } from "@pancakeswap/hooks";
import { TokenLogo, BinanceIcon, AceIcon } from "@pancakeswap/uikit";

import { getCurrencyLogoUrls, getTokenLogoURL } from "./utils";

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;

  ${space}
`;

export function CurrencyLogo({
  currency,
  size = "24px",
  style,
  useTrustWalletUrl,
  ...props
}: {
  currency?: Currency & {
    logoURI?: string | undefined;
  };
  size?: string;
  style?: React.CSSProperties;
  useTrustWalletUrl?: boolean;
} & SpaceProps) {
  const uriLocations = useHttpLocations(currency?.logoURI);

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return [];

    if (currency?.isToken) {
      const logoUrls = getCurrencyLogoUrls(currency, { useTrustWallet: useTrustWalletUrl });

      if (currency?.logoURI) {
        return [...uriLocations, ...logoUrls];
      }
      return [...logoUrls];
    }
    return [];
  }, [currency, uriLocations, useTrustWalletUrl]);

  if (currency?.isNative) {
    if (currency.chainId === ChainId.ENDURANCE) {
      return <AceIcon width={size} style={style} {...props} />;
    }
  }

  console.log(srcs);

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? "token"} logo`} style={style} {...props} />;
}
