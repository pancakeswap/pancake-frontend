import React from "react";
import FallingBunnies from "./FallingBunnies";

export default {
  title: "Components/FallingBunnies",
  component: FallingBunnies,
  argTypes: {},
};

export const Default: React.FC<{ children: React.ReactNode }> = () => {
  return <FallingBunnies />;
};
