import React from "react";
import { Colors } from "../../theme";
import { Flex } from "../Box";
import IconComponent from "../Svg/IconComponent";
import { Text } from "../Text";
import InfoTooltip from "./InfoTooltip";
import { TimelineContainer, TimelineEvent } from "./styles";
import { TimelineProps, EventStatus } from "./types";

const getTextColor = (eventStatus: EventStatus): keyof Colors => {
  if (eventStatus === "upcoming") return "textDisabled";
  if (eventStatus === "live") return "success";
  return "textSubtle";
};

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <TimelineContainer>
      {events.map(({ text, status, altText, infoText }) => {
        const isUpcoming = status === "upcoming";
        const isLive = status === "live";
        const isPast = status === "past";
        return (
          <TimelineEvent key={text}>
            <Flex mr="10px" alignItems="center">
              {isUpcoming && <IconComponent iconName="CircleOutline" color="textDisabled" />}
              {isLive && <IconComponent iconName="Logo" />}
              {isPast && <IconComponent iconName="CheckmarkCircleFill" color="textSubtle" />}
            </Flex>
            <Text color={getTextColor(status)} bold>
              {text}
            </Text>
            {altText && (
              <Text color="warning" ml="2px" bold>
                {altText}
              </Text>
            )}
            {infoText && <InfoTooltip text={infoText} ml="10px" />}
          </TimelineEvent>
        );
      })}
    </TimelineContainer>
  );
};

export default Timeline;
