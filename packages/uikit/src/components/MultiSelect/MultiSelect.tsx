import { useTheme } from "@pancakeswap/hooks";
import noop from "lodash/noop";
import { MultiSelect as PrimereactSelect } from "primereact/multiselect";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { Box, Flex } from "../Box";
import { Checkbox } from "../Checkbox";
import { Column } from "../Column";
import { ArrowDropDownIcon, SearchIcon } from "../Svg";
import { EmptyMessage } from "./EmptyMessage";
import SearchBox, { BORDER_RADIUS, IAdaptiveInputForwardProps } from "./SearchBox";
import { IMultiSelectChangeEvent, IMultiSelectProps, IOptionType, ISelectItem } from "./types";

const CHECKBOX_WIDTH = "26px";

const SelectContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;

  .p-multiselect {
    position: relative;
    height: 0px;
    width: 100% !important;
  }
  .p-multiselect-label-container,
  .p-multiselect-trigger {
    display: none;
  }

  .p-multiselect-panel {
    width: 100% !important;
    min-width: auto;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    box-shadow: ${({ theme }) => theme.card.boxShadow};
    border-radius: ${BORDER_RADIUS};
  }

  .p-multiselect-label {
    line-height: 24px;
    &.p-placeholder {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  }

  .p-multiselect-empty-message {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style-type: none;
    text-align: center;
    padding: 10px;
  }

  .p-multiselect-item {
    justify-content: space-between;
    width: 100%;
    height: 40px;
    padding: 8px 16px;

    .p-multiselect-checkbox {
      order: 1;
    }
  }

  .p-multiselect-footer {
    padding: 8px 16px;
    text-align: center;
    line-height: 24px;
    font-size: 12px;
    border-top: 1px solid var(--colors-cardBorder);
  }

  .p-checkbox {
    position: relative;
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    width: ${CHECKBOX_WIDTH};
    height: ${CHECKBOX_WIDTH};

    &:hover {
      .p-checkbox-box {
        box-shadow: ${({ theme }) => theme.shadows.focus};
      }
    }

    .p-checkbox-box {
      transition: background-color 0.2s ease-in-out;
      border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
      width: ${CHECKBOX_WIDTH};
      height: ${CHECKBOX_WIDTH};
      border-radius: 8px;
      background-color: ${({ theme }) => theme.colors.input};
    }

    &.p-highlight {
      .p-checkbox-box {
        border-color: ${({ theme }) => theme.colors.success};
        background-color: ${({ theme }) => theme.colors.success};
      }

      .p-checkbox-icon.p-icon {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        margin: auto;
        transform: translateY(-50%);
        color: ${({ theme }) => theme.colors.backgroundAlt};
        
        path {
          stroke: ${({ theme }) => theme.colors.backgroundAlt};
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

const PrimereactSelectContainer = styled.div<{ $scrollHeight?: string }>`
  height: 0;
  .p-multiselect-items-wrapper {
    height: ${({ $scrollHeight }) => $scrollHeight ?? "auto"};
  }
  .p-multiselect-items {
    height: 100%;
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
  border-bottom-width: 2px;
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0 0 1px ${({ theme }) => theme.shadows.inset};
  padding: 5px 8px 4px 12px;
  user-select: none;
  cursor: pointer;
  gap: 8px;
`;

const SelectedInputItemsContainer = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  overflow: hidden;
`;

const SelectedInputIconsContainer = styled.div`
  display: flex;
  height: 28px;

  & > :not(:first-child) {
    margin-left: -12px;
  }

  & > img {
    width: 28px;
    height: 28px;
    border: 2px solid ${({ theme }) => theme.colors.input};
    border-radius: 50%;
  }

  & > div {
    border: 2px solid ${({ theme }) => theme.colors.input};
    border-radius: 50%;
    & > img:first-child {
      width: 24px;
      height: 24px;
    }
    & > img:last-child {
      left: 0;
    }
  }
`;

const SelectedInputFakeIcon = styled.span`
  display: inline-block;
  box-sizing: content-box;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.inputSecondary};
  color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 50%;
  text-align: center;
  align-content: center;
  font-size: 14px;
  font-weight: 600;
  z-index: 1;
`;

const SelectInputPlaceholder = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

export const MultiSelect = <T extends string | number>(props: IMultiSelectProps<T>) => {
  const {
    style,
    panelStyle,
    onChange,
    onShow,
    onHide,
    placeholder,
    value,
    options,
    selectAllLabel,
    isShowSelectAll,
    isShowFilter,
    ...restProps
  } = props;
  const [selectedItemsInner, setSelectedItems] = useState<T[]>();
  const selectedItems = useMemo(() => value ?? selectedItemsInner, [value, selectedItemsInner]);
  const [isShow, setIsShow] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState("");

  const primereactSelectRef = useRef<PrimereactSelect>(null);
  const searchInputRef = useRef<IAdaptiveInputForwardProps>(null);

  const theme = useTheme();
  const list = useMemo(
    () => options?.filter((op) => op.label.toLowerCase().includes(searchText.toLowerCase())),
    [options, searchText]
  );

  const indeterminate = useMemo(
    () => !!selectedItems?.length && selectedItems?.length !== options?.length,
    [selectedItems, options]
  );

  const itemTemplate = useCallback((option: ISelectItem<T>) => {
    return (
      <ItemContainer>
        {option.icon ? (
          typeof option.icon === "string" ? (
            <ItemIcon alt={option.label} src={option.icon} />
          ) : (
            option.icon
          )
        ) : null}
        <span>{option.label}</span>
      </ItemContainer>
    );
  }, []);

  const selectedOptions = useMemo(() => {
    if (!selectedItems?.length || !options?.length) {
      return [];
    }
    return selectedItems.map((item) => options.find((op) => op.value === item)).filter(Boolean) as IOptionType<T>;
  }, [selectedItems, options]);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent | React.MouseEvent) => {
      const result = !selectAll && options ? options.map((i) => i.value) : [];
      if (onChange) {
        onChange({
          value: result,
          originalEvent: e,
          stopPropagation: e.stopPropagation,
          preventDefault: e.preventDefault,
        });
      } else {
        setSelectAll(!selectAll);
        setSelectedItems(result);
      }
    },
    [selectAll, options, onChange]
  );

  const handleFilter = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleLabelDelete = useCallback(
    (e: React.MouseEvent<HTMLOrSVGElement> | React.KeyboardEvent, item: ISelectItem<T>) => {
      if (!selectedItems?.length) {
        return;
      }
      const result = selectedItems.filter((i) => i !== item.value);
      if (onChange) {
        onChange({
          value: result,
          stopPropagation: e.stopPropagation,
          preventDefault: e.preventDefault,
          target: item,
        });
      } else {
        setSelectedItems(result);
      }
    },
    [selectedItems, onChange]
  );

  const handleClearSeachBox = useCallback(
    (e: React.MouseEvent<HTMLOrSVGElement>) => {
      if (selectedItems?.length) {
        if (onChange) {
          onChange({
            value: [],
            stopPropagation: e.stopPropagation,
            preventDefault: e.preventDefault,
          });
        } else {
          setSelectedItems([]);
        }
      }
      if (searchText.length) {
        searchInputRef.current?.clear();
      }
    },
    [searchText, selectedItems, onChange]
  );

  const panelHeaderTemplate = useMemo(
    () => (
      <>
        {isShowFilter && (
          <SearchBox
            selectedItems={selectedOptions}
            ref={searchInputRef}
            onFilter={handleFilter}
            onClear={handleClearSeachBox}
            onLabelDelete={handleLabelDelete}
          />
        )}
        {isShowSelectAll && (
          <Box className="p-multiselect-item" onClick={handleSelectAll}>
            <span>{selectAllLabel ?? "Select All"}</span>
            <Checkbox
              scale={CHECKBOX_WIDTH}
              colors={{
                background: "input",
                border: "inputSecondary",
                checkedColor: "backgroundAlt",
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
    [
      handleClearSeachBox,
      handleSelectAll,
      indeterminate,
      selectAll,
      selectAllLabel,
      selectedOptions,
      isShowFilter,
      isShowSelectAll,
      handleFilter,
      handleLabelDelete,
    ]
  );

  const handleChange = useCallback(
    (e: IMultiSelectChangeEvent<T>) => {
      if (onChange) {
        onChange?.(e);
      } else {
        setSelectedItems(e.value);
      }
      // searchInputRef.current?.clear();
      // searchInputRef.current?.focus();
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
        className="select-input-container"
        style={style}
        onClick={(e: React.MouseEvent) => {
          if (!isShow) {
            e.preventDefault();
            primereactSelectRef.current?.show();
            setTimeout(() => searchInputRef.current?.focus());
          }
        }}
      >
        {isShowFilter && !selectedItems?.length ? <SearchIcon color={theme.theme.colors.textSubtle} /> : null}
        {!selectedItems?.length ? (
          <SelectInputPlaceholder>{props.placeholder ?? "Select something"}</SelectInputPlaceholder>
        ) : null}
        <SelectedInputIconsContainer>
          {selectedItems ? (
            <>
              {selectedItems.slice(0, 3).map((item) => {
                const option = options?.find((op) => op.value === item);
                return option?.icon ? (
                  typeof option.icon === "string" ? (
                    <img alt={item.toString()} key={item} src={option.icon} />
                  ) : (
                    option.icon
                  )
                ) : null;
              })}
              {selectedItems.length > 3 ? (
                <SelectedInputFakeIcon>{`+${selectedItems.length - 3}`}</SelectedInputFakeIcon>
              ) : null}
            </>
          ) : null}
        </SelectedInputIconsContainer>
        <SelectedInputItemsContainer>
          {selectedItems
            ? selectedItems.length === options?.length && selectAllLabel
              ? selectAllLabel
              : selectedItems.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && <span>, </span>}
                    <span>{options?.find((op) => op.value === item)?.label}</span>
                  </React.Fragment>
                ))
            : null}
        </SelectedInputItemsContainer>
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

      <PrimereactSelectContainer $scrollHeight={props.scrollHeight}>
        <PrimereactSelect
          {...restProps}
          ref={primereactSelectRef}
          style={{
            width: style?.width ?? "auto",
          }}
          panelStyle={{
            ...(panelStyle ?? {}),
            width: panelStyle?.width ?? style?.width ?? "auto",
            backgroundColor: panelStyle?.backgroundColor ?? theme.theme.card.background,
          }}
          appendTo={props.appendTo ?? "self"}
          value={value ?? selectedItems}
          options={list}
          placeholder={placeholder ?? "Select Something"}
          itemTemplate={props.itemTemplate ?? itemTemplate}
          panelHeaderTemplate={props.panelHeaderTemplate ?? panelHeaderTemplate}
          emptyMessage={props.emptyMessage ?? ((<EmptyMessage />) as unknown as string)}
          onChange={handleChange as any}
          onShow={handleShow}
          onHide={handleHide}
          onKeyDown={noop}
        />
      </PrimereactSelectContainer>
    </SelectContainer>
  );
};
