import React from "react";
import styled from "styled-components";
import noop from "lodash/noop";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Alert from "./Alert";

const Row = styled.div`
  margin-bottom: 32px;
`;

export default {
  title: "Components/Alert",
  component: Alert,
  argTypes: {},
} as Meta;

export const Default: React.FC = () => {
  return (
    <div style={{ padding: "32px", width: "375px" }}>
      <Row>
        <Alert title="Info" description="A description of the info alert" />
      </Row>
      <Row>
        <Alert title="Success" description="A description of the success alert" variant="success" />
      </Row>
      <Row>
        <Alert title="Danger" description="A description of the danger alert" variant="danger" />
      </Row>
      <Row>
        <Alert title="Warning" description="A description of the warning alert" variant="warning" />
      </Row>
    </div>
  );
};

const handleClick = noop;

export const WithHandler: React.FC = () => {
  return (
    <div style={{ padding: "32px", width: "375px" }}>
      <Row>
        <Alert onClick={handleClick} title="Info" />
      </Row>
      <Row>
        <Alert onClick={handleClick} title="Success" variant="success" />
      </Row>
      <Row>
        <Alert onClick={handleClick} title="Danger" variant="danger" />
      </Row>
      <Row>
        <Alert onClick={handleClick} title="Warning" variant="warning" />
      </Row>
    </div>
  );
};
