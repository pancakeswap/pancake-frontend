import React from "react";
import Button from "../Button/Button";
import Dropdown from "./index";

export default {
  title: "Dropdown",
  component: Dropdown,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <div>
      <Dropdown target={<Button>Hover</Button>}>
        {[...Array(30)].map(() => (
          <div>Content</div>
        ))}
      </Dropdown>
    </div>
  );
};
