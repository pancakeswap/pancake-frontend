import React from "react";
import { useTheme } from "styled-components";
import { Modal, useModal } from ".";
import { ModalProps } from "./types";
import Button from "../../components/Button/Button";
import Heading from "../../components/Heading/Heading";

export default {
  title: "Widgets/Modal",
  component: Modal,
  argTypes: {},
};

const CustomModal: React.FC<ModalProps> = ({ title, onDismiss, ...props }) => (
  <Modal title={title} onDismiss={onDismiss} {...props}>
    <Heading>{title}</Heading>
    <Button>This button Does nothing</Button>
  </Modal>
);

export const Default: React.FC = () => {
  const theme = useTheme();
  const [onPresent1] = useModal(<CustomModal title="Modal 1" />);
  const [onPresent2] = useModal(<CustomModal title="Modal 2" />);
  const [onPresent3] = useModal(<CustomModal title="Modal 3" headerBackground={theme.colors.gradients.cardHeader} />);
  return (
    <div>
      <Button onClick={onPresent1}>Open modal 1</Button>
      <Button onClick={onPresent2}>Open modal 2</Button>
      <Button onClick={onPresent3}>Open modal with background</Button>
    </div>
  );
};

export const DisableOverlayClick: React.FC = () => {
  const [onPresent1] = useModal(<CustomModal title="Modal 1" />, false);

  return (
    <div>
      <Button onClick={onPresent1}>Disabled overlay click</Button>
    </div>
  );
};

const BackButtonModal: React.FC<ModalProps> = ({ title, onDismiss }) => {
  const handleOnBack = () => {
    return 1;
  };

  return (
    <Modal title={title} onDismiss={onDismiss} onBack={handleOnBack} hideCloseButton>
      <Button onClick={onDismiss} variant="text">
        Consumer can still close it.
      </Button>
    </Modal>
  );
};

export const WithBackButton: React.FC = () => {
  const [onPresent1] = useModal(<BackButtonModal title="Modal with no X" />, false);

  return <Button onClick={onPresent1}>Only Back Button</Button>;
};
