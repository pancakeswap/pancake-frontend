import { AnimatePresence, Variants, LazyMotion, domAnimation } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { isMobile } from "react-device-detect";
import { DefaultTheme, ThemeProvider, useTheme } from "styled-components";
import debounce from "lodash/debounce";
import { dark, light } from "../../theme";
import getPortalRoot from "../../util/getPortalRoot";
import isTouchDevice from "../../util/isTouchDevice";
import { Arrow, StyledTooltip } from "./StyledTooltip";
import { DeviceAction, Devices, TooltipOptions, TooltipRefs } from "./types";

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

const deviceActions: { [device in Devices]: DeviceAction } = {
  [Devices.touchDevice]: {
    start: "touchstart",
    end: "touchend",
  },
  [Devices.nonTouchDevice]: {
    start: "mouseenter",
    end: "mouseleave",
  },
};

const invertTheme = (currentTheme: DefaultTheme) => {
  if (currentTheme.isDark) {
    return light;
  }
  return dark;
};

const useTooltip = (content: React.ReactNode, options?: TooltipOptions): TooltipRefs => {
  const { isDark } = useTheme();
  const {
    placement = "auto",
    trigger = isMobile ? "click" : "hover",
    arrowPadding = 16,
    tooltipPadding = { left: 16, right: 16 },
    tooltipOffset = [0, 10],
    hideTimeout = 100,
    manualVisible = false,
    avoidToStopPropagation = false,
    strategy,
    isInPortal = true,
  } = options || {};

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const [visible, setVisible] = useState(manualVisible);

  useEffect(() => {
    setVisible(manualVisible);
  }, [manualVisible]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHide = useCallback(
    debounce(() => {
      setVisible(false);
    }, hideTimeout),
    [hideTimeout]
  );
  // using lodash debounce we can get rid of hideTimeout cleanups
  // loadash's debounce handles cleanup it its implementation
  const hideTooltip = useCallback(
    (e: Event) => {
      if (manualVisible) return;
      if (!avoidToStopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (trigger === "hover") {
        debouncedHide();
      } else {
        setVisible(false);
      }
    },
    [manualVisible, trigger, debouncedHide, avoidToStopPropagation]
  );

  const showTooltip = useCallback(
    (e: Event) => {
      setVisible(true);
      if (trigger === "hover") {
        // we dont need to make a inTooltipRef anymore, when we leave
        // the target, hide tooltip is called for leaving the target, but show tooltip
        // is called for entering the tooltip. since we enact a delay in hidetooltip,
        // by the time the dylay is over lodash debounce will be cancelled until we leave the
        // tooltip calling hidetooltip onece again to close. clever method jackson pointed me
        // onto. saves a lot of nedless states and refs and listeners
        debouncedHide.cancel();
      }
      if (!avoidToStopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [trigger, avoidToStopPropagation, debouncedHide]
  );

  const toggleTooltip = useCallback(
    (e: Event) => {
      if (!avoidToStopPropagation) e.stopPropagation();
      setVisible(!visible);
    },
    [visible, avoidToStopPropagation]
  );

  // Trigger = hover
  useEffect(() => {
    if (targetElement === null || trigger !== "hover" || manualVisible) return undefined;

    const eventHandlers = isTouchDevice() ? deviceActions.touchDevice : deviceActions.nonTouchDevice;

    [targetElement, tooltipElement].forEach((element) => {
      element?.addEventListener(eventHandlers.start, showTooltip);
      element?.addEventListener(eventHandlers.end, hideTooltip);
    });

    return () => {
      [targetElement, tooltipElement].forEach((element) => {
        element?.removeEventListener(eventHandlers.start, showTooltip);
        element?.removeEventListener(eventHandlers.end, hideTooltip);
        debouncedHide.cancel();
      });
    };
  }, [trigger, targetElement, hideTooltip, showTooltip, manualVisible, tooltipElement, debouncedHide]);

  // no longer need the extra useeffect

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

  // On small screens Popper.js tries to squeeze the tooltip to available space without overflowing beyond the edge
  // of the screen. While it works fine when the element is in the middle of the screen it does not handle well the
  // cases when the target element is very close to the edge of the screen - no margin is applied between the tooltip
  // and the screen edge.
  // preventOverflow mitigates this behaviour, default 16px paddings on left and right solve the problem for all screen sizes
  // that we support.
  // Note that in the farm page where there are tooltips very close to the edge of the screen this padding works perfectly
  // even on the iPhone 5 screen (320px wide), BUT in the storybook with the contrived example ScreenEdges example
  // iPhone 5 behaves differently overflowing beyond the edge. All paddings are identical so I have no idea why it is,
  // and fixing that seems like a very bad use of time.
  const { styles, attributes, forceUpdate } = usePopper(targetElement, tooltipElement, {
    strategy,
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
      data-theme={isDark ? "light" : "dark"}
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
  const tooltipInPortal = portal && isInPortal ? createPortal(AnimatedTooltip, portal) : null;

  return {
    targetRef: setTargetElement,
    tooltip: tooltipInPortal ?? AnimatedTooltip,
    tooltipVisible: visible,
    forceUpdate,
  };
};

export default useTooltip;
