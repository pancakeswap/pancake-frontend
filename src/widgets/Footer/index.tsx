import React from "react";
import styled from "styled-components";
import { Link } from "../../components/Link";
import config from "./config";

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 32px;
  a:not(:last-child) {
    margin-bottom: 16px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    a:not(:last-child) {
      margin-bottom: 0;
      margin-right: 32px;
    }
    flex-direction: row;
  }
`;

const Footer: React.FC = () => (
  <StyledFooter>
    {config.map((entry) => {
      return (
        <Link key={entry.href} href={entry.href} external={entry.href.startsWith("http")}>
          {entry.label}
        </Link>
      );
    })}
  </StyledFooter>
);

export default Footer;
