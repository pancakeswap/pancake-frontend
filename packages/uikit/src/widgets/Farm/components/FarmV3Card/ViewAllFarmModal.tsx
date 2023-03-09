import styled from "styled-components";
import { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { ModalContainer, ModalCloseButton, ModalBody, ModalActions, ModalProps } from "../../../Modal";
import { Link } from "../../../../components/Link";
import { Text } from "../../../../components/Text";
import { Button } from "../../../../components/Button";
import Flex from "../../../../components/Box/Flex";
import Tags from "../Tags";
import { Tag } from "../../../../components/Tag";

const { StableFarmTag, BoostedTag, FarmAuctionTag } = Tags;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`;

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  max-height: 90vh;

  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 60vh;
  }
`;

interface ViewAllFarmModalProps extends ModalProps {
  isReady: boolean;
  lpSymbol: string;
  liquidityUrlPathParts: string;
  tokenPairImage: ReactNode;
  isStable?: boolean;
  boosted?: boolean;
  isCommunityFarm?: boolean;
  multiplier: string;
  children: ReactNode;
}

const ViewAllFarmModal: React.FunctionComponent<React.PropsWithChildren<ViewAllFarmModalProps>> = ({
  isReady,
  lpSymbol,
  liquidityUrlPathParts,
  tokenPairImage,
  isStable,
  boosted,
  isCommunityFarm,
  multiplier,
  children,
  onDismiss,
}) => {
  const { t } = useTranslation();

  return (
    <ModalContainer padding="24px" $minWidth="300px">
      <ModalHeader>
        <Flex alignSelf="center" width="100%">
          {tokenPairImage}
          <Text bold m="0 8px">
            {lpSymbol.split(" ")[0]}
          </Text>
          <Flex justifyContent="center">
            {isReady && multiplier && (
              <Tag mr="4px" variant="secondary">
                {multiplier}
              </Tag>
            )}
            {isReady && isStable && <StableFarmTag mr="4px" />}
            {isReady && boosted && <BoostedTag mr="4px" />}
            {isReady && isCommunityFarm && <FarmAuctionTag />}
          </Flex>
        </Flex>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody mt="16px" width={["100%", "100%", "100%", "416px"]}>
        <ScrollableContainer>{children}</ScrollableContainer>
      </ModalBody>
      <ModalActions>
        <StyledLink external href={liquidityUrlPathParts}>
          <Button width="100%" variant="secondary">
            {t("Add Liquidity")}
          </Button>
        </StyledLink>
      </ModalActions>
    </ModalContainer>
  );
};

export default ViewAllFarmModal;
