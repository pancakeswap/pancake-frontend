import styled from "styled-components";
import { Box } from "../Box";
import Container from "../Layouts/Container";
import { PageHeaderProps } from "./types";

const Outer = styled(Box)<{ background?: string }>`
  padding-top: 32px;
  padding-bottom: 32px;
  background: ${({ theme, background }) => background || theme.colors.gradientBubblegum};
`;

const Inner = styled(Container)`
  position: relative;
`;

const PageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
);

export default PageHeader;
