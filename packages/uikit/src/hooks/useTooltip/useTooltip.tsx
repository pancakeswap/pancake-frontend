import { AnimatePresence, Variants, m, LazyMotion, domAnimation } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { dark, light } from "../../theme";
import getPortalRoot from "../../util/getPortalRoot";
import isTouchDevice from "../../util/isTouchDevice";
import { Arrow, StyledTooltip } from "./StyledTooltip";
import { TooltipOptions, TooltipRefs } from "./types";

const animationVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const animationMap = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

const invertTheme = (currentTheme: DefaultTheme) => {
  if (currentTheme.isDark) {
    return light;
  }
  return dark;
};

const useTooltip = (content: React.ReactNode, options: TooltipOptions): TooltipRefs => {
  const {
    placement = "auto",
    trigger = "hover",
    arrowPadding = 16,
    tooltipPadding = { left: 16, right: 16 },
    tooltipOffset = [0, 10],
  } = options;
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);
  const isHoveringOverTooltip = useRef(false);
  const hideTimeout = useRef<number>();

  const hideTooltip = useCallback(
    (e: Event) => {
      const hide = () => {
        e.stopPropagation();
        e.preventDefault();
        setVisible(false);
      };

      if (trigger === "hover") {
        if (hideTimeout.current) {
          window.clearTimeout(hideTimeout.current);
        }
        if (e.target === tooltipElement) {
          isHoveringOverTooltip.current = false;
        }
        if (!isHoveringOverTooltip.current) {
          hideTimeout.current = window.setTimeout(() => {
            if (!isHoveringOverTooltip.current) {
              hide();
            }
          }, 100);
        }
      } else {
        hide();
      }
    },
    [tooltipElement, trigger]
  );

  const showTooltip = useCallback(
    (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      setVisible(true);
      if (trigger === "hover") {
        if (e.target === targetElement) {
          // If we were about to close the tooltip and got back to it
          // then prevent closing it.
          clearTimeout(hideTimeout.current);
        }
        if (e.target === tooltipElement) {
          isHoveringOverTooltip.current = true;
        }
      }
    },
    [tooltipElement, targetElement, trigger]
  );

  const toggleTooltip = useCallback(
    (e: Event) => {
      e.stopPropagation();
      setVisible(!visible);
    },
    [visible]
  );

  // Trigger = hover
  useEffect(() => {
    if (targetElement === null || trigger !== "hover") return undefined;

    if (isTouchDevice()) {
      targetElement.addEventListener("touchstart", showTooltip);
      targetElement.addEventListener("touchend", hideTooltip);
    } else {
      targetElement.addEventListener("mouseenter", showTooltip);
      targetElement.addEventListener("mouseleave", hideTooltip);
    }
    return () => {
      targetElement.removeEventListener("touchstart", showTooltip);
      targetElement.removeEventListener("touchend", hideTooltip);
      targetElement.removeEventListener("mouseenter", showTooltip);
      targetElement.removeEventListener("mouseleave", showTooltip);
    };
  }, [trigger, targetElement, hideTooltip, showTooltip]);

  // Keep tooltip open when cursor moves from the targetElement to the tooltip
  useEffect(() => {
    if (tooltipElement === null || trigger !== "hover") return undefined;

    tooltipElement.addEventListener("mouseenter", showTooltip);
    tooltipElement.addEventListener("mouseleave", hideTooltip);
    return () => {
      tooltipElement.removeEventListener("mouseenter", showTooltip);
      tooltipElement.removeEventListener("mouseleave", hideTooltip);
    };
  }, [trigger, tooltipElement, hideTooltip, showTooltip]);

  // Trigger = click
  useEffect(() => {
    if (targetElement === null || trigger !== "click") return undefined;

    targetElement.addEventListener("click", toggleTooltip);

    return () => targetElement.removeEventListener("click", toggleTooltip);
  }, [trigger, targetElement, visible, toggleTooltip]);

  // Handle click outside
  useEffect(() => {
    if (trigger !== "click") return undefined;

    const handleClickOutside = ({ target }: Event) => {
      if (target instanceof Node) {
        if (
          tooltipElement != null &&
          targetElement != null &&
          !tooltipElement.contains(target) &&
          !targetElement.contains(target)
        ) {
          setVisible(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [trigger, targetElement, tooltipElement]);

  // Trigger = focus
  useEffect(() => {
    if (targetElement === null || trigger !== "focus") return undefined;

    targetElement.addEventListener("focus", showTooltip);
    targetElement.addEventListener("blur", hideTooltip);
    return () => {
      targetElement.removeEventListener("focus", showTooltip);
      targetElement.removeEventListener("blur", hideTooltip);
    };
  }, [trigger, targetElement, showTooltip, hideTooltip]);

  // On small screens Popper.js tries to squeeze the tooltip to available space without overflowing beyound the edge
  // of the screen. While it works fine when the element is in the middle of the screen it does not handle well the
  // cases when the target element is very close to the edge of the screen - no margin is applied between the tooltip
  // and the screen edge.
  // preventOverflow mitigates this behaviour, default 16px paddings on left and right solve the problem for all screen sizes
  // that we support.
  // Note that in the farm page where there are tooltips very close to the edge of the screen this padding works perfectly
  // even on the iPhone 5 screen (320px wide), BUT in the storybook with the contrived example ScreenEdges example
  // iPhone 5 behaves differently overflowing beyound the edge. All paddings are identical so I have no idea why it is,
  // and fixing that seems like a very bad use of time.
  const { styles, attributes } = usePopper(targetElement, tooltipElement, {
    placement,
    modifiers: [
      {
        name: "arrow",
        options: { element: arrowElement, padding: arrowPadding },
      },
      { name: "offset", options: { offset: tooltipOffset } },
      { name: "preventOverflow", options: { padding: tooltipPadding } },
    ],
  });

  const tooltip = (
    <StyledTooltip
      {...animationMap}
      variants={animationVariants}
      transition={{ duration: 0.3 }}
      ref={setTooltipElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <ThemeProvider theme={invertTheme}>{content}</ThemeProvider>
      <Arrow ref={setArrowElement} style={styles.arrow} />
    </StyledTooltip>
  );

  const AnimatedTooltip = (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>{visible && tooltip}</AnimatePresence>
    </LazyMotion>
  );

  const portal = getPortalRoot();
  const tooltipInPortal = portal ? createPortal(AnimatedTooltip, portal) : null;

  return {
    targetRef: setTargetElement,
    tooltip: tooltipInPortal ?? AnimatedTooltip,
    tooltipVisible: visible,
  };
};

export default useTooltip;
