import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter } from "react-router-dom";
import { Text } from "../Text";
import { MotionTabMenu } from "./MotionTabMenu";
import { MotionTabMenuProps } from "./types";

export default {
  title: "Components/MotionTabMenu",
  component: MotionTabMenu,
};

const Template: React.FC<React.PropsWithChildren<MotionTabMenuProps>> = ({ children, ...args }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <BrowserRouter>
      <div style={{ padding: "10px" }}>
        <Text mb="12px" small>
          The underline shifting animation using framer motion is not working in this storybook, but will work when used
        </Text>
        <MotionTabMenu {...args} activeIndex={activeIndex} onItemClick={setActiveIndex} animateOnMobile>
          {children}
        </MotionTabMenu>
      </div>
    </BrowserRouter>
  );
};

export const Default = Template.bind({});

const TabItems = [
  {
    id: "Trade",
    label: "Trade",
  },
  {
    id: "Liquidity",
    label: "Liquidity",
  },
  {
    id: "Pool",
    label: "Pool",
  },
];

Default.args = {
  children: TabItems.map((tab) => <Text key={tab.id}>{tab.label}</Text>),
};
