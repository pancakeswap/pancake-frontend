import React from "react";
import styled from "styled-components";
import ColorBox from "./index";

const Row = styled.div`
  margin-bottom: 32px;

  & > button + button {
    margin-left: 16px;
  }
`;

export default {
  title: "ColorBox",
  component: ColorBox,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Row>
        <ColorBox>ColorBox</ColorBox>
      </Row>
    </div>
  );
};
