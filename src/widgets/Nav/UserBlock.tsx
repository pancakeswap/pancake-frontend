import React from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import { useModal } from "../Modal";
import ConnectModal from "./ConnectModal";
import AccountModal from "./AccountModal";
import { ConnectCallbackType } from "./types";

interface Props {
  account?: string;
  closeNav: () => void;
  connectCallbacks: ConnectCallbackType[];
  logout: () => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  order: 1;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    margin-bottom: 0;
  }
`;

const AccountButton = styled(Button).attrs({ size: "sm", variant: "secondary" })`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.nav.background};
  border-color: ${({ theme }) => theme.colors.tertiary};
  &:hover:not(:disabled):not(:active) {
    background-color: ${({ theme }) => theme.colors.tertiary};
    border-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const UserBlock: React.FC<Props> = ({ account, closeNav, connectCallbacks, logout }) => {
  const [onPresentConnectModal] = useModal(<ConnectModal connectCallbacks={connectCallbacks} />);
  const [onPresentAccountModal] = useModal(<AccountModal account={account} logout={logout} />);
  const accountEllipsis = account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : null;
  return (
    <Container>
      {account ? (
        <AccountButton
          ml="40px"
          onClick={() => {
            onPresentAccountModal();
            closeNav();
          }}
        >
          {accountEllipsis}
        </AccountButton>
      ) : (
        <Button
          ml="40px"
          size="sm"
          onClick={() => {
            onPresentConnectModal();
            closeNav();
          }}
        >
          Connect
        </Button>
      )}
    </Container>
  );
};

export default UserBlock;
