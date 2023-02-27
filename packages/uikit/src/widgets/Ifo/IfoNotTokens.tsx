import { useTranslation } from "@pancakeswap/localization";
import { BunnyPlaceholderIcon, Flex, Text } from "../../components";
import { IfoMessageTextLink } from "./styleds";

const IfoNotTokens: React.FC<React.PropsWithChildren<{ participateText: string; showHowDoesItWork?: boolean }>> = ({
  participateText,
  showHowDoesItWork = true,
}) => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column">
      <BunnyPlaceholderIcon width={80} height={80} margin="auto" />
      <Flex flexDirection="column" alignItems="center" mt="16px" mb="24px">
        <Text bold mb="8px" textAlign="center">
          {t("You have no tokens available for claiming")}
        </Text>
        <Text fontSize="14px" color="textSubtle" textAlign="center">
          {participateText}
        </Text>
        {showHowDoesItWork && (
          <IfoMessageTextLink href="/ifo#ifo-how-to" color="primary" display="inline">
            {t("How does it work?")} »
          </IfoMessageTextLink>
        )}
      </Flex>
    </Flex>
  );
};

export default IfoNotTokens;
