import { useCallback, useMemo, useState } from "react";
import { MultiSelect as PrimereactSelect, MultiSelectProps, MultiSelectChangeEvent } from "primereact/multiselect";
import { SelectItem } from "primereact/selectitem";
import { styled } from "styled-components";
import { ArrowDropDownIcon } from "../Svg";

const SelectContainer = styled.div<{ isShow: boolean }>`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  .p-multiselect {
    position: relative;
    border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
    border-radius: 16px 16px ${(props) => (props.isShow ? "0 0" : "16px")};
    box-shadow: 0 0 1px ${({ theme }) => theme.shadows.inset};
    padding: 8px 8px 8px 16px;

    .p-multiselect-panel {
      min-width: auto;
      border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
      border-top: 0;
      box-shadow: 0 0 3px ${({ theme }) => theme.shadows.inset};
      border-radius: 0 0 16px 16px;
      margin: -1px 0 0 -1px;
    }

    .p-multiselect-label {
      line-height: 24px;
      &.p-placeholder {
        color: ${({ theme }) => theme.colors.textDisabled};
      }
    }

    .p-multiselect-item {
      justify-content: space-between;
      width: 100%;
      height: 42px;
      padding: 8px 16px;

      .p-multiselect-checkbox {
        order: 1;
      }
    }

    .p-checkbox {
      position: relative;
      display: inline-flex;
      user-select: none;
      vertical-align: bottom;
      width: 26px;
      height: 26px;

      .p-checkbox-box {
        border: 2px solid #d1d5db;
        width: 26px;
        height: 26px;
        border-radius: 8px;
        background-color: ${({ theme }) => theme.colors.input};
        box-shadow: ${({ theme }) => theme.shadows.inset};
      }

      &.p-highlight {
        .p-checkbox-box {
          border-color: ${({ theme }) => theme.colors.primary};
          background-color: ${({ theme }) => theme.colors.primary};
        }

        .p-checkbox-icon.p-icon {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          margin: auto;
          transform: translateY(-50%);
          color: ${({ theme }) => theme.colors.white};
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
      }
    }
  }
}
`;

const ItemIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
`;

type ISelectItem = SelectItem & { icon: string };

type IOptionType = ISelectItem[] | any[];

export interface IMultiSelectProps extends MultiSelectProps {
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  scrollHeight?: string;
  options?: IOptionType;
  placeholder?: string;
  defaultValue?: string[];
  checkAllLabel?: string;
}

export const MultiSelect = (props: IMultiSelectProps) => {
  const { style, panelStyle, onChange, onFocus, onHide, placeholder, defaultValue } = props;
  const [selectedItems, setSelectedItems] = useState(defaultValue ?? null);
  const [isShow, setIsShow] = useState(false);

  const itemTemplate = useCallback((option: ISelectItem) => {
    return (
      <ItemContainer>
        {option.icon ? <ItemIcon alt={option.label} src={option.icon} /> : null}
        <span>{option.label}</span>
      </ItemContainer>
    );
  }, []);

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

  const handleChange = useCallback(
    (e: MultiSelectChangeEvent) => {
      setSelectedItems(e.value);
      onChange?.(e);
    },
    [onChange]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsShow(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleHide = useCallback(() => {
    setIsShow(false);
    onHide?.();
  }, [onHide]);

  return (
    <SelectContainer isShow={isShow}>
      <PrimereactSelect
        {...props}
        panelStyle={{
          ...(panelStyle ?? {}),
          width: panelStyle?.width ?? style?.width ?? "auto",
        }}
        appendTo={props.appendTo ?? "self"}
        value={selectedItems}
        placeholder={placeholder ?? "Select Something"}
        itemTemplate={props.itemTemplate ?? itemTemplate}
        panelHeaderTemplate={props.panelHeaderTemplate ?? (() => <></>)}
        dropdownIcon={props.dropdownIcon ?? DropDownIcon}
        onChange={handleChange}
        onFocus={handleFocus}
        onHide={handleHide}
      />
    </SelectContainer>
  );
};
