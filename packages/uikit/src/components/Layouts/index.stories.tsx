import React from "react";
import styled from "styled-components";
import { BaseLayout, CardsLayout } from ".";

export default {
  title: "Components/Layouts",
  argTypes: {},
};

const Stub = styled.div`
  width: 100%;
  background: #1fc7d4;
  height: 300px;
`;

export const Base: React.FC = () => {
  return (
    <BaseLayout>
      {[...Array(24)].map((value) => (
        <Stub key={value} />
      ))}
    </BaseLayout>
  );
};

export const Cards: React.FC = () => {
  return (
    <CardsLayout>
      {[...Array(10)].map((value) => (
        <Stub key={value} />
      ))}
    </CardsLayout>
  );
};
