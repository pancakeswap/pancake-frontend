import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import Wrapper from "./Wrapper";

const TokenPairImage: React.FC<TokenPairImageProps> = ({
  secondaryTokenAddress,
  primaryTokenAddress,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);

  return (
    <Wrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage
        variant={variant}
        tokenAddress={primaryTokenAddress}
        width={width}
        height={height}
        {...primaryImageProps}
      />
      <StyledSecondaryImage
        variant={variant}
        tokenAddress={secondaryTokenAddress}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...secondaryImageProps}
      />
    </Wrapper>
  );
};

export default TokenPairImage;
