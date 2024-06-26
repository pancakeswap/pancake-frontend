import { LanguageProvider } from "@pancakeswap/localization";
import { Meta, Story } from "@storybook/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { Box } from "../Box";
import { PairDataTimeWindowEnum, PairPriceChart, PairPriceChartNewProps } from "./PairPriceChart";

export default {
  title: "Components/SwapLineChart",
  component: PairPriceChart,
  argTypes: {
    data: { control: "array" },
    isChangePositive: { control: "boolean" },
    isChartExpanded: { control: "boolean" },
    timeWindow: {
      control: {
        type: "select",
        options: [
          PairDataTimeWindowEnum.HOUR,
          PairDataTimeWindowEnum.DAY,
          PairDataTimeWindowEnum.WEEK,
          PairDataTimeWindowEnum.MONTH,
          PairDataTimeWindowEnum.YEAR,
        ],
      },
    },
    priceLineData: {
      control: "array",
      defaultValue: [
        { title: "Price 1", color: "red", price: 100 },
        { title: "Price 2", color: "blue", price: 200 },
      ],
    },
  },
} as Meta;

const Template: Story<PairPriceChartNewProps> = (props) => (
  <LanguageProvider>
    <Box width="500px" height="300px">
      <PairPriceChart {...props} />
    </Box>
  </LanguageProvider>
);

export const Default = Template.bind({});
Default.args = {
  data: [
    { time: new Date("2023-03-20T15:20:00.000Z"), value: 100 },
    { time: new Date("2023-03-21T15:20:00.000Z"), value: 120 },
    { time: new Date("2023-03-22T15:20:00.000Z"), value: 150 },
    { time: new Date("2023-03-23T15:20:00.000Z"), value: 200 },
    { time: new Date("2023-03-24T15:20:00.000Z"), value: 210 },
    { time: new Date("2023-03-25T15:20:00.000Z"), value: 180 },
    { time: new Date("2023-03-26T15:20:00.000Z"), value: 190 },
  ],
  isChangePositive: true,
  isChartExpanded: false,
  timeWindow: PairDataTimeWindowEnum.DAY,
  priceLineData: [
    { title: "max", color: "red", price: 125 },
    { title: "min", color: "blue", price: 175 },
  ],
};
