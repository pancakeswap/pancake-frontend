import React from "react";
import Wrapper from "./Wrapper";
import { StyledBadgeImage, StyledPrimaryImage } from "./styles";
import { TokenWithBadgeImageProps, variants } from "./types";

const TokenImageWithBadge: React.FC<React.PropsWithChildren<TokenWithBadgeImageProps>> = ({
  primarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  badgeImageProps = {},
  chainId,
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);
  const networkBadgeRsc = `https://assets.pancakeswap.finance/web/chains/${chainId}.png`;
  return (
    <Wrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage variant={variant} src={primarySrc} width={width} height={height} {...primaryImageProps} />
      <StyledBadgeImage
        variant={variant}
        src={networkBadgeRsc}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...badgeImageProps}
      />
    </Wrapper>
  );
};

export default TokenImageWithBadge;
