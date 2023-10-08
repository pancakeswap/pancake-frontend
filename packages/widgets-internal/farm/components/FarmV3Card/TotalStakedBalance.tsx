import { styled } from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { PositionDetails } from "@pancakeswap/farms";
import { PreTitle, Text, Button, Flex, Box, Heading, Balance } from "@pancakeswap/uikit";

const LightGreyCard = styled("div")`
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: ${({ theme }) => theme.radii.card};
`;

interface TotalStakedBalanceProps {
  stakedPositions: PositionDetails[];
  earnings: number;
  earningsBusd: number;
  onClickViewAllButton: () => void;
}

const TotalStakedBalance: React.FunctionComponent<React.PropsWithChildren<TotalStakedBalanceProps>> = ({
  stakedPositions,
  earnings,
  earningsBusd,
  onClickViewAllButton,
}) => {
  const { t } = useTranslation();

  return (
    <Box mt="24px">
      <PreTitle color="textSubtle" mb="8px">
        {t("%totalStakedFarm% Staked Farming", { totalStakedFarm: stakedPositions.length })}
      </PreTitle>
      <LightGreyCard>
        <Flex padding="16px" justifyContent="space-between">
          <Flex flexDirection="column">
            <Flex>
              <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
                CAKE
              </Text>
              <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                {t("Earned")}
              </Text>
            </Flex>
            <Box>
              <Flex flexDirection="column" alignItems="flex-start">
                <Heading>{earnings}</Heading>
                <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
              </Flex>
            </Box>
          </Flex>
          <Button style={{ alignSelf: "center", whiteSpace: "nowrap" }} onClick={onClickViewAllButton}>
            {t("View All")}
          </Button>
        </Flex>
      </LightGreyCard>
    </Box>
  );
};

export default TotalStakedBalance;
