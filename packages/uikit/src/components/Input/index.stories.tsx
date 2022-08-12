import React from "react";
import styled from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Search from "../Svg/Icons/Search";
import StarFill from "../Svg/Icons/StarFill";
import Heading from "../Heading/Heading";
import Input from "./Input";
import InputGroup from "./InputGroup";
import { scales } from "./types";
import Box from "../Box/Box";

const Row = styled.div`
  display: flex;
  margin-bottom: 32px;

  & > input + input {
    margin-left: 16px;
  }
`;

export default {
  title: "Components/Input",
  component: Input,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      {Object.keys(scales).map((key) => (
        <>
          <Heading mb="16px">{key}</Heading>
          <Row>
            <Input type="text" scale={scales[key]} value="Value" />
            <Input type="text" scale={scales[key]} placeholder="Placeholder..." />
            <Input type="text" scale={scales[key]} value="Disabled" disabled />
            <Input type="text" scale={scales[key]} value="Success" isSuccess />
            <Input type="text" scale={scales[key]} value="Warning" isWarning />
          </Row>
        </>
      ))}
    </div>
  );
};

export const Icons: React.FC<React.PropsWithChildren> = () => {
  return (
    <Box width="300px">
      <InputGroup startIcon={<Search width="18px" />} endIcon={<StarFill width="18px" />} mb="24px" scale="sm">
        <Input type="text" value="Input Group" />
      </InputGroup>
      <InputGroup startIcon={<Search width="24px" />} endIcon={<StarFill width="24px" />} mb="24px" scale="md">
        <Input type="text" value="Input Group" />
      </InputGroup>
      <InputGroup startIcon={<Search width="32px" />} endIcon={<StarFill width="32px" />} mb="24px" scale="lg">
        <Input type="text" value="Input Group" />
      </InputGroup>
    </Box>
  );
};
