import React from "react";
import styled from "styled-components";
import { space } from "styled-system";
import { WrapperProps } from "./types";

const StyledWrapper = styled.div.attrs<WrapperProps, { $width: number; $height: number } & WrapperProps>(
  ({ width, height }) => ({
    $width: width,
    $height: height,
    width,
    height,
  })
)`
  max-height: ${({ $height }) => $height}px;
  max-width: ${({ $width }) => $width}px;
  position: relative;
  width: 100%;

  &:after {
    content: "";
    display: block;
    padding-top: ${({ $width, $height }) => ($height / $width) * 100}%;
  }

  ${space}
`;

const Wrapper = StyledWrapper;

export default Wrapper;
