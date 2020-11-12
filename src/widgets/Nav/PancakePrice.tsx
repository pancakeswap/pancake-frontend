import React from "react";
import styled from "styled-components";
import { LogoRoundIcon } from "../../components/Svg";
import Text from "../../components/Text";

const Container = styled.a`
  display: flex;
  align-items: center;
  margin-right: 4px;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const PancakePrice: React.FC<{ cakePriceUsd?: number }> = ({ cakePriceUsd }) => {
  return cakePriceUsd ? (
    <Container href="https://pancakeswap.info/token/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82">
      <LogoRoundIcon mr="4px" />
      <Text bold>{`$${cakePriceUsd.toFixed(3)}`}</Text>
    </Container>
  ) : null;
};

export default PancakePrice;
