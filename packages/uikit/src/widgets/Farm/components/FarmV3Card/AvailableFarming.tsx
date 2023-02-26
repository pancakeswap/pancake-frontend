import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../../../../components/Text";
import { Button } from "../../../../components/Button";
import { Flex, Box } from "../../../../components/Box";

const LightGreyCard = styled("div")`
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: ${({ theme }) => theme.radii.card};
`;

interface AvailableFarmingProps {
  lpSymbol: string;
  onClickViewAllButton: () => void;
}

const AvailableFarming: React.FunctionComponent<React.PropsWithChildren<AvailableFarmingProps>> = ({
  lpSymbol,
  onClickViewAllButton,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text fontSize="12px" bold color="textSubtle" mb="8px">
        {t("%totalAvailableFarm% LP Available for Farming", { totalAvailableFarm: 2 })}
      </Text>
      <LightGreyCard>
        <Flex padding="16px" justifyContent="space-between">
          <Flex flexDirection="column">
            <Text bold color="textSubtle" mb="4px">
              {lpSymbol}
            </Text>
            <Box>
              <Text fontSize="12px" color="textSubtle">
                (#0123456)
              </Text>
              <Text fontSize="12px" color="textSubtle">
                (#0123456)
              </Text>
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

export default AvailableFarming;
