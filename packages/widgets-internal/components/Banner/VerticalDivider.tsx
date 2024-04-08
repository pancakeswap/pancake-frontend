import styled from "styled-components";

export const VerticalDivider = styled.span.withConfig({
  shouldForwardProp: (prop) => !["bg", "height"].includes(prop),
})<{
  bg?: string;
  height?: string;
}>`
  background: ${({ bg }) => bg || "rgba(255, 255, 255, 0.2)"};
  width: 1px;
  height: ${({ height }) => height || "20px"};
  margin: auto 8px;
`;
