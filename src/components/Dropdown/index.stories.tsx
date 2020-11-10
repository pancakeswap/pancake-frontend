import React from "react";
import Button from "../Button";
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
        {[...Array(6)].map(() => (
          <div>Content</div>
        ))}
      </Dropdown>
    </div>
  );
};
