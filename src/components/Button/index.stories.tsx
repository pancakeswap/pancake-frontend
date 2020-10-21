import React from "react";
import styled from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Button from "./index";

const Row = styled.div`
  margin-bottom: 32px;

  & > button + button {
    margin-left: 16px;
  }
`;

export default {
  title: "Button",
  component: Button,
  argTypes: {},
} as Meta;

export const Default: React.FC = () => {
  return (
    <>
      <Row>
        <Button>Primary</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
      </Row>
      <Row>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" size="sm">
          Small
        </Button>
      </Row>
      <Row>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="tertiary" disabled>
          Disabled
        </Button>
        <Button variant="tertiary" size="sm">
          Small
        </Button>
      </Row>
      <Row>
        <Button variant="text">Text</Button>
        <Button variant="text" disabled>
          Disabled
        </Button>
        <Button variant="text" size="sm">
          Small
        </Button>
      </Row>
    </>
  );
};

const StartIcon = () => (
  <span role="img" aria-label="cake" style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
    🥞
  </span>
);
const EndIcon = () => (
  <span role="img" aria-label="cake" style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
    🍳
  </span>
);
export const WithIcon: React.FC = () => {
  return (
    <>
      <Row>
        <Button startIcon={<StartIcon />}>Start Icon</Button>
        <Button endIcon={<EndIcon />}>End Icon</Button>
        <Button startIcon={<StartIcon />} endIcon={<EndIcon />}>
          Start & End Icon
        </Button>
      </Row>
    </>
  );
};
