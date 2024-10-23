import { Children, cloneElement, ReactElement, useEffect } from "react";
import styled from "styled-components";
import { useMatchBreakpoints } from "../../contexts";
import { Box, MotionBox } from "../Box";
import { MotionFlexGap } from "../Layouts";
import { MotionTabMenuProps } from "./types";

const MotionBoxUnderline = styled(MotionBox)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${({ theme }) => theme.colors.primary};
  width: 100%;
  border-radius: 2px 2px 0 0;
`;

const StyledTab = styled(Box)`
  cursor: pointer;
  user-select: none;
`;

export const MotionTabMenu: React.FC<React.PropsWithChildren<MotionTabMenuProps>> = ({
  children,
  onItemClick,
  activeIndex = 0,
  animateOnMobile = true,
  ariaId,
  autoFocus,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints();

  useEffect(() => {
    if (autoFocus) {
      document.getElementById(`${ariaId}_motion-tab-0`)?.focus();
    }
  }, [autoFocus, ariaId]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      onItemClick?.(index);
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`${ariaId}_motion-tab-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < children.length - 1) {
      document.getElementById(`${ariaId}_motion-tab-${index + 1}`)?.focus();
    }
  };

  return (
    <MotionFlexGap role="tablist" gap={isMobile ? "8px" : "12px"} alignItems="baseline" {...props}>
      {Children.map(children, (child: ReactElement, index) => {
        const isActive = activeIndex === index;
        const color = isActive ? "text" : "textSubtle";

        return (
          <StyledTab
            id={`${ariaId}_motion-tab-${index}`}
            position="relative"
            width="fit-content"
            tabIndex={0}
            onKeyDown={(e) => onKeyDown(e, index)}
            onClick={onItemClick ? () => onItemClick(index) : undefined}
            role="tab"
            aria-controls={`${ariaId}_motion-tabpanel-${index}`}
            aria-selected={isActive}
          >
            <Box px={["8px", "12px"]} py="8px">
              {cloneElement(child, {
                color,
                bold: isActive,
                isactive: isActive,
              })}
            </Box>
            {isActive && <MotionBoxUnderline {...(!(isMobile && !animateOnMobile) && { layoutId: "underline" })} />}
          </StyledTab>
        );
      })}
    </MotionFlexGap>
  );
};
