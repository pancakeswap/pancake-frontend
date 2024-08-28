import React, { useCallback, useState } from "react";
import { styled } from "styled-components";
import isEmpty from "lodash/isEmpty";
import { Box, TreeSelect } from "@pancakeswap/uikit";
import type { TreeNode, TreeSelectChangeEvent, TreeSelectProps } from "@pancakeswap/uikit/components/TreeSelect";
import { useTheme } from "@pancakeswap/hooks";

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
export interface IPoolTagFilterProps {
  data?: TreeNode[];
}

export const PoolTagFilter: React.FC<IPoolTagFilterProps> = ({ data }) => {
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
    <Container width="272px" isShow={isShow}>
      <TreeSelect
        data={data}
        style={{
          backgroundColor: theme.colors.input,
        }}
        panelStyle={{
          backgroundColor: theme.colors.input,
        }}
        value={selectedNodeKey}
        placeholder="All pools"
        onShow={() => setIsShow(true)}
        onHide={() => setIsShow(false)}
        onChange={handleTreeSelectChange}
      />
    </Container>
  );
};
