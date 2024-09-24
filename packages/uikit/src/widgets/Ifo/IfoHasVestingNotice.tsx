import { useTranslation } from "@pancakeswap/localization";
import { Box, Message, Text } from "../../components";
import { IfoMessageTextLink } from "./styleds";

const IfoHasVestingNotice: React.FC<React.PropsWithChildren<{ url: string }>> = ({ url }) => {
  const { t } = useTranslation();

  return (
    <Box maxWidth="350px">
      <Message variant="primary" mb="16px">
        <Box>
          <Text fontSize="14px">
            {t("This IFO has token vesting. Purchased tokens are released over a period of time.")}
          </Text>
          <IfoMessageTextLink external href={url} color="#1FC7D4" display="inline">
            {t("Learn more")}
          </IfoMessageTextLink>
        </Box>
      </Message>
    </Box>
  );
};

export default IfoHasVestingNotice;
