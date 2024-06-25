import React from "react";
import { FeatureStack } from "./FeatureStack";

export default {
  title: "Components/FeatureStack",
  argTypes: {
    fold: { control: "boolean" },
  },
};

export const Default: React.FC<React.PropsWithChildren> = (args) => {
  return <FeatureStack {...args} features={["Pool Features", "Order Type"]} />;
};

export const Fold: React.FC<React.PropsWithChildren> = (args) => {
  return <FeatureStack fold {...args} features={["Pool Features", "Order Type", "Order Type 2", "Order Type"]} />;
};
