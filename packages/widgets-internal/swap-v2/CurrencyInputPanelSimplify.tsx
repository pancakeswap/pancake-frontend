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
}: CurrencyInputPanelProps) {
  return (
    <AtomBox position="relative" id={id} display="grid" gap="4px">
      <AtomBox display="flex" alignItems="center" justifyContent="space-between">
        {top}
      </AtomBox>
      <AtomBox
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        position="relative"
        backgroundColor="backgroundAlt"
        zIndex="1"
      >
        <AtomBox
          as="label"
          className={SwapCSS.inputContainerVariants({
            showBridgeWarning: !!showBridgeWarning,
            error: Boolean(error),
          })}
        >
          <AtomBox
            display="flex"
            flexDirection="row"
            flexWrap="nowrap"
            color="text"
            fontSize="12px"
            lineHeight="16px"
            px="16px"
            py="12px"
            className="targetInput"
            position="relative"
          >
            {inputLeft}
            <NumericalInput
              error={Boolean(error)}
              disabled={disabled}
              loading={loading}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onFocus={onInputFocus}
              onUserInput={(val) => {
                onUserInput(val);
              }}
            />
          </AtomBox>
          {bottom}
        </AtomBox>
      </AtomBox>
    </AtomBox>
  );
}
