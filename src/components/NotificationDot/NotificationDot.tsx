import React, { cloneElement, Children, ReactElement } from "react";
import styled from "styled-components";
import { NotificationDotProps, DotProps } from "./types";

const NotificationDotRoot = styled.span`
  display: inline-flex;
  position: relative;
`;

const Dot = styled.span<DotProps>`
  display: ${({ show }) => (show ? "inline-flex" : "none")};
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  pointer-events: none;
  border: 2px solid ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.failure};
`;

const NotificationDot: React.FC<NotificationDotProps> = ({ show = false, children, ...props }) => (
  <NotificationDotRoot>
    {Children.map(children, (child: ReactElement) => cloneElement(child, props))}
    <Dot show={show} />
  </NotificationDotRoot>
);

export default NotificationDot;
