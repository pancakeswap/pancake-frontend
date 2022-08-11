import React from "react";
import { Overlay } from "./Overlay";

export default {
  title: "Components/Overlay",
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return <Overlay />;
};
