import styled from "styled-components";
import { space } from "styled-system";
import { ContainerProps } from "./types";

const Wrapper = styled.div<ContainerProps>`
  position: relative;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: ${({ height, responsive }) => (responsive ? 0 : height)}px;
  max-width: ${({ width }) => width}px;
  max-height: ${({ height }) => height}px;
  width: 100%;
  padding-top: ${({ width, height, responsive }) => (responsive ? (height / width) * 100 : 0)}%;
  ${space}
`;

export default Wrapper;
