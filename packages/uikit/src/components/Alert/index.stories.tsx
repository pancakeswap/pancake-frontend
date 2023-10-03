import React from "react";
import { styled } from "styled-components";
import noop from "lodash/noop";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Alert from "./Alert";
import { Text } from "../Text";

const Row = styled.div`
  margin-bottom: 32px;
`;

export default {
  title: "Components/Alert",
  component: Alert,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "400px" }}>
      <Row>
        <Alert title="Info">
          <Text as="p">This is a description</Text>
        </Alert>
      </Row>
      <Row>
        <Alert title="Success" variant="success">
          <Text as="p">This is a description</Text>
        </Alert>
      </Row>
      <Row>
        <Alert title="Warning" variant="warning">
          <Text as="p">This is a description</Text>
        </Alert>
      </Row>
      <Row>
        <Alert title="Danger" variant="danger">
          <Text as="p">This is a description</Text>
        </Alert>
      </Row>
    </div>
  );
};

const handleClick = noop;

export const WithHandler: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "400px" }}>
      <Row>
        <Alert onClick={handleClick} title="Info" />
      </Row>
      <Row>
        <Alert onClick={handleClick} title="Success" variant="success">
          A description of the success alert
        </Alert>
      </Row>
      <Row>
        <Alert onClick={handleClick} title="Danger A Long Title" variant="danger" />
      </Row>
      <Row>
        <Alert onClick={handleClick} title="Warning" variant="warning" />
      </Row>
    </div>
  );
};
