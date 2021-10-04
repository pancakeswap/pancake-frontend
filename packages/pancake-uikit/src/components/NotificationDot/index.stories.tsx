import React, { useState } from "react";
import styled from "styled-components";
import NotificationDot from "./NotificationDot";
import Button from "../Button/Button";
import ButtonMenu from "../ButtonMenu/ButtonMenu";
import ButtonMenuItem from "../ButtonMenu/ButtonMenuItem";

export default {
  title: "Components/NotificationDot",
  component: NotificationDot,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <>
      <NotificationDot show>
        <Button>Hi</Button>
      </NotificationDot>
      <NotificationDot show color="warning">
        <Button>Hi</Button>
      </NotificationDot>
      <NotificationDot show color="success">
        <Button>Hi</Button>
      </NotificationDot>
    </>
  );
};

const Row = styled.div`
  & > * + * {
    margin-left: 16px;
  }
`;

export const MenuButtons: React.FC = () => {
  const [index, setIndex] = useState(0);
  const handleClick = (newIndex) => setIndex(newIndex);
  return (
    <Row>
      <ButtonMenu activeIndex={index} onItemClick={handleClick}>
        <NotificationDot show={index === 0}>
          <ButtonMenuItem>Button 1</ButtonMenuItem>
        </NotificationDot>
        <NotificationDot show={index === 1}>
          <ButtonMenuItem>Button 2</ButtonMenuItem>
        </NotificationDot>
        <NotificationDot show={index === 2}>
          <ButtonMenuItem>Button 3</ButtonMenuItem>
        </NotificationDot>
        <NotificationDot show={index === 3}>
          <ButtonMenuItem>Button 4</ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Row>
  );
};
