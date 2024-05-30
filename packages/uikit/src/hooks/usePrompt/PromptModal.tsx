import { useTranslation } from "@pancakeswap/localization";
import { useState } from "react";
import { BoxProps } from "../../components/Box";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import FlexGap from "../../components/Layouts/FlexGap";
import { Text } from "../../components/Text";
import Modal from "../../widgets/Modal/Modal";
import { ModalV2, ModalV2Props } from "../../widgets/Modal/ModalV2";

type PromptModalProps = ModalV2Props &
  BoxProps & {
    title?: string;
    message?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (value: string) => void;
  };

export const PromptModal: React.FC<PromptModalProps> = ({
  title = "Warning",
  message,
  defaultValue,
  placeholder,
  confirmText,
  cancelText,
  onConfirm,
  onDismiss,
  ...props
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue ?? "");
  const handleConfirm = () => {
    onConfirm(value);
    setValue(defaultValue ?? "");
    onDismiss?.();
  };

  return (
    <ModalV2 onDismiss={onDismiss} {...props} id="xxxxx">
      <Modal title={t(title)} headerBackground="gradientCardHeader" minHeight="0" hideCloseButton>
        <FlexGap flexDirection="column" gap="20px" mt="auto">
          <Text>{message}</Text>
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
          <FlexGap gap="12px">
            <Button onClick={onDismiss} ml="auto" variant="secondary">
              {cancelText ?? t("Cancel")}
            </Button>
            <Button onClick={handleConfirm}>{confirmText ?? t("OK")}</Button>
          </FlexGap>
        </FlexGap>
      </Modal>
    </ModalV2>
  );
};
