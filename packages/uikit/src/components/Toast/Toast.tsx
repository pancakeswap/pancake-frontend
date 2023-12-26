import { useCallback } from "react";
import { styled } from "styled-components";
import { Alert, alertVariants } from "../Alert";
import { ToastProps, types } from "./types";

const alertTypeMap = {
  [types.INFO]: alertVariants.INFO,
  [types.SUCCESS]: alertVariants.SUCCESS,
  [types.DANGER]: alertVariants.DANGER,
  [types.WARNING]: alertVariants.WARNING,
};

const StyledToast = styled.div`
  max-width: calc(100% - 32px);
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }
`;

export const Toast: React.FC<React.PropsWithChildren<ToastProps>> = ({ toast, onRemove }) => {
  const { id, title, description, type } = toast;

  const handleRemove = useCallback(() => onRemove(id), [id, onRemove]);

  return (
    <StyledToast>
      <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
        {description}
      </Alert>
    </StyledToast>
  );
};
