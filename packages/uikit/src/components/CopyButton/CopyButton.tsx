import { useTranslation } from "@pancakeswap/localization";
import { ElementType, useCallback, useEffect, useState } from "react";
import { TooltipOptions, useTooltip } from "../../hooks";
import { IconButton } from "../Button";
import { CopyIcon, SvgProps } from "../Svg";
import { copyText } from "./copyText";

interface CopyButtonProps extends SvgProps {
  text: string;
  tooltipMessage: string;
  defaultTooltipMessage?: string;
  tooltipPlacement?: TooltipOptions["placement"];
  buttonColor?: string;
  icon?: ElementType;
}

export const CopyButton: React.FC<React.PropsWithChildren<CopyButtonProps>> = ({
  text,
  tooltipMessage,
  defaultTooltipMessage,
  width,
  buttonColor = "primary",
  tooltipPlacement = "auto",
  icon: Icon = CopyIcon,
  ...props
}) => {
  const { t } = useTranslation();
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    isTooltipDisplayed ? tooltipMessage : defaultTooltipMessage,
    {
      placement: tooltipPlacement,
      manualVisible: !defaultTooltipMessage,
      trigger: "hover",
    }
  );

  const showToolTip = defaultTooltipMessage ? tooltipVisible : isTooltipDisplayed;

  const displayTooltip = useCallback(() => {
    setIsTooltipDisplayed(true);
  }, []);

  const handleOnClick = useCallback(() => {
    copyText(text, displayTooltip);
  }, [text, displayTooltip]);

  useEffect(() => {
    if (isTooltipDisplayed) {
      const tooltipTimeout = setTimeout(() => {
        setIsTooltipDisplayed(false);
      }, 1000);
      return () => clearTimeout(tooltipTimeout);
    }

    return undefined;
  }, [isTooltipDisplayed]);

  return (
    <>
      <div ref={targetRef}>
        <IconButton
          title={t("Copy")}
          onClick={handleOnClick}
          scale="sm"
          variant="text"
          style={{ width: "auto", position: "relative" }}
        >
          <Icon color={buttonColor} width={width} {...props} />
        </IconButton>
      </div>
      {showToolTip && tooltip}
    </>
  );
};
