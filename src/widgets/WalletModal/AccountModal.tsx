import React from "react";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Link from "../../components/Link";
import Flex from "../../components/Flex";
import { OpenNewIcon } from "../../components/Svg";
import { Modal } from "../Modal";
import { localStorageKey } from "./config";

interface Props {
  account?: string;
  logout: () => void;
  onDismiss?: () => void;
}

const AccountModal: React.FC<Props> = ({ account, logout, onDismiss = () => null }) => (
  <Modal title="Your wallet" onDismiss={onDismiss}>
    <Text
      fontSize="20px"
      bold
      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "8px" }}
    >
      {account}
    </Text>
    <Link
      fontSize="14px"
      href={`https://bscscan.com/address/${account}`}
      target="blank"
      rel="noopener noreferrer"
      mb="32px"
    >
      <OpenNewIcon width="20px" color="primary" mr="4px" />
      {`View on bsscan `}
    </Link>
    <Flex justifyContent="center">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          logout();
          window.localStorage.removeItem(localStorageKey);
          onDismiss();
          window.location.reload();
        }}
      >
        Logout
      </Button>
    </Flex>
  </Modal>
);

export default AccountModal;
