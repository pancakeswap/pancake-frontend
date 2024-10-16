import { AtomBox, SwapCSS } from "@pancakeswap/uikit";

import { NumericalInput, NumericalInputProps } from "./NumericalInput";

interface CurrencyInputPanelProps extends Omit<NumericalInputProps, "onBlur" | "OnFocus"> {
  onInputBlur?: () => void;
  onInputFocus?: () => void;
  id: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  inputLeft?: React.ReactNode;
  showBridgeWarning?: boolean;
  inputFontSize?: string;
  wrapperRef?: React.RefObject<HTMLDivElement>;
  inputRef?: React.RefObject<HTMLInputElement>;
}
export function CurrencyInputPanelSimplify({
  value,
  onUserInput,
  onInputBlur,
  onInputFocus,
  top,
  bottom,
  id,
  disabled,
  error,
  loading,
  showBridgeWarning,
  inputLeft,
  inputFontSize,
  wrapperRef,
  inputRef,
}: CurrencyInputPanelProps) {
  return (
    <AtomBox position="relative" id={id} display="grid" gap="4px">
      <AtomBox display="flex" alignItems="center" justifyContent="space-between" mb="8px">
        {top}
      </AtomBox>
      <AtomBox
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        position="relative"
        backgroundColor="backgroundAlt"
        zIndex="1"
        ref={wrapperRef}
      >
        <AtomBox
          as="label"
          className={SwapCSS.inputContainerVariants({
            showBridgeWarning: !!showBridgeWarning,
            error: Boolean(error),
          })}
          style={{ borderRadius: "24px" }}
        >
          <AtomBox
            display="flex"
            flexDirection="row-reverse"
            flexWrap="nowrap"
            color="text"
            fontSize="12px"
            lineHeight="16px"
            px="16px"
            py="0px"
            className="targetInput"
            position="relative"
            style={{ height: 80 }}
          >
            <NumericalInput
              error={Boolean(error)}
              disabled={disabled}
              loading={loading}
              inputRef={inputRef}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onFocus={onInputFocus}
              onUserInput={(val) => {
                onUserInput(val);
              }}
              fontSize={inputFontSize}
              padding={bottom ? "0 0 16px" : undefined}
            />
            {inputLeft}
          </AtomBox>
          {bottom}
        </AtomBox>
      </AtomBox>
    </AtomBox>
  );
}
