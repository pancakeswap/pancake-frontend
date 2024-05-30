import { useTranslation } from "@pancakeswap/localization";
import { Button, Checkbox, Flex, InjectedModalProps, Message, Modal, Text, usePrompt } from "@pancakeswap/uikit";
import { useCallback, useState } from "react";

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
  const onPromptConfirm = useCallback(
    (value: string) => {
      if (value === "confirm") {
        toggleExpertMode();
        setShowConfirmExpertModal(false);
        if (isRememberChecked) {
          setShowExpertModeAcknowledgement(false);
        }
      }
    },
    [toggleExpertMode, setShowConfirmExpertModal, isRememberChecked, setShowExpertModeAcknowledgement]
  );
  const prompt = usePrompt();
  const handlePrompt = useCallback(() => {
    prompt({
      message: 'Please type the word "confirm" to enable expert mode.',
      onConfirm: onPromptConfirm,
    });
  }, [onPromptConfirm, prompt]);

  const { t } = useTranslation();

  return (
    <Modal
      title={t("Expert Mode")}
      onBack={() => setShowConfirmExpertModal(false)}
      onDismiss={() => setShowConfirmExpertModal(false)}
      headerBackground="gradientCardHeader"
      width={["100%", "100%", "100%", "436px"]}
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
      <Flex flexDirection="column">
        <Button mb="8px" id="confirm-expert-mode" onClick={handlePrompt}>
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
      </Flex>
    </Modal>
  );
};
