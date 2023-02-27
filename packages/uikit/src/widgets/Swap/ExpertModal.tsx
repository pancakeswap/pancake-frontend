import { useState } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Flex } from "../../components/Box";
import { Checkbox } from "../../components/Checkbox";
import { InjectedModalProps, Modal } from "../Modal";
import { Message } from "../../components/Message";
import { useMatchBreakpoints } from "../../contexts";

interface ExpertModalProps extends InjectedModalProps {
  setShowConfirmExpertModal: (show: boolean) => void;
  setShowExpertModeAcknowledgement: (show: boolean) => void;
  toggleExpertMode: () => void;
}

export const ExpertModal: React.FC<React.PropsWithChildren<ExpertModalProps>> = ({
  setShowConfirmExpertModal,
  setShowExpertModeAcknowledgement,
  toggleExpertMode,
}) => {
  const [isRememberChecked, setIsRememberChecked] = useState(false);
  const { isMobile } = useMatchBreakpoints();

  const { t } = useTranslation();

  return (
    <Modal
      title={t("Expert Mode")}
      onBack={() => setShowConfirmExpertModal(false)}
      onDismiss={() => setShowConfirmExpertModal(false)}
      headerBackground="gradientCardHeader"
      style={{ width: isMobile ? "100%" : "436px" }}
    >
      <Message variant="warning" mb="24px">
        <Text>
          {t(
            "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds."
          )}
        </Text>
      </Message>
      <Text mb="24px">{t("Only use this mode if you know what you’re doing.")}</Text>
      <Flex alignItems="center" mb="24px">
        <Checkbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={() => setIsRememberChecked(!isRememberChecked)}
          scale="sm"
        />
        <Text ml="10px" color="textSubtle" style={{ userSelect: "none" }}>
          {t("Don’t show this again")}
        </Text>
      </Flex>
      <Button
        mb="8px"
        id="confirm-expert-mode"
        onClick={() => {
          // eslint-disable-next-line no-alert
          if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === "confirm") {
            toggleExpertMode();
            setShowConfirmExpertModal(false);
            if (isRememberChecked) {
              setShowExpertModeAcknowledgement(false);
            }
          }
        }}
      >
        {t("Turn On Expert Mode")}
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setShowConfirmExpertModal(false);
        }}
      >
        {t("Cancel")}
      </Button>
    </Modal>
  );
};
