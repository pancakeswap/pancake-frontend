import React from "react";
import { Select } from "./index";

export default {
  title: "Components/Select",
  component: Select,
};

const countries = [
  { name: "Australia", code: "AU" },
  { name: "Brazil", code: "BR" },
  { name: "China", code: "CN" },
  { name: "Egypt", code: "EG" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "India", code: "IN" },
  { name: "Japan", code: "JP" },
  { name: "Spain", code: "ES" },
  { name: "United States", code: "US" },
];

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <Select
      options={countries.map((i) => ({
        label: i.name,
        value: i.code,
      }))}
    />
  );
};
