import React from "react";
import styled from "styled-components";
import { TokenImageProps } from "./types";
import Image from "./Image";

const StyledTokenImage = styled(Image)`
  &:before {
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.25);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 7;
  }
`;

const TokenImage: React.FC<TokenImageProps> = ({
  tokenAddress,
  baseUrl = "/images/tokens",
  imageFormat = "svg",
  ...props
}) => {
  return <StyledTokenImage src={`${baseUrl}/${tokenAddress}.${imageFormat}`} {...props} />;
};

export default TokenImage;
