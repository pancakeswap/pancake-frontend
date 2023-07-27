import { useCallback, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled, { css } from "styled-components";
import { Alert, alertVariants } from "../Alert";
import { ToastProps, types, StyledToastProps } from "./types";

const alertTypeMap = {
  [types.INFO]: alertVariants.INFO,
  [types.SUCCESS]: alertVariants.SUCCESS,
  [types.DANGER]: alertVariants.DANGER,
  [types.WARNING]: alertVariants.WARNING,
};

const StyledToast = styled.div<StyledToastProps>`
  position: fixed;
  max-width: calc(100% - 32px);
  transition: all 250ms ease-in;
  width: 100%;

  ${({ position = "right" }) => {
    switch (position) {
      case "left":
        return css`
          left: 16px;
        `;
      case "right":
        return css`
          right: 16px;
        `;
      case "top":
        return css`
          top: 16px;
          // left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom":
        return css`
          bottom: 10%;
          left: 16px;
        `;
      default:
        return null;
    }
  }};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }
`;

export const Toast: React.FC<React.PropsWithChildren<ToastProps>> = ({ toast, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>();
  const ref = useRef(null);
  const { id, title, description, type, position } = toast;

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
    <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
      <StyledToast ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} position={position}>
        <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
          {description}
        </Alert>
      </StyledToast>
    </CSSTransition>
  );
};
