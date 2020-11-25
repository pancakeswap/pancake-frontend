import React from "react";
import styled from "styled-components";
import { LogoIcon, AddIcon } from "../Svg";
import Button from "./Button";
import IconButton from "./IconButton";

const Row = styled.div`
  margin-bottom: 32px;

  & > button + button,
  & > a + a {
    margin-left: 16px;
  }
`;

export default {
  title: "Button",
  component: Button,
  argTypes: {},
};

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

export const ButtonLink: React.FC = () => {
  return (
    <>
      <Row>
        <Button as="a">Primary</Button>
        <Button as="a" disabled>
          Disabled
        </Button>
        <Button as="a" size="sm">
          Small
        </Button>
      </Row>
      <Row>
        <Button as="a" variant="secondary">
          Secondary
        </Button>
        <Button as="a" variant="secondary" disabled>
          Disabled
        </Button>
        <Button as="a" variant="secondary" size="sm">
          Small
        </Button>
      </Row>
      <Row>
        <Button as="a" variant="tertiary">
          Tertiary
        </Button>
        <Button as="a" variant="tertiary" disabled>
          Disabled
        </Button>
        <Button as="a" variant="tertiary" size="sm">
          Small
        </Button>
      </Row>
      <Row>
        <Button as="a" variant="text">
          Text
        </Button>
        <Button as="a" variant="text" disabled>
          Disabled
        </Button>
        <Button as="a" variant="text" size="sm">
          Small
        </Button>
      </Row>
    </>
  );
};

export const WithProps: React.FC = () => {
  return (
    <Row>
      <Button fullWidth>Full size</Button>
    </Row>
  );
};

export const WithIcon: React.FC = () => {
  return (
    <Row>
      <Button startIcon={<LogoIcon />}>Start Icon</Button>
      <Button endIcon={<LogoIcon />}>End Icon</Button>
      <Button startIcon={<LogoIcon />} endIcon={<LogoIcon />}>
        Start & End Icon
      </Button>
    </Row>
  );
};

export const Icons: React.FC = () => {
  return (
    <>
      <Row>
        <IconButton>
          <LogoIcon />
        </IconButton>
        <IconButton>
          <AddIcon />
        </IconButton>
      </Row>
      <Row>
        <IconButton size="sm">
          <LogoIcon />
        </IconButton>
        <IconButton size="sm">
          <AddIcon />
        </IconButton>
      </Row>
    </>
  );
};
