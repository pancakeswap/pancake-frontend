import React, { AnchorHTMLAttributes } from "react";
import styled from "styled-components";
import Text, { TextProps } from "../Text";
import OpenNewIcon from "../Svg/Icons/OpenNew";

interface LinkProps extends TextProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

const StyledLink = styled(Text)<LinkProps>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`;

const Link: React.FC<LinkProps> = ({ external, ...props }) => {
  const internalProps = external
    ? {
        target: "_blank",
        rel: "noreferrer noopener",
      }
    : {};
  return <StyledLink as="a" bold {...internalProps} {...props} />;
};

const LinkExternal: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link external {...props}>
      {children}
      <OpenNewIcon color="primary" ml="4px" />
    </Link>
  );
};

export { Link, LinkExternal };
