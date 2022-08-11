import React from "react";
import Text from "./Text";
import TooltipText from "./TooltipText";

export default {
  title: "Components/Text",
  component: Text,
  argTypes: {
    bold: {
      name: "bold",
      table: {
        type: { summary: "bool", detail: "Bold the text" },
        defaultValue: { summary: false },
      },
      control: {
        type: null,
      },
    },
    fontSize: {
      name: "fontSize",
      table: {
        type: { summary: "string", detail: "Fontsize in px or em" },
        defaultValue: { summary: "16px" },
      },
      control: {
        type: null,
      },
    },
    color: {
      name: "color",
      table: {
        type: { summary: "string", detail: "Color from the theme, or CSS color" },
        defaultValue: { summary: "theme.colors.text" },
      },
      control: {
        type: null,
      },
    },
  },
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <Text>Default</Text>
      <Text bold>Bold text</Text>
      <Text small>Small text</Text>
      <Text fontSize="24px">Custom fontsize</Text>
      <Text color="red">Custom color</Text>
      <Text color="primary">Custom color from theme</Text>
      <Text color="secondary" textTransform="uppercase">
        with text transform
      </Text>
      <Text textAlign="center">center</Text>
      <Text display="inline" color="textSubtle" textTransform="uppercase">
        Example of{" "}
      </Text>
      <Text display="inline" bold textTransform="uppercase">
        inline{" "}
      </Text>
      <Text display="inline" color="textSubtle" textTransform="uppercase">
        Text
      </Text>
      <Text ellipsis width="250px">
        Ellipsis: a long text with an ellipsis just for the example
      </Text>
    </div>
  );
};

export const TooltipTextVariant: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <Text>Use TooltipText for text that has tooltip, it accepts the same props as normal Text component</Text>
      <TooltipText>Example</TooltipText>
    </div>
  );
};
