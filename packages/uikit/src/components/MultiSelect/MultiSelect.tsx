import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultiSelect as PrimereactSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { styled } from "styled-components";
import { useTheme } from "@pancakeswap/hooks";
import { ArrowDropDownIcon, SearchIcon } from "../Svg";
import { Box, Flex } from "../Box";
import { Checkbox } from "../Checkbox";
import { Column } from "../Column";
import SearchBox, { BORDER_RADIUS, IAdaptiveInputForwardProps } from "./SearchBox";
import { IMultiSelectProps, IOptionType, ISelectItem } from "./types";
import { EmptyMessage } from "./EmptyMessage";

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

const PrimereactSelectContainer = styled.div<{ scrollHeight?: string }>`
  height: 0;
  .p-multiselect-items-wrapper {
    height: ${({ scrollHeight }) => scrollHeight ?? "auto"};
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
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0 0 1px ${({ theme }) => theme.shadows.inset};
  padding: 7px 8px 7px 16px;
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
  height: 24px;
  & > :not(:first-child) {
    margin-left: -12px;
  }

  & > img {
    width: 24px;
    height: 24px;
    border: 2px solid ${({ theme }) => theme.colors.input};
    border-radius: 50%;
  }
`;

const SelectedInputFakeIcon = styled.span`
  display: inline-block;
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
  } = props;
  const [selectedItems, setSelectedItems] = useState<T[]>();
  const [isShow, setIsShow] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState("");

  const primereactSelectRef = useRef<PrimereactSelect>(null);
  const searchInputRef = useRef<IAdaptiveInputForwardProps>(null);

  const theme = useTheme();
  const list = useMemo(
    () => options?.filter((op) => op.label.toLowerCase().includes(searchText)),
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
          target: { name: selectAllLabel ?? "Select All", value: "0", id: "0" },
        });
      } else {
        setSelectAll(!selectAll);
        setSelectedItems(result);
      }
    },
    [selectAll, options, onChange, selectAllLabel]
  );

  const handleFilter = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleLabelDelete = useCallback(
    (item: ISelectItem<T>) => {
      if (!selectedItems?.length) {
        return;
      }
      setSelectedItems(selectedItems.filter((i) => i !== item.value));
    },
    [selectedItems]
  );

  const panelHeaderTemplate = useMemo(
    () => (
      <>
        {isShowFilter && (
          <SearchBox
            selectedItems={selectedOptions}
            ref={searchInputRef}
            onFilter={handleFilter}
            handleLabelDelete={handleLabelDelete}
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
    (e: MultiSelectChangeEvent) => {
      if (onChange) {
        onChange?.(e);
      } else {
        setSelectedItems(e.value);
      }
      searchInputRef.current?.clear();
      searchInputRef.current?.focus();
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

  useEffect(() => {
    setSelectedItems(value);
  }, [value]);

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

      <PrimereactSelectContainer scrollHeight={props.scrollHeight}>
        <PrimereactSelect
          {...props}
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
          onChange={handleChange}
          onShow={handleShow}
          onHide={handleHide}
          onKeyDown={() => {}}
        />
      </PrimereactSelectContainer>
    </SelectContainer>
  );
};
