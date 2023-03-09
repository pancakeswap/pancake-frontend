import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { PositionDetails } from "@pancakeswap/farms";
import { Text } from "../../../../components/Text";
import { Button } from "../../../../components/Button";
import { Flex, Box } from "../../../../components/Box";
import { Heading } from "../../../../components/Heading";
import { Balance } from "../../../../components/Balance";

const LightGreyCard = styled("div")`
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: ${({ theme }) => theme.radii.card};
`;

interface TotalStakedBalanceProps {
  stakedPositions: PositionDetails[];
  onClickViewAllButton: () => void;
}

const TotalStakedBalance: React.FunctionComponent<React.PropsWithChildren<TotalStakedBalanceProps>> = ({
  stakedPositions,
  onClickViewAllButton,
}) => {
  const { t } = useTranslation();

  return (
    <Box mt="24px">
      <Text fontSize="12px" bold color="textSubtle" mb="8px">
        {t("%totalStakedFarm% Staked Farming", { totalStakedFarm: stakedPositions.length })}
      </Text>
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
                <Heading>123</Heading>
                <Balance fontSize="12px" color="textSubtle" decimals={2} value={123} unit=" USD" prefix="~" />
              </Flex>
            </Box>
          </Flex>
          <Button style={{ alignSelf: "center" }} onClick={onClickViewAllButton}>
            {t("View All")}
          </Button>
        </Flex>
      </LightGreyCard>
    </Box>
  );
};

export default TotalStakedBalance;
