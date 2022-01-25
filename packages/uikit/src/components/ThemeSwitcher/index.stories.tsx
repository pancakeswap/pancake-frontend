import React from "react";
import { noop } from "lodash";
import { Flex } from "../Box";
import { ThemeSwitcher, ThemeSwitcherProps } from ".";

export default {
  title: "Components/ThemeSwitcher",
  component: ThemeSwitcher,
};

const Template: React.FC<ThemeSwitcherProps> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <ThemeSwitcher {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  toggleTheme: noop,
  isDark: false,
};
