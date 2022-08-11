import React, { useState } from "react";
import styled from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Box from "../Box/Box";
import ButtonMenu from "./ButtonMenu";
import ButtonMenuItem from "./ButtonMenuItem";

const Row = styled.div`
  margin-bottom: 32px;

  & > button + button {
    margin-left: 16px;
  }
`;

export default {
  title: "Components/Button Menu",
  component: ButtonMenu,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [index, setIndex] = useState(0);
  const [index1, setIndex1] = useState(1);

  const handleClick = (newIndex) => setIndex(newIndex);
  const handleClick1 = (newIndex) => setIndex1(newIndex);

  return (
    <>
      <Row>
        <ButtonMenu activeIndex={index} onItemClick={handleClick}>
          <ButtonMenuItem>Button 1</ButtonMenuItem>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
      <Row>
        <ButtonMenu activeIndex={index1} onItemClick={handleClick1} scale="sm" ml="24px">
          <ButtonMenuItem>Button 1</ButtonMenuItem>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
      <Row>
        <ButtonMenu activeIndex={index} onItemClick={handleClick} variant="subtle">
          <ButtonMenuItem>Button 1</ButtonMenuItem>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
      <Row>
        <ButtonMenu activeIndex={index1} onItemClick={handleClick1} scale="sm" variant="subtle" ml="24px">
          <ButtonMenuItem>Button 1</ButtonMenuItem>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
    </>
  );
};

export const AsLinks: React.FC<React.PropsWithChildren> = () => {
  return (
    <Row>
      <ButtonMenu activeIndex={0}>
        <ButtonMenuItem as="a" href="https://pancakeswap.finance">
          Link 1
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href="https://pancakeswap.finance">
          Link 2
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href="https://pancakeswap.finance">
          Link 3
        </ButtonMenuItem>
      </ButtonMenu>
    </Row>
  );
};

export const DisabledMenu: React.FC<React.PropsWithChildren> = () => {
  const [index, setIndex] = useState(0);
  const [index1, setIndex1] = useState(1);

  const handleClick = (newIndex) => setIndex(newIndex);
  const handleClick1 = (newIndex) => setIndex1(newIndex);
  return (
    <>
      <Row>
        <ButtonMenu activeIndex={index} onItemClick={handleClick}>
          <ButtonMenuItem>Button 1</ButtonMenuItem>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
      <Row>
        <ButtonMenu disabled activeIndex={index} onItemClick={handleClick}>
          <ButtonMenuItem>Disabled 1</ButtonMenuItem>
          <ButtonMenuItem>Disabled 2</ButtonMenuItem>
          <ButtonMenuItem>Disabled 3</ButtonMenuItem>
          <ButtonMenuItem>Disabled 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
      <Row>
        <ButtonMenu activeIndex={index1} onItemClick={handleClick1} scale="sm" variant="subtle" ml="24px">
          <ButtonMenuItem>Button 1</ButtonMenuItem>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
      <Row>
        <ButtonMenu disabled activeIndex={index1} onItemClick={handleClick1} scale="sm" variant="subtle" ml="24px">
          <ButtonMenuItem>Disabled 1</ButtonMenuItem>
          <ButtonMenuItem>Disabled 2</ButtonMenuItem>
          <ButtonMenuItem>Disabled 3</ButtonMenuItem>
          <ButtonMenuItem>Disabled 4</ButtonMenuItem>
        </ButtonMenu>
      </Row>
    </>
  );
};

export const FullWidthMenu: React.FC<React.PropsWithChildren> = () => {
  const [index, setIndex] = useState(0);

  const handleClick = (newIndex: number) => setIndex(newIndex);

  return (
    <Box width="840px">
      <ButtonMenu activeIndex={index} onItemClick={handleClick} fullWidth mb="24px">
        <ButtonMenuItem>Button 1</ButtonMenuItem>
        <ButtonMenuItem>Button 2</ButtonMenuItem>
        <ButtonMenuItem>Button 3</ButtonMenuItem>
        <ButtonMenuItem>Button 4</ButtonMenuItem>
      </ButtonMenu>
      <ButtonMenu activeIndex={index} fullWidth scale="sm" variant="subtle">
        <ButtonMenuItem as="a" href="https://pancakeswap.finance">
          Link 1
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href="https://pancakeswap.finance">
          Link 2
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href="https://pancakeswap.finance">
          Link 3
        </ButtonMenuItem>
      </ButtonMenu>
    </Box>
  );
};
