import React from "react";
import { MultiSelect } from "./index";

export default {
  title: "Components/MultiSelect",
  component: MultiSelect,
};

const chains = [
  { label: "BNB", value: "BNB", icon: "https://assets.pancakeswap.finance/web/chains/56.png" },
  { label: "Ethereum", value: "Ethereum", icon: "https://assets.pancakeswap.finance/web/chains/1.png" },
  { label: "Polygon zkEVM", value: "Polygon zkEVM", icon: "https://assets.pancakeswap.finance/web/chains/1101.png" },
  { label: "zkSync Era", value: "zkSync Era", icon: "https://assets.pancakeswap.finance/web/chains/324.png" },
  { label: "Arbitrum One", value: "Arbitrum One", icon: "https://assets.pancakeswap.finance/web/chains/42161.png" },
  { label: "Linea", value: "Linea", icon: "https://assets.pancakeswap.finance/web/chains/59144.png" },
  { label: "Base", value: "Base", icon: "https://assets.pancakeswap.finance/web/chains/8453.png" },
  { label: "opBNB", value: "Aptos", icon: "https://assets.pancakeswap.finance/web/chains/204.png" },
  { label: "Aptos", value: "Aptos", icon: "https://aptos.pancakeswap.finance/images/apt.png" },
];

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <MultiSelect
      style={{
        width: "273px",
        margin: "20px",
        backgroundColor: "var(--colors-input)",
      }}
      panelStyle={{
        backgroundColor: "var(--colors-input)",
      }}
      scrollHeight="400px"
      options={chains}
      defaultValue={[chains[0].value, chains[2].value]}
      checkAllLabel="All networks"
    />
  );
};
