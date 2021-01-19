import React, { useCallback, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { Alert } from "../../components/Alert";
import { ToastProps } from "./types";

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

const Toast: React.FC<ToastProps> = ({ alert, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>();
  const ref = useRef(null);
  const removeHandler = useRef(onRemove);
  const { id, title, description, type } = alert;

  const handleRemove = useCallback(() => removeHandler.current(id), [id, removeHandler]);

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
      <StyledToast ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Alert title={title} description={description} variant={type} onClick={handleRemove} />
      </StyledToast>
    </CSSTransition>
  );
};

export default Toast;
