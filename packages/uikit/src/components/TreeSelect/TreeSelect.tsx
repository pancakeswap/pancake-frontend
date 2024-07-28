import { styled } from "styled-components";
import { useState, useMemo, useCallback } from "react";
import { TreeSelect as PrimereactTreeSelect, TreeSelectChangeEvent, TreeSelectProps } from "primereact/treeselect";
import type { TreeNode } from "primereact/treenode";
import { useTheme } from "@pancakeswap/hooks";
import { ArrowDropDownIcon } from "../Svg";

function traverseData(treeNodes: TreeNode[]) {
  let keys: { [key: string]: boolean } = {};
  for (const node of treeNodes) {
    if (node.key) {
      keys[node.key] = true;
    }
    if (node.children) {
      keys = {
        ...keys,
        ...traverseData(node.children),
      };
    }
  }
  return keys;
}

const BORDER_RADIUS = "16px";

const SelectContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;

  .p-treeselect {
    justify-content: space-between;
    align-items: center;
    position: relative;
    border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
    border-bottom-width: 2px;
    border-radius: ${BORDER_RADIUS};
    box-shadow: 0 0 1px ${({ theme }) => theme.shadows.inset};
    padding: 8px;
    user-select: none;
    cursor: pointer;
    .p-treeselect-label-container {
      line-height: 24px;
      padding: 0 8px;
    }
    .p-placeholder {
      color: ${({ theme }) => theme.colors.textSubtle};
    }
  }
  .p-treeselect-header {
    display: none;
  }
  .p-tree-container {
    margin: 0;
    padding: 0;
    list-style-type: none;
    overflow: auto;
  }
  .p-treenode {
    list-style-type: none;
    outline: none;
  }
  .p-treeselect-panel {
    border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
    border-radius: ${BORDER_RADIUS};
    box-shadow: 0 0 1px ${({ theme }) => theme.shadows.inset};
    margin: 5px 0 0 -1px;
    box-sizing: content-box;
  }
  .p-treenode-children {
    padding: 0 0 0 1rem;
  }
  .p-treenode-content {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    gap: 8px;

    .p-tree-toggler {
      display: inline-flex;
      align-items: center;
      width: 18px;
      height: 26px;
      color: ${({ theme }) => theme.colors.textSubtle};
      border: 0 none;
      background: transparent;
      border-radius: 50%;
      text-align: center;
    }
    .p-treenode-leaf > & {
      .p-tree-toggler {
        visibility: hidden;
      }
    }
  }
  .p-checkbox {
    position: relative;
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    .p-checkbox-box {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid ${({ theme }) => theme.colors.inputSecondary};
      background: ${({ theme }) => theme.card.background};
      width: 24px;
      height: 24px;
      border-radius: 8px;
      transition: background-color 0.2s, color 0.2s;
      outline-color: transparent;
      .p-checkbox-icon {
        transition-duration: 0.2s;
        color: ${({ theme }) => theme.colors.backgroundAlt};
        font-size: 14px;
        &.p-icon {
          width: 14px;
          height: 14px;
        }
        path {
          stroke: ${({ theme }) => theme.colors.backgroundAlt};
          stroke-width: 1;
        }
      }
    }
    &.p-highlight {
      .p-checkbox-box {
        border: 0;
        border-bottom: 2px solid rgba(0, 0, 0, 0.2);
        background: ${({ theme }) => theme.colors.success};
      }
    }
  }
  .p-checkbox-input {
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    outline: 0 none;
    cursor: pointer;
    border-radius: 6px;
  }

  .p-treenode-leaf > .p-treenode-content .p-tree-toggler {
    visibility: hidden;
  }
`;

export interface ITreeSelectProps extends TreeSelectProps {
  data?: TreeNode[];
}

export const TreeSelect = (props: ITreeSelectProps) => {
  const { data, onShow, onHide } = props;
  const [selectedNodeKey, setSelectedNodeKey] = useState<TreeSelectProps["value"]>(null);
  const keysExpandInitial = useMemo(() => (data ? traverseData(data) : {}), [data]);
  const [expandedKeys, setExpandedKeys] = useState(keysExpandInitial);
  const [isShow, setIsShow] = useState(false);
  const { theme } = useTheme();

  const DropDownIcon = useMemo(
    () => (
      <ArrowDropDownIcon
        color="text"
        style={{
          ...(isShow ? { transform: `rotate(180deg)` } : {}),
          transition: `transform 0.1s ease`,
        }}
      />
    ),
    [isShow]
  );

  const handleTreeSelectChange = useCallback((e: TreeSelectChangeEvent) => {
    setSelectedNodeKey(e.value);
  }, []);

  const handlePanelShow = useCallback(() => {
    setIsShow(true);
    onShow?.();
  }, [onShow]);

  const handlePanelHide = useCallback(() => {
    setIsShow(false);
    onHide?.();
  }, [onHide]);

  return (
    <SelectContainer>
      <PrimereactTreeSelect
        {...props}
        style={{
          width: "100%",
          backgroundColor: theme.colors.input,
          ...(props.style ?? {}),
        }}
        panelStyle={{
          backgroundColor: theme.colors.input,
          ...(props.panelStyle ?? {}),
        }}
        scrollHeight={props.scrollHeight ?? "380px"}
        appendTo="self"
        value={props.onChange ? props.value : selectedNodeKey}
        onChange={props.onChange ?? handleTreeSelectChange}
        options={data}
        placeholder={props.placeholder ?? "Select Item"}
        selectionMode="checkbox"
        expandedKeys={expandedKeys}
        dropdownIcon={DropDownIcon}
        onToggle={(e) => setExpandedKeys(e.value)}
        onShow={handlePanelShow}
        onHide={handlePanelHide}
      />
    </SelectContainer>
  );
};
