import React, { useCallback, useState } from "react";
import { styled } from "styled-components";
import isEmpty from "lodash/isEmpty";
import { useTheme } from "@pancakeswap/hooks";
import type { TreeNode, TreeSelectChangeEvent, TreeSelectProps } from "./index";
import { TreeSelect } from "./TreeSelect";
import { Box } from "../Box";

export default {
  title: "Components/TreeSelect",
  component: TreeSelect,
};

const mockData = [
  {
    key: "0",
    label: "All Pools",
    data: "All Pools",
    children: [
      {
        key: "0-0",
        label: "Pool Type",
        data: "Pool Type",
        children: [
          {
            key: "0-0-0",
            label: "CLAMM",
            data: "CLAMM",
          },
          {
            key: "0-0-1",
            label: "Bin",
            data: "",
          },
        ],
      },
      {
        key: "0-1",
        label: "Pool Feature",
        data: "Pool Feature",
        children: [
          {
            key: "0-1-0",
            label: "Farming",
            data: "Farming",
          },
          {
            key: "0-1-1",
            label: "Misc",
            data: "Misc",
          },
          {
            key: "0-1-2",
            label: "Oracle",
            data: "Oracle",
          },
          {
            key: "0-1-3",
            label: "Order Types",
            data: "Order Types",
          },
        ],
      },
    ],
  },
];
const Container = styled(Box)<{ isShow: boolean }>`
  ${({ isShow, theme }) =>
    isShow &&
    `
  && .p-treeselect {
     border: 1px solid ${theme.colors.secondary};
     border-bottom: 1px solid ${theme.colors.inputSecondary};
     box-shadow: -2px -2px 2px 2px #7645D933, 2px -2px 2px 2px #7645D933;
     border-bottom-left-radius: 0;
     border-bottom-right-radius: 0;
  }
  && .p-treeselect-panel {
    border: 1px solid ${theme.colors.secondary};
    box-shadow: 2px 2px 2px 2px #7645D933, -2px 2px 2px 2px #7645D933;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
  }
 `}
  .p-treeselect,
 .p-treeselect-panel {
    transition: box-shadow 0.1s, border 0.1s, border-radius 0.1s;
  }
  && .p-treeselect-panel {
    margin: -1px 0 0 -1px;
  }
`;
export interface IPoolsTypeFilterProps {
  data?: TreeNode[];
}

export const PoolsTypeFilter: React.FC<IPoolsTypeFilterProps> = () => {
  const [isShow, setIsShow] = useState(false);
  const [selectedNodeKey, setSelectedNodeKey] = useState<TreeSelectProps["value"]>(null);
  const { theme } = useTheme();

  const handleTreeSelectChange = useCallback((e: TreeSelectChangeEvent) => {
    // To prevent the user from unchecking all items, we need at least one poolType to filter.
    if (isEmpty(e.value)) {
      e.preventDefault();
      return;
    }
    setSelectedNodeKey(e.value);
  }, []);

  return (
    <Container margin="30px" width="272px" isShow={isShow}>
      <TreeSelect
        data={mockData}
        style={{
          backgroundColor: theme.colors.input,
        }}
        panelStyle={{
          backgroundColor: theme.colors.input,
        }}
        value={selectedNodeKey}
        onShow={() => setIsShow(true)}
        onHide={() => setIsShow(false)}
        onChange={handleTreeSelectChange}
      />
    </Container>
  );
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <Box margin="30px" width="272px">
      <TreeSelect data={mockData} />
    </Box>
  );
};
