import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useTheme } from "@pancakeswap/hooks";
import { IOptionType, ISelectItem } from "./types";
import { Box } from "../Box";
import { CrossIcon } from "../Svg";

export const BORDER_RADIUS = "16px";

const Container = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

const StyledBox = styled(Box)<{ isFocus: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: ${BORDER_RADIUS};
  line-height: 24px;
  margin: 16px;
  padding: 5px 8px;
  min-height: 42px;
  ${({ isFocus }) => isFocus && `box-shadow: 0px 0px 0px 4px #7645D933, 0px 0px 0px 1px #7645D9;`}
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
  handleLabelDelete: (item: ISelectItem<T>) => void;
}

const SearchBox = <T extends number | string>(
  { onFilter, selectedItems, handleLabelDelete }: ISearchBoxProps<T>,
  ref: React.Ref<IAdaptiveInputForwardProps>
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
      handleLabelDelete(item);
    },
    [handleLabelDelete]
  );

  return (
    <Container>
      <StyledBox onClick={() => inputRef.current?.focus()} isFocus={isFocus}>
        {selectedItems?.map((item) => (
          <SelectedLabel>
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
      </StyledBox>
    </Container>
  );
};
export default forwardRef(SearchBox) as <T extends string | number>(
  props: ISearchBoxProps<T> & { ref?: React.Ref<IAdaptiveInputForwardProps> }
) => ReturnType<typeof SearchBox>;
