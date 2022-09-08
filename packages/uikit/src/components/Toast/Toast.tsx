import { useCallback, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { Alert, alertVariants } from "../Alert";
import { ToastProps, types } from "./types";

const alertTypeMap = {
  [types.INFO]: alertVariants.INFO,
  [types.SUCCESS]: alertVariants.SUCCESS,
  [types.DANGER]: alertVariants.DANGER,
  [types.WARNING]: alertVariants.WARNING,
};

const StyledToast = styled.div`
  right: 16px;
  position: fixed;
  max-width: calc(100% - 32px);
  transition: all 250ms ease-in;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }
`;

export const Toast: React.FC<React.PropsWithChildren<ToastProps>> = ({ toast, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>();
  const { id, title, description, type } = toast;

  const handleRemove = useCallback(() => onRemove(id), [id, onRemove]);

  const handleMouseEnter = () => {
    clearTimeout(timer.current);
  };

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      handleRemove();
    }, ttl);
  };

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      handleRemove();
    }, ttl);

    return () => {
      clearTimeout(timer.current);
    };
  }, [timer, ttl, handleRemove]);

  return (
    <CSSTransition timeout={250} style={style} {...props}>
      <StyledToast onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
          {description}
        </Alert>
      </StyledToast>
    </CSSTransition>
  );
};
