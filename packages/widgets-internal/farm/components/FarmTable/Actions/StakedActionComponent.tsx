import { useTranslation } from "@pancakeswap/localization";
import { AddIcon, Flex, IconButton, MinusIcon, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import { ReactNode } from "react";
import { ActionContent, ActionTitles, IconButtonWrapper, StyledActionContainer } from "./styles";

export interface StakedActionComponentProps {
  lpSymbol: string;
  children?: ReactNode;
  disabledMinusButton?: boolean;
  disabledPlusButton?: boolean;
  onPresentWithdraw: () => void;
  onPresentDeposit: () => void;
  bCakeInfoSlot?: React.ReactElement;
}

const StakedActionComponent: React.FunctionComponent<React.PropsWithChildren<StakedActionComponentProps>> = ({
  lpSymbol,
  children,
  disabledMinusButton,
  disabledPlusButton,
  onPresentWithdraw,
  onPresentDeposit,
  bCakeInfoSlot,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  return (
    <StyledActionContainer
      style={
        bCakeInfoSlot
          ? {
              paddingBottom: isMobile ? undefined : 0,
              paddingTop: isMobile ? undefined : 0,
              display: "flex",
              alignItems: "center",
              minHeight: isMobile ? "auto" : undefined,
            }
          : undefined
      }
    >
      {!bCakeInfoSlot && (
        <ActionTitles style={{ marginBottom: 0 }}>
          <Text bold color="secondary" fontSize="12px" pr="4px">
            {lpSymbol}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t("Staked")}
          </Text>
        </ActionTitles>
      )}
      <ActionContent style={{ gap: 16, width: "100%", flexDirection: isMobile && bCakeInfoSlot ? "column" : "row" }}>
        <Flex
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          flexBasis={bCakeInfoSlot ? "33%" : undefined}
        >
          {children}
          <IconButtonWrapper>
            <IconButton mr="6px" variant="secondary" disabled={disabledMinusButton} onClick={onPresentWithdraw}>
              <MinusIcon color="primary" width="14px" />
            </IconButton>
            <IconButton variant="secondary" disabled={disabledPlusButton} onClick={onPresentDeposit}>
              <AddIcon color="primary" width="14px" />
            </IconButton>
          </IconButtonWrapper>
        </Flex>
        {bCakeInfoSlot}
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakedActionComponent;
