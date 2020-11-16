import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

const CardBody = styled.div<SpaceProps>`
  ${space}
`;

CardBody.defaultProps = {
  p: "24px",
};

export default CardBody;
