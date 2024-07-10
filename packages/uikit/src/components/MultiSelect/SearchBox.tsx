import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useTheme } from "@pancakeswap/hooks";
import { IOptionType, ISelectItem } from "./types";
import { Box } from "../Box";
import { CrossIcon } from "../Svg";

export const BORDER_RADIUS = "16px";

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: ${BORDER_RADIUS};
  line-height: 24px;
  margin: 16px;
  padding: 5px 8px;
`;

const StyledHiddenInput = styled.input`
  margin: 0;
  padding: 0;
  background: 0 0;
  border: none;
  outline: none;
  appearance: none;
  font: inherit;
  cursor: auto;
  color: inherit;
  height: 100%;
  min-width: 4px;
  max-width: 100%;
`;

interface IAdaptiveInputProps {
  onChange?: (text: string) => void;
}

export interface IAdaptiveInputForwardProps {
  clear: () => void;
  focus: () => void;
}

const AdaptiveInput = forwardRef<IAdaptiveInputForwardProps, IAdaptiveInputProps>(({ onChange }, ref) => {
  const [value, setValue] = useState<string>("");
  const [width, setWidth] = useState<number>(4);
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const span = spanRef.current;
    if (span) {
      span.textContent = value;
      setWidth(span.offsetWidth);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    clear() {
      setValue("");
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    onChange?.(value);
  }, [value, onChange]);

  return (
    <>
      <StyledHiddenInput value={value} onChange={handleChange} style={{ width: `${width}px` }} ref={inputRef} />
      <span style={{ visibility: "hidden", position: "absolute", whiteSpace: "pre" }} ref={spanRef} />
    </>
  );
});

const SelectedLabel = styled.span`
  display: inline-flex;
  padding: 2px;
  border-radius: ${BORDER_RADIUS};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  background-color: ${({ theme }) => theme.colors.textSubtle};
  color: ${({ theme }) => theme.card.background};
  gap: 4px;
`;

const ItemIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export interface ISearchBoxProps {
  selectedItems: IOptionType;
  onFilter?: (text: string) => void;
  handleLabelDelete: (item: ISelectItem) => void;
}

export const SearchBox = forwardRef<IAdaptiveInputForwardProps, ISearchBoxProps>(
  ({ onFilter, selectedItems, handleLabelDelete }, ref) => {
    const inputRef = useRef<IAdaptiveInputForwardProps>(null);
    const { theme } = useTheme();

    useImperativeHandle(ref, () => ({
      clear() {
        inputRef.current?.clear();
      },
      focus() {
        inputRef.current?.focus();
      },
    }));

    const handleCrossIconClick = useCallback(
      (e: React.MouseEvent<HTMLOrSVGElement>, item: ISelectItem) => {
        // prevent bubble to StyledBox
        e.stopPropagation();
        handleLabelDelete(item);
      },
      [handleLabelDelete]
    );

    return (
      <StyledBox onClick={() => inputRef.current?.focus()}>
        {selectedItems?.map((item) => (
          <SelectedLabel>
            {item.icon ? <ItemIcon alt={item.label} src={item.icon} /> : null}
            <span>{item.label}</span>
            <CrossIcon color={theme.card.background} onClick={(e) => handleCrossIconClick(e, item)} />
          </SelectedLabel>
        ))}
        <AdaptiveInput ref={inputRef} onChange={onFilter} />
      </StyledBox>
    );
  }
);
