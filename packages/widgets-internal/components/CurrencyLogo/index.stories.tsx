import React from "react";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";

import { CurrencyLogo } from "./index";
import { cakeToken, bscToken } from "../../mockData";

export default {
  title: "Components/CurrencyLogo",
  component: CurrencyLogo,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <CurrencyLogo currency={cakeToken} />
      <CurrencyLogo currency={bscToken} />
    </div>
  );
};
