import isEmpty from "lodash/isEmpty";
import { MultiSelect, MultiSelectChangeEvent, IMultiSelectProps } from "@pancakeswap/uikit";
import { useCallback, useState } from "react";
import styled from "styled-components";

export interface INetworkProps {
  data?: IMultiSelectProps<number>["options"];
  value?: IMultiSelectProps<number>["value"];
  onChange?: (value: number[]) => void;
}

const Container = styled.div<{ isShow: boolean }>`
  .p-multiselect-panel {
    /* hack:
     * the primereact not support to custom the placement of panel
     * we need to place fixed to bottom
     * */
    top: 0 !important;
    left: 0 !important;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -14px;
    padding: 8px 0;
  }
  ${({ isShow, theme }) =>
    isShow &&
    `
  && .select-input-container {
     border: 1px solid ${theme.colors.secondary};
     border-bottom: 1px solid ${theme.colors.inputSecondary};
     box-shadow: -2px -2px 2px 2px #7645D933, 2px -2px 2px 2px #7645D933;
     border-bottom-left-radius: 0;
     border-bottom-right-radius: 0;
  }
  && .p-multiselect-panel {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: 1px solid ${theme.colors.secondary};
    box-shadow: 2px 2px 2px 2px #7645D933, -2px 2px 2px 2px #7645D933;
    border-top: none;
  }
 `}
`;

export const NetworkFilter: React.FC<INetworkProps> = ({ data = [], value, onChange }: INetworkProps) => {
  const [isShow, setIsShow] = useState(false);
  const [selectedItems, setSelectedItems] = useState(value);

  const handleSelectChange = useCallback(
    (e: MultiSelectChangeEvent) => {
      if (isEmpty(e.value)) {
        e.preventDefault();
        return;
      }
      if (onChange) {
        onChange(e.value);
      } else {
        setSelectedItems(e.value);
      }
    },
    [onChange]
  );

  return (
    <Container isShow={isShow}>
      <MultiSelect
        style={{
          width: "273px",
          backgroundColor: "var(--colors-input)",
        }}
        panelStyle={{
          backgroundColor: "var(--colors-input)",
        }}
        scrollHeight="322px"
        options={data}
        isShowSelectAll
        selectAllLabel="All networks"
        value={value ?? selectedItems}
        onShow={() => setIsShow(true)}
        onHide={() => setIsShow(false)}
        onChange={handleSelectChange}
      />
    </Container>
  );
};
