import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledChainImage, StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import Wrapper from "./Wrapper";

const LegacyTokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primarySrc,
  secondarySrc,
  chainLogoSrc,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  chainImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);

  return (
    <Wrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage variant={variant} src={primarySrc} width={width} height={height} {...primaryImageProps} />
      <StyledSecondaryImage
        variant={variant}
        src={secondarySrc}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...secondaryImageProps}
      />
      {chainLogoSrc ? (
        <StyledChainImage
          variant={variant}
          src={chainLogoSrc}
          width={Math.floor(width / 3)}
          height={Math.floor(height / 3)}
          {...chainImageProps}
        />
      ) : null}
    </Wrapper>
  );
};

export default LegacyTokenPairImage;
