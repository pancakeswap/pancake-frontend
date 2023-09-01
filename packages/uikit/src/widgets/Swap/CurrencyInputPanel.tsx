import { AtomBox } from "@pancakeswap/ui";
import { Lalezar } from "next/font/google";
import { inputContainerVariants } from "./SwapWidget.css";

import { NumericalInput, NumericalInputProps } from "./NumericalInput";
import { Text } from "../../components";

const lalezar = Lalezar({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type ZapStyle = "noZap" | "zap";

interface CurrencyInputPanelProps extends Omit<NumericalInputProps, "onBlur"> {
  onInputBlur?: () => void;
  id: string;
  zapStyle?: ZapStyle;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  showBridgeWarning?: boolean;
  title?: string;
}
export function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  zapStyle,
  top,
  bottom,
  id,
  disabled,
  error,
  loading,
  showBridgeWarning,
  title,
}: CurrencyInputPanelProps) {
  return (
    <AtomBox position="relative" id={id} display="grid" gap="4px">
      <AtomBox
        display="grid"
        flexWrap="nowrap"
        position="relative"
        // backgroundColor="backgroundAlt"
        style={{ backgroundColor: "#00000066", borderRadius: "10px", gridTemplateColumns: "1fr auto" }}
        zIndex="1"
        pl="24px"
        py="14px"
      >
        <AtomBox
          as="label"
          className={inputContainerVariants({
            hasZapStyle: !!zapStyle,
            showBridgeWarning: !!showBridgeWarning,
            error: Boolean(error),
          })}
          style={{ width: "100%" }}
        >
          <Text style={{ color: "#A5A5A5", fontSize: "20px" }}>{title}</Text>
          <AtomBox display="flex" flexDirection="row" flexWrap="nowrap" color="text" fontSize="12px" lineHeight="16px">
            <NumericalInput
              error={Boolean(error)}
              disabled={disabled}
              loading={loading}
              className={`${lalezar.className} token-amount-input`}
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val);
              }}
            />
          </AtomBox>
          {bottom}
        </AtomBox>
        <AtomBox display="flex" alignItems="center" justifyContent="space-between" style={{ paddingRight: "20px" }}>
          {top}
        </AtomBox>
        {error ? (
          <Text pb="8px" fontSize="12px" color="red">
            {error}
          </Text>
        ) : null}

        {disabled && (
          <AtomBox role="presentation" position="absolute" inset="0px" backgroundColor="backgroundAlt" opacity="0.6" />
        )}
      </AtomBox>
    </AtomBox>
  );
}
