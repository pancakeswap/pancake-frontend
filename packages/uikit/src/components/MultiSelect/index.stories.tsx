import React, { useState } from "react";
import { styled } from "styled-components";
import { MultiSelect } from "./index";
import { Column } from "../Column";
import { Flex } from "../Box";

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
  { label: "opBNB", value: "opbnb", icon: "https://assets.pancakeswap.finance/web/chains/204.png" },
  { label: "Aptos", value: "Aptos", icon: "https://aptos.pancakeswap.finance/images/apt.png" },
];

const Title = styled.div`
  margin-bottom: 20px;
`;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <Flex
      style={{
        padding: "32px",
        alignItems: "center",
        gap: "50px",
      }}
    >
      <Column>
        <Title>MultiSelect with filter:</Title>
        <MultiSelect
          style={{
            width: "328px",
          }}
          panelStyle={{
            minHeight: "382px",
          }}
          scrollHeight="382px"
          options={chains}
          isShowFilter
          panelFooterTemplate={() => <span>Don’t see expected tokens?</span>}
        />
      </Column>
      <Column>
        <Title>MultiSelect with selectAll:</Title>
        <MultiSelect
          style={{
            width: "273px",
          }}
          scrollHeight="400px"
          options={chains}
          isShowSelectAll
          selectAllLabel="All networks"
        />
      </Column>
    </Flex>
  );
};

export const ControlledMode: React.FC<React.PropsWithChildren> = () => {
  const [selectedValue, setSelectedValue] = useState([chains[0].value]);
  return (
    <Flex
      style={{
        padding: "32px",
        alignItems: "center",
        gap: "50px",
      }}
    >
      <Column>
        <MultiSelect
          style={{
            width: "273px",
            backgroundColor: "var(--colors-input)",
          }}
          panelStyle={{
            backgroundColor: "var(--colors-input)",
          }}
          scrollHeight="380px"
          options={chains}
          isShowSelectAll
          selectAllLabel="All networks"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.value)}
        />
      </Column>
    </Flex>
  );
};
