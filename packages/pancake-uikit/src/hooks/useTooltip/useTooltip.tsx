import React, { useState, useEffect, useCallback } from "react";
import { Placement, Padding } from "@popperjs/core";
import { usePopper } from "react-popper";
import { StyledTooltip, Arrow } from "./StyledTooltip";
import { TooltipRefs, TriggerType } from "./types";

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

const useTooltip = (
  content: React.ReactNode,
  placement: Placement = "auto",
  trigger: TriggerType = "hover",
  arrowPadding?: Padding,
  tooltipPadding?: Padding,
  tooltipOffset?: [number, number]
): TooltipRefs => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);

  const hideTooltip = useCallback((e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(false);
  }, []);

  const showTooltip = useCallback((e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(true);
  }, []);

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
        options: { element: arrowElement, padding: arrowPadding || 16 },
      },
      { name: "offset", options: { offset: tooltipOffset || [0, 10] } },
      { name: "preventOverflow", options: { padding: tooltipPadding || { left: 16, right: 16 } } },
    ],
  });

  const tooltip = (
    <StyledTooltip ref={setTooltipElement} style={styles.popper} {...attributes.popper}>
      {content}
      <Arrow ref={setArrowElement} style={styles.arrow} />
    </StyledTooltip>
  );
  return {
    targetRef: setTargetElement,
    tooltip,
    tooltipVisible: visible,
  };
};

export default useTooltip;
