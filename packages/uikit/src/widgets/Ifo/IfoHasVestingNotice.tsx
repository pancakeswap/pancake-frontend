import { useTranslation } from "@pancakeswap/localization";
import { Box, Message, Text } from "../../components";
import { IfoMessageTextLink } from "./styleds";

const IfoHasVestingNotice: React.FC<React.PropsWithChildren<{ url: string }>> = ({ url }) => {
  const { t } = useTranslation();

  return (
    <Box maxWidth="350px">
      <Message variant="warning" mb="16px">
        <Box>
          <Text fontSize="14px" color="#D67E0A">
            {t("This IFO has token vesting. Purchased tokens are released over a period of time.")}
          </Text>
          <IfoMessageTextLink external href={url} color="#D67E0A" display="inline">
            {t("Learn more in the vote proposal")}
          </IfoMessageTextLink>
        </Box>
      </Message>
    </Box>
  );
};

export default IfoHasVestingNotice;
