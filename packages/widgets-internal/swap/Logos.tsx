import { Currency } from "@pancakeswap/swap-sdk-core";
import { Box, Spinner as Sp, SpinnerProps, Svg } from "@pancakeswap/uikit";
import { useRef } from "react";
import { styled, useTheme } from "styled-components";
import { CurrencyLogo } from "../components/CurrencyLogo";
import { AnimationType, FadeWrapper, RotationStyle, StyledSVG } from "./styles";
import { useUnmountingAnimation } from "./useUnmountingAnimation";

const LoadingIndicator = styled(LoaderV3)`
  stroke: grey;
  fill: grey;
  width: calc(80px + 16px);
  height: calc(80px + 16px);
  top: -7px;
  left: -7px;
  position: absolute;
  z-index: -100;
`;

const CurrencyLoaderContainer = styled(FadePresence)<{ asBadge: boolean }>`
  z-index: 2;
  border-radius: 50%;
  position: absolute;
  transition: all 250ms ease-in-out;
  height: ${({ asBadge }) => (asBadge ? "25px" : "80px")};
  width: ${({ asBadge }) => (asBadge ? "25px" : "80px")};
  bottom: ${({ asBadge }) => (asBadge ? "-4px" : 0)};
  right: ${({ asBadge }) => (asBadge ? "-4px" : 0)};
  outline: ${({ theme, asBadge }) => (asBadge ? `2px solid ${theme.background}` : "")};
`;

const RaisedCurrencyLogo = styled(CurrencyLogo)`
  z-index: 1;
`;
const AllowanceIconCircle = styled(FadePresence)<{ width: number; height: number; showSpinner: boolean }>`
  display: flex;
  position: relative;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background-color: ${({ showSpinner, theme }) => (showSpinner ? "transparent" : theme.colors.primary)};
  z-index: 5;
`;
const PermitIcon = () => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.2601 18.3918C12.9161 18.5558 12.5141 18.6779 12.0591 18.7599L5.48907 19.9099C3.29907 20.2999 2.00896 19.3999 1.62896 17.2099L0.0891657 8.45987C-0.300834 6.26987 0.599117 4.97988 2.78912 4.58988L4.58697 4.27384C4.79197 4.23784 4.97114 4.41686 4.93414 4.62186L3.75811 11.2799C3.22811 14.3099 4.65803 16.3499 7.67803 16.8799C7.67803 16.8799 12.8971 17.7969 13.1661 17.8489C13.4981 17.9088 13.5511 18.2628 13.2601 18.3918ZM19.9131 5.10587L18.3689 13.8598C17.997 15.9678 16.7811 16.8688 14.7361 16.5888C14.6581 16.5778 14.5881 16.5779 14.5071 16.5639L7.94195 15.4059C5.75295 15.0199 4.85209 13.7329 5.23809 11.5439L6.58111 3.92783L6.78204 2.78983C7.16804 0.600828 8.4551 -0.300151 10.6441 0.0858488L17.21 1.24387C19.398 1.62987 20.2991 2.91787 19.9131 5.10587ZM13.554 11.8958C13.626 11.4878 13.3541 11.0988 12.9461 11.0268L8.8421 10.3028C8.4361 10.2298 8.04518 10.5039 7.97418 10.9109C7.90218 11.3189 8.17409 11.7079 8.58209 11.7799L12.6861 12.5039C12.7301 12.5119 12.7739 12.5149 12.8169 12.5149C13.1739 12.5159 13.49 12.2598 13.554 11.8958ZM16.597 9.03482C16.669 8.62682 16.3971 8.23787 15.9891 8.16587L9.42413 7.00785C9.02013 6.93685 8.62696 7.20888 8.55596 7.61588C8.48396 8.02388 8.75612 8.41284 9.16412 8.48484L15.7291 9.64286C15.7731 9.65086 15.8172 9.65384 15.8602 9.65384C16.2172 9.65384 16.533 9.39782 16.597 9.03482ZM17.2972 5.77286C17.3692 5.36486 17.097 4.97584 16.689 4.90384L10.1241 3.74582C9.72008 3.67382 9.32716 3.94685 9.25616 4.35385C9.18416 4.76185 9.45607 5.15087 9.86407 5.22287L16.429 6.38083C16.473 6.38883 16.5171 6.39188 16.5601 6.39188C16.9171 6.39288 17.2332 6.13686 17.2972 5.77286Z"
        fill="#F5F6FC"
      />
    </Svg>
  );
};

