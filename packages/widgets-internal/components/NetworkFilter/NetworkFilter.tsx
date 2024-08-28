import { MultiSelect, IMultiSelectChangeEvent, IMultiSelectProps } from "@pancakeswap/uikit";
import { useCallback, useState } from "react";
import styled from "styled-components";

export interface INetworkProps {
  data: IMultiSelectProps<number>["options"];
  value: number[];
  onChange: (value: INetworkProps["value"], e: IMultiSelectChangeEvent<number>) => void;
}

const Container = styled.div<{ $isShow: boolean }>`
  flex: 1;

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
  ${({ $isShow, theme }) =>
    $isShow &&
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

export const NetworkFilter: React.FC<INetworkProps> = ({ data, value, onChange }: INetworkProps) => {
  const [isShow, setIsShow] = useState(false);

  const handleSelectChange = useCallback(
    (e: IMultiSelectChangeEvent<number>) => {
      // keep the order with network list
      const sortedValue = data ? data.filter((opt) => e.value.includes(opt.value)).map((opt) => opt.value) : e.value;
      onChange(sortedValue, e);
    },
    [onChange, data]
  );

  return (
    <Container $isShow={isShow}>
      <MultiSelect
        style={{
          backgroundColor: "var(--colors-input)",
        }}
        panelStyle={{
          backgroundColor: "var(--colors-input)",
        }}
        scrollHeight="322px"
        options={data}
        isShowSelectAll
        selectAllLabel="All networks"
        value={value}
        onShow={() => setIsShow(true)}
        onHide={() => setIsShow(false)}
        onChange={handleSelectChange}
      />
    </Container>
  );
};
