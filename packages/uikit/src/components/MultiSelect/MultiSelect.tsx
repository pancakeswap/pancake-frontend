import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultiSelect as PrimereactSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { styled } from "styled-components";
import { useTheme } from "@pancakeswap/hooks";
import { ArrowDropDownIcon } from "../Svg";
import { Box, Flex } from "../Box";
import { Checkbox } from "../Checkbox";
import { Column } from "../Column";
import { BORDER_RADIUS, IAdaptiveInputForwardProps, SearchBox } from "./SearchBox";
import { IMultiSelectProps, ISelectItem } from "./types";

const CHECKBOX_WIDTH = "26px";

const SelectContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;

  .p-multiselect {
    position: relative;
    height: 0px;
  }
  .p-multiselect-label-container,
  .p-multiselect-trigger {
    display: none;
  }

  .p-multiselect-panel {
    min-width: auto;
    border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
    box-shadow: 0 0 3px ${({ theme }) => theme.shadows.inset};
    border-radius: ${BORDER_RADIUS};
  }

  .p-multiselect-label {
    line-height: 24px;
    &.p-placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  }

  .p-multiselect-empty-message {
    list-style-type: none;
    text-align: center;
    padding: 10px;
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
    width: ${CHECKBOX_WIDTH};
    height: ${CHECKBOX_WIDTH};

    .p-checkbox-box {
      transition: background-color 0.2s ease-in-out;
      border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
      width: ${CHECKBOX_WIDTH};
      height: ${CHECKBOX_WIDTH};
      border-radius: 8px;
      background-color: ${({ theme }) => theme.card.background};
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
        
        path {
          stroke: ${({ theme }) => theme.colors.white};
          stroke-width: 1;
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

const SelectInputContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0 0 1px ${({ theme }) => theme.shadows.inset};
  padding: 8px 8px 8px 16px;
  user-select: none;
  cursor: pointer;
`;

const SelectedItemsContainer = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  overflow: hidden;
`;

export const MultiSelect = (props: IMultiSelectProps) => {
  const {
    style,
    panelStyle,
    onChange,
    onShow,
    onHide,
    placeholder,
    defaultValue,
    value,
    options,
    selectAllLabel,
    isSelectAll,
    isFilter,
  } = props;
  const [selectedItems, setSelectedItems] = useState(defaultValue ?? null);
  const [isShow, setIsShow] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState("");

  const primereactSelectRef = useRef<PrimereactSelect>(null);
  const searchInputRef = useRef<IAdaptiveInputForwardProps>(null);

  const theme = useTheme();
  const list = useMemo(
    () => options?.filter((op) => op.value.toLowerCase().includes(searchText)),
    [options, searchText]
  );

  const indeterminate = useMemo(
    () => !!selectedItems?.length && selectedItems?.length !== options?.length,
    [selectedItems, options]
  );

  const itemTemplate = useCallback((option: ISelectItem) => {
    return (
      <ItemContainer>
        {option.icon ? <ItemIcon alt={option.label} src={option.icon} /> : null}
        <span>{option.label}</span>
      </ItemContainer>
    );
  }, []);

  const selectedOptions = useMemo(() => {
    if (!selectedItems?.length || !options?.length) {
      return [];
    }
    return selectedItems.map((item) => options.find((op) => op.value === item) ?? { value: item, label: item });
  }, [selectedItems, options]);

  const handleSelectAll = useCallback(() => {
    setSelectAll(!selectAll);
    if (!selectAll && options) {
      setSelectedItems(options.map((i) => i.value));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, options]);

  const handleFilter = (text: string) => {
    setSearchText(text);
  };

  const panelHeaderTemplate = useMemo(
    () => (
      <>
        {isFilter && <SearchBox selectedItems={selectedOptions} ref={searchInputRef} onFilter={handleFilter} />}
        {isSelectAll && (
          <Box className="p-multiselect-item" onClick={handleSelectAll}>
            <span>{selectAllLabel ?? "Select All"}</span>
            <Checkbox
              scale={CHECKBOX_WIDTH}
              colors={{
                background: "backgroundAlt",
                checkedBackground: "primary",
                border: "inputSecondary",
              }}
              style={{ margin: 0 }}
              onChange={handleSelectAll}
              checked={selectAll}
              indeterminate={indeterminate}
            />
          </Box>
        )}
      </>
    ),
    [handleSelectAll, indeterminate, selectAll, selectAllLabel, selectedOptions, isFilter, isSelectAll]
  );

  const handleChange = useCallback(
    (e: MultiSelectChangeEvent) => {
      setSelectedItems(e.value);
      searchInputRef.current?.clear();
      searchInputRef.current?.focus();
      onChange?.(e);
    },
    [onChange]
  );

  const handleShow = useCallback(() => {
    setIsShow(true);
    onShow?.();
  }, [onShow]);

  const handleHide = useCallback(() => {
    setIsShow(false);
    onHide?.();
  }, [onHide]);

  useEffect(() => {
    setSelectAll(selectedItems?.length === options?.length);
  }, [selectedItems, options]);

  return (
    <SelectContainer
      style={{
        width: style?.width ?? "auto",
      }}
    >
      <SelectInputContainer
        style={style}
        onClick={(e: React.MouseEvent) => {
          if (!isShow) {
            e.preventDefault();
            primereactSelectRef.current?.show();
            setTimeout(() => searchInputRef.current?.focus());
          }
        }}
      >
        <SelectedItemsContainer>
          {selectedItems?.map((item, idx) => (
            <React.Fragment key={item}>
              <span>{options?.find((op) => op.value === item)?.label}</span>
              {idx < selectedItems.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
        </SelectedItemsContainer>
        <Column>
          <ArrowDropDownIcon
            color="text"
            style={{
              ...(isShow ? { transform: `rotate(180deg)` } : {}),
              transition: `transform 0.1s ease`,
            }}
          />
        </Column>
      </SelectInputContainer>

      <PrimereactSelect
        {...props}
        ref={primereactSelectRef}
        style={{
          width: style?.width ?? "auto",
        }}
        panelStyle={{
          ...(panelStyle ?? {}),
          width: panelStyle?.width ?? style?.width ?? "auto",
          backgroundColor: panelStyle?.backgroundColor ?? theme.theme.colors.background,
        }}
        appendTo={props.appendTo ?? "self"}
        value={value ?? selectedItems}
        options={list}
        placeholder={placeholder ?? "Select Something"}
        itemTemplate={props.itemTemplate ?? itemTemplate}
        panelHeaderTemplate={props.panelHeaderTemplate ?? panelHeaderTemplate}
        emptyMessage={props.emptyMessage ?? "No data"}
        onChange={handleChange}
        onShow={handleShow}
        onHide={handleHide}
        onKeyDown={() => {}}
      />
    </SelectContainer>
  );
};
