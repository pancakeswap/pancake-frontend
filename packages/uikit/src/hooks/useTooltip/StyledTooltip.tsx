import styled from "styled-components";
import { m as Motion } from "framer-motion";

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 2px;
    z-index: -1;
  }

  &::before {
    content: "";
    transform: rotate(45deg);
    background: ${({ theme }) => theme.tooltip.background};
  }
`;

export const StyledTooltip = styled(Motion.div)`
  padding: 16px;
  font-size: 16px;
  line-height: 130%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.tooltip.border};
  max-width: 320px;
  z-index: 101;
  background: ${({ theme }) => theme.tooltip.background};
  color: ${({ theme }) => theme.tooltip.text};
  box-shadow: ${({ theme }) => theme.tooltip.boxShadow};

  &[data-popper-placement^="top"] > ${Arrow} {
    bottom: -4px;

    &::before {
      border-bottom: 1px solid ${({ theme }) => theme.tooltip.border};
      border-right: 1px solid ${({ theme }) => theme.tooltip.border};
    }
  }

  &[data-popper-placement^="bottom"] > ${Arrow} {
    top: -4px;

    &::before {
      border-top: 1px solid ${({ theme }) => theme.tooltip.border};
      border-left: 1px solid ${({ theme }) => theme.tooltip.border};
    }
  }

  &[data-popper-placement^="left"] > ${Arrow} {
    right: -4px;

    &::before {
      border-top: 1px solid ${({ theme }) => theme.tooltip.border};
      border-right: 1px solid ${({ theme }) => theme.tooltip.border};
    }
  }

  &[data-popper-placement^="right"] > ${Arrow} {
    left: -4px;

    &::before {
      border-bottom: 1px solid ${({ theme }) => theme.tooltip.border};
      border-left: 1px solid ${({ theme }) => theme.tooltip.border};
    }
  }
`;
