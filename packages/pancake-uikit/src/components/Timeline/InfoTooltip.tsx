import React from "react";
import useTooltip from "../../hooks/useTooltip/useTooltip";
import { BoxProps, Flex } from "../Box";
import IconComponent from "../Svg/IconComponent";

type InfoTooltip = {
  text: string;
} & BoxProps;

const InfoTooltip: React.FC<InfoTooltip> = ({ text, ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, {});
  return (
    <Flex {...props} alignItems="center">
      {tooltipVisible && tooltip}
      <Flex ref={targetRef} alignItems="center">
        <IconComponent iconName="Info" color="textSubtle" />
      </Flex>
    </Flex>
  );
};

export default InfoTooltip;
