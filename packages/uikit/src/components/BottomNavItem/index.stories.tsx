import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter } from "react-router-dom";
import { Flex } from "../Box";
import BottomNavItem from "./BottomNavItem";
import { BottomNavItemProps } from "./types";
import { SwapIcon, SwapFillIcon } from "../Svg";

export default {
  title: "Components/Menu/BottomNavItem",
  component: BottomNavItem,
};

const Template: React.FC<BottomNavItemProps> = ({ ...args }) => {
  return (
    <BrowserRouter>
      <Flex p="10px">
        <BottomNavItem {...args} />
      </Flex>
    </BrowserRouter>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Trade",
  href: "/",
  icon: SwapIcon,
  fillIcon: SwapFillIcon,
  isActive: false,
};
