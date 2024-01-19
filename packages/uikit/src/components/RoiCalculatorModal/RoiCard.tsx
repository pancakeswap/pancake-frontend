import { useTranslation } from "@pancakeswap/localization";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { Box, Flex } from "../Box";
import { IconButton } from "../Button";
import { Input } from "../Input";
import { CheckmarkIcon, PencilIcon } from "../Svg";
import { Text } from "../Text";
import { CalculatorMode, RoiCalculatorDataState } from "./useRoiCalculatorReducer";

export const MILLION = 1000000;
export const TRILLION = 1000000000000;

export const RoiCardWrapper = styled(Box)`
  background: linear-gradient(180deg, #53dee9, #7645d9);
  padding: 1px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
`;

export const RoiCardInner = styled(Box)`
  min-height: 120px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`;

export const RoiInputContainer = styled(Box)`
  position: relative;
  & > input {
    padding-left: 28px;
    max-width: 70%;
  }
  &:before {
    position: absolute;
    content: "$";
    color: ${({ theme }) => theme.colors.textSubtle};
    left: 16px;
    top: 8px;
  }
`;

export const RoiDisplayContainer = styled(Flex)`
  max-width: 82%;
  margin-right: 8px;
`;

export const RoiDollarAmount = styled(Text)<{ fadeOut: boolean }>`
  position: relative;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 0px;
  }

  ${({ fadeOut, theme }) =>
    fadeOut &&
    `
      &:after {
        background: linear-gradient(
          to right,
          ${theme.colors.background}00,
          ${theme.colors.background}E6
        );
        content: '';
        height: 100%;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
      }
  `}
`;

export interface RoiCalculatorCardState {
  controls: {
    mode: CalculatorMode;
  };
  data: Omit<RoiCalculatorDataState, "principalAsToken" | "principalAsUSD">;
}

interface RoiCardProps {
  earningTokenSymbol: string;
  calculatorState: RoiCalculatorCardState;
  setTargetRoi?: (amount: string) => void;
  setCalculatorMode?: (mode: CalculatorMode) => void;
}

const RoiCard: React.FC<React.PropsWithChildren<RoiCardProps>> = ({
  calculatorState,
  setTargetRoi,
  setCalculatorMode,
}) => {
  const [expectedRoi, setExpectedRoi] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roiUSD, roiPercentage } = calculatorState.data;
  const { mode } = calculatorState.controls;

  const { t } = useTranslation();

  useEffect(() => {
    if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const onEnterEditing = () => {
    if (setCalculatorMode) setCalculatorMode(CalculatorMode.PRINCIPAL_BASED_ON_ROI);
    setExpectedRoi(
      roiUSD.toLocaleString("en", {
        minimumFractionDigits: roiUSD > MILLION ? 0 : 2,
        maximumFractionDigits: roiUSD > MILLION ? 0 : 2,
      })
    );
  };

  const onExitRoiEditing = () => {
    if (setCalculatorMode) setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL);
  };
  const handleExpectedRoiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.validity.valid) {
      const roiAsString = event.target.value.replace(/,/g, ".");
      if (setTargetRoi) setTargetRoi(roiAsString);
      setExpectedRoi(roiAsString);
    }
  };
  return (
    <RoiCardWrapper>
      <RoiCardInner>
        <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
          {t("ROI at current rates")}
        </Text>
        <Flex justifyContent="space-between" mt="4px" height="36px">
          {mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI ? (
            <>
              <RoiInputContainer>
                <Input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+[.,]?[0-9]*$"
                  scale="sm"
                  value={expectedRoi}
                  placeholder="0.0"
                  onChange={handleExpectedRoiChange}
                />
              </RoiInputContainer>
              <IconButton scale="sm" variant="text" onClick={onExitRoiEditing}>
                <CheckmarkIcon color="primary" />
              </IconButton>
            </>
          ) : (
            <>
              <RoiDisplayContainer onClick={onEnterEditing}>
                {/* Dollar sign is separate cause its not supposed to scroll with a number if number is huge */}
                <Text fontSize="24px" bold>
                  $
                </Text>
                <RoiDollarAmount fontSize="24px" bold fadeOut={roiUSD > TRILLION}>
                  {roiUSD.toLocaleString("en", {
                    minimumFractionDigits: roiUSD > MILLION ? 0 : 2,
                    maximumFractionDigits: roiUSD > MILLION ? 0 : 2,
                  })}
                </RoiDollarAmount>
              </RoiDisplayContainer>
              {setTargetRoi && setCalculatorMode ? (
                <IconButton scale="sm" variant="text" onClick={onEnterEditing}>
                  <PencilIcon color="primary" />
                </IconButton>
              ) : null}
            </>
          )}
        </Flex>
        <Text fontSize="12px" color="textSubtle">
          <Text
            fontSize="12px"
            color="textSubtle"
            ml="3px"
            display="inline-block"
            maxWidth="100%"
            style={{ lineBreak: "anywhere" }}
          >
            {`${roiPercentage.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
          </Text>
        </Text>
      </RoiCardInner>
    </RoiCardWrapper>
  );
};

export default RoiCard;
