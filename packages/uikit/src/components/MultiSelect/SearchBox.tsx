import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useTheme } from "@pancakeswap/hooks";
import { IOptionType, ISelectItem } from "./types";
import { Box, Flex } from "../Box";
import { CrossIcon } from "../Svg";

export const BORDER_RADIUS = "16px";

const Container = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

const StyledBox = styled(Box)<{ isFocus: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: ${BORDER_RADIUS};
  line-height: 24px;
  margin: 16px;
  padding: 5px 8px;
  min-height: 42px;
  ${({ isFocus }) => isFocus && `box-shadow: 0px 0px 0px 4px #7645D933, 0px 0px 0px 1px #7645D9;`}
`;

const LabelsContainer = styled(Flex)`
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  height: 100%;
  max-width: calc(100% - 32px);
`;
const RemoveIconContainer = styled(Flex)`
  justify-content: center;
  width: 24px;
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
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export interface IAdaptiveInputForwardProps {
  clear: () => void;
  focus: () => void;
  value: () => string;
}

const AdaptiveInput = forwardRef<IAdaptiveInputForwardProps, IAdaptiveInputProps>(
  ({ onChange, onFocus, onBlur }, ref) => {
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
      value() {
        return value;
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
        <StyledHiddenInput
          value={value}
          onChange={handleChange}
          style={{
            width: `${width}px`,
          }}
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <span style={{ visibility: "hidden", position: "absolute", whiteSpace: "pre" }} ref={spanRef} />
      </>
    );
  }
);

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

export interface ISearchBoxProps<T extends number | string> {
  selectedItems: IOptionType<T>;
  onFilter?: (text: string) => void;
  onClear: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
  onLabelDelete: (e: React.MouseEvent<HTMLOrSVGElement> | React.KeyboardEvent, item: ISelectItem<T>) => void;
}

export interface ISearchBoxForwardProps {
  clear: () => void;
  focus: () => void;
}

const SearchBox = <T extends number | string>(
  { onFilter, selectedItems, onLabelDelete, onClear }: ISearchBoxProps<T>,
  ref: React.Ref<ISearchBoxForwardProps>
) => {
  const inputRef = useRef<IAdaptiveInputForwardProps>(null);
  const { theme } = useTheme();
  const [isFocus, setIsFocus] = useState(false);

  useImperativeHandle(ref, () => ({
    clear() {
      inputRef.current?.clear();
    },
    focus() {
      inputRef.current?.focus();
    },
  }));

  const handleCrossIconClick = useCallback(
    (e: React.MouseEvent<HTMLOrSVGElement>, item: ISelectItem<T>) => {
      // prevent bubble to StyledBox
      e.stopPropagation();
      onLabelDelete(e, item);
    },
    [onLabelDelete]
  );

  const handleBackspace = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Backspace" || !selectedItems.length || inputRef.current?.value().length) {
        return;
      }
      e.stopPropagation();
      onLabelDelete(e, selectedItems[selectedItems.length - 1]);
    },
    [onLabelDelete, selectedItems]
  );

  return (
    <Container onKeyDown={handleBackspace}>
      <StyledBox onClick={() => inputRef.current?.focus()} isFocus={isFocus}>
        <LabelsContainer>
          {selectedItems?.map((item) => (
            <SelectedLabel key={item.value}>
              {item.icon ? (
                typeof item.icon === "string" ? (
                  <ItemIcon alt={item.label} src={item.icon} />
                ) : (
                  item.icon
                )
              ) : null}
              <span>{item.label}</span>
              <CrossIcon color={theme.card.background} onClick={(e) => handleCrossIconClick(e, item)} />
            </SelectedLabel>
          ))}
          <AdaptiveInput
            ref={inputRef}
            onChange={onFilter}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </LabelsContainer>
        <RemoveIconContainer>
          <CrossIcon color={theme.colors.textSubtle} onClick={onClear} />
        </RemoveIconContainer>
      </StyledBox>
    </Container>
  );
};
export default forwardRef(SearchBox) as <T extends string | number>(
  props: ISearchBoxProps<T> & { ref?: React.Ref<IAdaptiveInputForwardProps> }
) => ReturnType<typeof SearchBox>;
