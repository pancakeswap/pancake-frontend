import React from "react";
import { Box } from "../Box";
import { StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import { TokenPairImageProps, variants } from "./types";
import Wrapper from "./Wrapper";

const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primarySrc,
  secondarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);

  return (
    <Box
      as={Wrapper}
      style={{ position: "relative" }}
      // FIXME: polymorphic types
      // @ts-ignore
      $width={width}
      $height={height}
      {...props}
    >
      <StyledPrimaryImage variant={variant} src={primarySrc} width={width} height={height} {...primaryImageProps} />
      <StyledSecondaryImage
        variant={variant}
        src={secondarySrc}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...secondaryImageProps}
      />
    </Box>
  );
};

export default TokenPairImage;
