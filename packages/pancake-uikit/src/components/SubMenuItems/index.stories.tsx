import React from "react";
import { BrowserRouter } from "react-router-dom";
import SubMenuItems from "./SubMenuItems";
import SubMenuItemsMock from "./mock";
import { SubMenuItemsProps } from "./types";

export default {
  title: "Components/Menu/SubMenuItems",
  component: SubMenuItems,
};

const Template: React.FC<SubMenuItemsProps> = (args) => {
  return (
    <BrowserRouter>
      <SubMenuItems {...args} />
    </BrowserRouter>
  );
};

export const Default = Template.bind({});
Default.args = {
  items: SubMenuItemsMock,
};
