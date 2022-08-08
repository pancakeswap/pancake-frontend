import React from "react";
import styled from "styled-components";
import EXTERNAL_LINK_PROPS from "../../util/externalLinkProps";
import Text from "../Text/Text";
import { LinkProps } from "./types";

const StyledLink = styled(Text)<LinkProps>`
  display: flex;
  align-items: center;
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`;

const Link: React.FC<LinkProps> = ({ external, ...props }) => {
  const internalProps = external ? EXTERNAL_LINK_PROPS : {};
  return <StyledLink as="a" bold {...internalProps} {...props} />;
};

/* eslint-disable react/default-props-match-prop-types */
Link.defaultProps = {
  color: "primary",
};

export default Link;
