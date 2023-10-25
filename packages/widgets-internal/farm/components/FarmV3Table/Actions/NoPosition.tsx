import { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { styled } from "styled-components";
import { Text, Button, Flex } from "@pancakeswap/uikit";

import { ActionTitles, ActionContent } from "./styles";

const ActionContainer = styled.div`
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
  }
`;

interface WalletNotConnectedProps {
  inactive: boolean;
  account?: string;
  boostedAction: ReactNode;
  connectWalletButton: ReactNode;
  hasNoPosition: boolean;
  onAddLiquidity: () => void;
}

const NoPosition: React.FunctionComponent<React.PropsWithChildren<WalletNotConnectedProps>> = ({
  inactive,
  account,
  hasNoPosition,
  boostedAction,
  connectWalletButton,
  onAddLiquidity,
}) => {
  const { t } = useTranslation();

  return (
    <Flex width="100%" flexDirection={["column-reverse", "column-reverse", "row"]}>
      {boostedAction && <ActionContainer style={{ minHeight: 124.5 }}>{boostedAction}</ActionContainer>}
      {account && hasNoPosition ? (
        <ActionContainer>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t("no position found")}
            </Text>
          </ActionTitles>
          {!inactive && (
            <ActionContent>
              <Button width="100%" onClick={onAddLiquidity}>
                {t("Add Liquidity")}
              </Button>
            </ActionContent>
          )}
        </ActionContainer>
      ) : (
        <ActionContainer>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t("Start Farming")}
            </Text>
          </ActionTitles>
          <ActionContent>{connectWalletButton}</ActionContent>
        </ActionContainer>
      )}
    </Flex>
  );
};

export default NoPosition;
