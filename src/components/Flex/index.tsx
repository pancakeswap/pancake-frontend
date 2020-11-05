import styled from "styled-components";
import { flexbox, space, FlexboxProps, SpaceProps } from "styled-system";

export interface Props extends FlexboxProps, SpaceProps {}

const Flex = styled.div<Props>`
  display: flex;
  ${flexbox}
  ${space}
`;

export default Flex;
