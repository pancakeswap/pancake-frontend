import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { SpinnerProps } from "./types";

const Container = styled.div`
  position: relative;
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Container>
      <Image
        width={size}
        height={size * 1.197}
        src="https://pancakeswap.finance/images/pancake-3d-spinner.gif"
        alt="pancake-3d-spinner"
      />
    </Container>
  );
};

export default Spinner;
