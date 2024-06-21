import React from "react";
import { FeeTier } from "./FeeTier";

export default {
  title: "Components/FeeTier",
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "2em", display: "flex", flexDirection: "column", gap: "1em" }}>
      <div>
        <FeeTier type="v2" fee={100} />
      </div>
      <div>
        <FeeTier type="v3" fee={99} />
      </div>
      <div>
        <FeeTier type="v4" fee={100} />
      </div>
      <div>
        <FeeTier type="v4" fee={100} dynamic />
      </div>
      <div>
        <FeeTier type="stable" fee={100} />
      </div>
    </div>
  );
};
