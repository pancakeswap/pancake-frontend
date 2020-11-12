import React from "react";
import styled from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import CardRibbon from "./CardRibbon";
import Card from "./Card";

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

export const Ribbon: React.FC = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Row>
        <Card ribbon={<CardRibbon text="Ribbon" />}>
          <div style={{ height: "200px" }}>Card with Ribbon</div>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="textDisabled" text="Ribbon with Long Text" />}>
          <div style={{ height: "150px" }}>Ribbons will truncate when text is too long</div>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="success" text="Success" />}>
          <div style={{ height: "200px" }}>Card</div>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="failure" text="Failure" />}>
          <div style={{ height: "200px" }}>Any Color in the theme</div>
        </Card>
      </Row>
    </div>
  );
};
