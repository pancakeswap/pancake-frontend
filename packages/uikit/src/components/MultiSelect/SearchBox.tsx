import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { IOptionType } from "./types";
import { Box } from "../Box";

export const BORDER_RADIUS = "16px";

const StyledBox = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
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
  display: inline-block;
  margin: 2px;
  padding: 2px 8px;
  border-radius: ${BORDER_RADIUS};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  background-color: ${({ theme }) => theme.colors.textSubtle};
  color: ${({ theme }) => theme.colors.background};
`;

export interface ISearchBoxProps {
  selectedItems: IOptionType;
  onFilter?: (text: string) => void;
}

export const SearchBox = forwardRef<IAdaptiveInputForwardProps, ISearchBoxProps>(({ onFilter, selectedItems }, ref) => {
  const inputRef = useRef<IAdaptiveInputForwardProps>(null);

  useImperativeHandle(ref, () => ({
    clear() {
      inputRef.current?.clear();
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  return (
    <StyledBox onClick={() => inputRef.current?.focus()}>
      {selectedItems?.map((item) => (
        <SelectedLabel>{item.label}</SelectedLabel>
      ))}
      <AdaptiveInput ref={inputRef} onChange={onFilter} />
    </StyledBox>
  );
});
