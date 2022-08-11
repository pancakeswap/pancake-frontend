import React from "react";
import FallingBunnies from "./FallingBunnies";

export default {
  title: "Components/FallingBunnies",
  component: FallingBunnies,
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return <FallingBunnies />;
};
