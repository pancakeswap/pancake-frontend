import { CopyIcon, IconButton, SvgProps, useTooltip } from "@pancakeswap/uikit";
import { ElementType, useState } from "react";
import { copyText } from "./copyText";

interface CopyButtonProps extends SvgProps {
  text: string;
  tooltipMessage: string;
  buttonColor?: string;
  icon?: ElementType;
}

export const CopyButton: React.FC<React.PropsWithChildren<CopyButtonProps>> = ({
  text,
  tooltipMessage,
  width,
  buttonColor = "primary",
  icon: Icon = CopyIcon,
  ...props
}) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const { targetRef, tooltip } = useTooltip(tooltipMessage, {
    placement: "auto",
    manualVisible: true,
    trigger: "hover",
  });

  const displayTooltip = () => {
    setIsTooltipDisplayed(true);
    setTimeout(() => {
      setIsTooltipDisplayed(false);
    }, 1000);
  };
  return (
    <>
      <div ref={targetRef}>
        <IconButton
          onClick={() => copyText(text, displayTooltip)}
          scale="sm"
          variant="text"
          style={{ width: "auto", position: "relative" }}
        >
          <Icon color={buttonColor} width={width} {...props} />
        </IconButton>
      </div>
      {isTooltipDisplayed && tooltip}
    </>
  );
};
