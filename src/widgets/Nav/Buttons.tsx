import React, { AnchorHTMLAttributes } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Button from "../../components/Button/Button";

const MenuButton = styled(Button)`
  padding: 0 8px;
  border-radius: 8px;
`;
MenuButton.defaultProps = {
  variant: "text",
  size: "sm",
};

const MobileOnlyButton = styled(MenuButton)`
  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

const MenuLink: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href = "", children, ...props }) => {
  return href.startsWith("http") ? (
    <a key={href} className="link" href={href} {...props}>
      {children}
    </a>
  ) : (
    <NavLink key={href} className="link" to={href} {...props}>
      {children}
    </NavLink>
  );
};

export { MobileOnlyButton, MenuButton, MenuLink };
