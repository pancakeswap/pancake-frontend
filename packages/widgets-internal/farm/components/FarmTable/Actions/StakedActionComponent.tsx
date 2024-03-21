import { useTranslation } from "@pancakeswap/localization";
import { AddIcon, IconButton, MinusIcon, Text } from "@pancakeswap/uikit";
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

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold color="secondary" fontSize="12px" pr="4px">
          {lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Staked")}
        </Text>
      </ActionTitles>
      <ActionContent style={{ gap: 16, width: "100%" }}>
        {children}
        <IconButtonWrapper>
          <IconButton mr="6px" variant="secondary" disabled={disabledMinusButton} onClick={onPresentWithdraw}>
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton variant="secondary" disabled={disabledPlusButton} onClick={onPresentDeposit}>
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
        {bCakeInfoSlot}
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakedActionComponent;
