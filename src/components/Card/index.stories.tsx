import React from "react";
import styled from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Card from "./index";

const Row = styled.div`
  margin-bottom: 32px;

  & > button + button {
    margin-left: 16px;
  }
`;

export default {
  title: "Card",
  component: Card,
  argTypes: {},
} as Meta;

export const Default: React.FC = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Row>
        <Card>Card</Card>
      </Row>
      <Row>
        <Card isActive>Active Card</Card>
      </Row>
      <Row>
        <Card isSuccess>Success Card</Card>
      </Row>
      <Row>
        <Card isWarning>Warning Card</Card>
      </Row>
    </div>
  );
};
