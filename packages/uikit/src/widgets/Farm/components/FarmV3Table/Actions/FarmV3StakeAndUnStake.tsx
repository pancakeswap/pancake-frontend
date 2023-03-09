import styled from "styled-components";
import { PositionDetails } from "@pancakeswap/farms";
import { useTranslation } from "@pancakeswap/localization";
import { Token } from "@pancakeswap/swap-sdk-core";
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

type PositionType = "staked" | "unstaked";

interface FarmV3StakeAndUnStakeProps {
  title: string;
  liquidityUrl: string;
  position: PositionDetails;
  token: Token;
  quoteToken: Token;
  positionType: PositionType;
  isPending: boolean;
  handleStake: () => void;
  handleUnStake: () => void;
}

const FarmV3StakeAndUnStake: React.FunctionComponent<React.PropsWithChildren<FarmV3StakeAndUnStakeProps>> = ({
  title,
  liquidityUrl,
  token,
  quoteToken,
  position,
  positionType,
  isPending,
  handleStake,
  handleUnStake,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledLink external href={liquidityUrl}>
        <Text bold color="secondary">
          {title}
        </Text>
        <ChevronRightIcon color="secondary" fontSize="12px" />
      </StyledLink>
      <Flex justifyContent="space-between">
        <Box>
          <Text bold fontSize={["12px", "12px", "12px", "14px"]}>
            {t("Min %minAmount%/ Max %maxAmount% %token% per %quoteToken%", {
              minAmount: 0.123,
              maxAmount: 0.234,
              token: token.symbol,
              quoteToken: quoteToken.symbol,
            })}
          </Text>
          <Box>
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={852} unit=" USD" prefix="~" />
            <Flex style={{ gap: "4px" }}>
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                value={position.tokensOwed0.toNumber()}
                unit={` ${token.symbol}`}
              />
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                value={position.tokensOwed1.toNumber()}
                unit={` ${quoteToken.symbol}`}
              />
            </Flex>
          </Box>
        </Box>
        {positionType === "unstaked" ? (
          <Button width={["120px"]} style={{ alignSelf: "center" }} disabled={isPending} onClick={handleStake}>
            {t("Stake")}
          </Button>
        ) : (
          <Button
            variant="secondary"
            width={["120px"]}
            style={{ alignSelf: "center" }}
            disabled={isPending}
            onClick={handleUnStake}
          >
            {t("Unstake")}
          </Button>
        )}
      </Flex>
    </>
  );
};

export default FarmV3StakeAndUnStake;
