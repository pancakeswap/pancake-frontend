import { styled } from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { PositionDetails } from "@pancakeswap/farms";
import { PreTitle, Text, Button, Flex, Box } from "@pancakeswap/uikit";

const LightGreyCard = styled("div")`
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: ${({ theme }) => theme.radii.card};
`;

interface AvailableFarmingProps {
  lpSymbol: string;
  unstakedPositions: PositionDetails[];
  onClickViewAllButton: () => void;
}

const AvailableFarming: React.FunctionComponent<React.PropsWithChildren<AvailableFarmingProps>> = ({
  lpSymbol,
  unstakedPositions,
  onClickViewAllButton,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <PreTitle color="textSubtle" mb="8px">
        {t("%totalAvailableFarm% LP Available for Farming", { totalAvailableFarm: unstakedPositions.length })}
      </PreTitle>
      <LightGreyCard>
        <Flex padding="16px" justifyContent="space-between">
          <Flex flexDirection="column">
            <Text bold color="textSubtle" mb="4px">
              {lpSymbol}
            </Text>
            <Box>
              {unstakedPositions.map((position) => (
                <Text fontSize="12px" color="textSubtle" key={position.tokenId.toString()}>
                  {`(#${position.tokenId.toString()})`}
                </Text>
              ))}
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

export default AvailableFarming;
