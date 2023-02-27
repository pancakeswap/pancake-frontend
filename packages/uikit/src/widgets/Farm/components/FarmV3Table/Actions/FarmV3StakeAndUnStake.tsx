import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { Button } from "../../../../../components/Button";
import { Link } from "../../../../../components/Link";
import { Text } from "../../../../../components/Text";
import { ChevronRightIcon } from "../../../../../components/Svg";
import { Balance } from "../../../../../components/Balance";
import { Flex, Box } from "../../../../../components/Box";

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: initial;
  }
`;

interface FarmV3StakeAndUnStakeProps {
  title: string;
}

const FarmV3StakeAndUnStake: React.FunctionComponent<React.PropsWithChildren<FarmV3StakeAndUnStakeProps>> = ({
  title,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledLink href="/">
        <Text bold color="secondary">
          {title}
        </Text>
        <ChevronRightIcon color="secondary" fontSize="12px" />
      </StyledLink>
      <Flex justifyContent="space-between">
        <Box>
          <Text bold fontSize={["12px", "12px", "12px", "14px"]}>
            Min 0.123 / Max 0.234 BNB per CAKE
          </Text>
          <Box>
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={852} unit=" USD" prefix="~" />
            <Flex style={{ gap: "4px" }}>
              <Balance fontSize="12px" color="textSubtle" decimals={2} value={30} unit={` CAKE`} />
              <Balance fontSize="12px" color="textSubtle" decimals={2} value={1.23} unit={` BNB`} />
            </Flex>
          </Box>
        </Box>
        <Button width={["120px"]} style={{ alignSelf: "center" }}>
          {t("Stake")}
        </Button>
        {/* <Button width={["120px"]} style={{ alignSelf: "center" }}>
          {t("Enable")}
        </Button> */}
        {/* <Button variant="secondary" width={['120px']} style={{ alignSelf: 'center' }}>{t('Unstake')}</Button> */}
      </Flex>
    </>
  );
};

export default FarmV3StakeAndUnStake;
