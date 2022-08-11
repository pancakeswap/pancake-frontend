import React from "react";
import Spinner from "./Spinner";

export default {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {},
};

export const Default: React.FC<{ children: React.ReactNode }> = () => {
  return <Spinner size={50} />;
};
