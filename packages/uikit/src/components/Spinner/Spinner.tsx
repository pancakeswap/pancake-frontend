import React from "react";
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import PancakeIcon from "./PancakeIcon";
import IceCream from "../../img/icecream.png";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`;

const Container = styled.div`
  position: relative;
  height: 200px;
`;

const IceImage = () => {
  return <Image src={IceCream} width="180px" height="180px" />;
};

const RotatingPancakeIcon = styled.div`
  animation: ${rotate} 2s linear infinite;
  transform: translate3d(0, 0, 0);
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Container>
      <RotatingPancakeIcon>
        <IceImage />
      </RotatingPancakeIcon>
    </Container>
  );
};

export default Spinner;
