export const columns = [
  {
    id: 1,
    name: "id",
    hidden: true,
  },
  {
    id: 2,
    name: "pool",
    label: "POOL",
    render: ({ value }: { value: React.ReactNode }): React.ReactNode => value,
  },
  {
    id: 3,
    name: "apy",
    label: "APY",
  },
  {
    id: 4,
    name: "EARNED",
  },
  {
    id: 5,
    name: "STAKED",
  },
  {
    id: 6,
    name: "DETAILS",
  },
  {
    id: 7,
    name: "LINKS",
  },
  {
    id: 8,
    name: "TAGS",
  },
];

export const data = [];