export function LoaderV3({ size = "4px", ...rest }: { size?: string; [k: string]: any }) {
  const theme = useTheme();
  return (
    <StyledRotatingSVG
      size={size}
      viewBox="0 0 54 54"
      xmlns="http://www.w3.org/2000/svg"
      fill={theme.colors.textSubtle ?? ""}
      stroke={theme.colors.textSubtle ?? ""}
      strokeWidth={0.1}
      {...rest}
    >
      <path
        opacity="0.1"
        d="M53.6666 26.9999C53.6666 41.7275 41.7276 53.6666 27 53.6666C12.2724 53.6666 0.333313 41.7275 0.333313 26.9999C0.333313 12.2723 12.2724 0.333252 27 0.333252C41.7276 0.333252 53.6666 12.2723 53.6666 26.9999ZM8.33331 26.9999C8.33331 37.3092 16.6907 45.6666 27 45.6666C37.3093 45.6666 45.6666 37.3092 45.6666 26.9999C45.6666 16.6906 37.3093 8.33325 27 8.33325C16.6907 8.33325 8.33331 16.6906 8.33331 26.9999Z"
        fill={theme.colors.textSubtle ?? ""}
      />
      <path
        d="M49.6666 26.9999C51.8758 26.9999 53.6973 25.1992 53.3672 23.0149C53.0452 20.884 52.4652 18.7951 51.6368 16.795C50.2966 13.5597 48.3324 10.62 45.8562 8.14374C43.3799 5.66751 40.4402 3.70326 37.2049 2.36313C35.2048 1.53466 33.1159 0.954747 30.985 0.632693C28.8007 0.30256 27 2.12411 27 4.33325C27 6.54239 28.8108 8.29042 30.9695 8.76019C32.0523 8.99585 33.1146 9.32804 34.1434 9.75417C36.4081 10.6923 38.4659 12.0672 40.1993 13.8006C41.9327 15.534 43.3076 17.5918 44.2457 19.8565C44.6719 20.8853 45.004 21.9476 45.2397 23.0304C45.7095 25.1891 47.4575 26.9999 49.6666 26.9999Z"
        fill={theme.colors.textSubtle ?? ""}
      />
    </StyledRotatingSVG>
  );
}

export const StyledRotatingSVG = styled(StyledSVG)`
  ${RotationStyle}
`;

export function FadePresence({
  children,
  className,
  $scale = false,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  $scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useUnmountingAnimation(ref, () => AnimationType.EXITING);
  return (
    <FadeWrapper ref={ref} className={className} $scale={$scale} {...rest}>
      {children}
    </FadeWrapper>
  );
}

export const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = () => {
  const ref = useRef<HTMLDivElement>(null);
  useUnmountingAnimation(ref, () => AnimationType.EXITING);
  return (
    <FadePresence $scale>
      <Sp />
    </FadePresence>
  );
};

export function CurrencyLoader({ currency, asBadge = false }: { currency?: Currency; asBadge?: boolean }) {
  return (
    <CurrencyLoaderContainer asBadge={asBadge} data-testid={`pending-modal-currency-logo-${currency?.symbol}`} $scale>
      <RaisedCurrencyLogo currency={currency} size="100%" />
    </CurrencyLoaderContainer>
  );
}

export const ApprovalPhaseIcon = ({
  size = 80,
  currency,
  asBadge,
}: {
  size?: number;
  currency: Currency;
  asBadge: boolean;
}) => {
  return (
    <AllowanceIconCircle width={size} height={size} showSpinner={false} $scale>
      <LoadingIndicatorOverlay />
      <PermitIcon />
      <CurrencyLoader currency={currency} asBadge={asBadge} />
    </AllowanceIconCircle>
  );
};

export const PendingSwapConfirmationIcon = ({ size = 128 }: { size?: number }) => {
  return (
    <AllowanceIconCircle width={size} height={size * 1.197} showSpinner>
      <Box marginBottom="44px">
        <Spinner />
      </Box>
    </AllowanceIconCircle>
  );
};

export function LoadingIndicatorOverlay() {
  return (
    <FadePresence>
      <LoadingIndicator />
    </FadePresence>
  );
}
