import React from "react";
import { Modal, useModal } from ".";
import { InjectedProps } from "./types";
import Button from "../../components/Button/Button";
import Heading from "../../components/Heading/Heading";

export default {
  title: "Widgets/Modal",
  component: Modal,
  argTypes: {},
};

interface CustomModalProps extends InjectedProps {
  title: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ title, onDismiss }) => (
  <Modal title={title} onDismiss={onDismiss}>
    <Heading>{title}</Heading>
    <Button>This button Does nothing</Button>
  </Modal>
);

export const Default: React.FC = () => {
  const [onPresent1] = useModal(<CustomModal title="Modal 1" />);
  const [onPresent2] = useModal(<CustomModal title="Modal 2" />);
  return (
    <div>
      <Button onClick={onPresent1}>Open modal 1</Button>
      <Button onClick={onPresent2}>Open modal 2</Button>
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
