import React from "react";
import Checkbox from "./index";

export default {
  title: "Checkbox",
  component: Checkbox,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <div>
      <Checkbox />
    </div>
  );
};
