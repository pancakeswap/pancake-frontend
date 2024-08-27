import React from "react";
import { TreeSelect } from "./TreeSelect";
import { Box } from "../Box";

export default {
  title: "Components/TreeSelect",
  component: TreeSelect,
};

const mockData = [
  {
    key: "0",
    label: "All Pools",
    data: "All Pools",
    children: [
      {
        key: "0-0",
        label: "Pool Type",
        data: "Pool Type",
        children: [
          {
            key: "0-0-0",
            label: "CLAMM",
            data: "CLAMM",
          },
          {
            key: "0-0-1",
            label: "Bin",
            data: "",
          },
        ],
      },
      {
        key: "0-1",
        label: "Pool Feature",
        data: "Pool Feature",
        children: [
          {
            key: "0-1-0",
            label: "Farming",
            data: "Farming",
          },
          {
            key: "0-1-1",
            label: "Misc",
            data: "Misc",
          },
          {
            key: "0-1-2",
            label: "Oracle",
            data: "Oracle",
          },
          {
            key: "0-1-3",
            label: "Order Types",
            data: "Order Types",
          },
        ],
      },
    ],
  },
];

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <Box margin="30px" width="272px">
      <TreeSelect data={mockData} />
    </Box>
  );
};
