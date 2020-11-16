import React from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import useWalletModal from "../WalletModal";

interface Props {
  account?: string;
  closeNav: () => void;
  login: () => void;
  logout: () => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  order: 1;
  margin-bottom: 32px;
  margin-left: 40px;
  ${({ theme }) => theme.mediaQueries.nav} {
    order: 2;
    margin-bottom: 0;
    margin-left: 0;
  }
`;

const UserBlock: React.FC<Props> = ({ account, closeNav, login, logout }) => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account);
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null;
  return (
    <Container>
      {account ? (
        <Button
          size="sm"
          variant="tertiary"
          onClick={() => {
            onPresentAccountModal();
            closeNav();
          }}
        >
          {accountEllipsis}
        </Button>
      ) : (
        <Button
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
