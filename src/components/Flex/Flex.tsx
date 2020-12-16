import styled from "styled-components";
import { flexbox, space } from "styled-system";
import { FlexProps } from "./types";

const Flex = styled.div<FlexProps>`
  display: flex;
  ${flexbox}
  ${space}
`;

export default Flex;
