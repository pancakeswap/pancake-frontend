import { DropdownMenuItems, DropdownMenuItemType } from "./types";

const ItemsMock: DropdownMenuItems[] = [
  {
    label: "Exchange",
    href: "/swap",
  },
  {
    label: "Liquidity",
    href: "/pool",
  },
  {
    label: "LP Migration",
    href: "https://v1exchange.pancakeswap.finance/#/migrate",
    type: DropdownMenuItemType.EXTERNAL_LINK,
  },
  {
    type: DropdownMenuItemType.DIVIDER,
  },
  {
    label: "Disconnect",
    onClick: () => {
      // eslint-disable-next-line no-alert
      alert("disconnect");
    },
    type: DropdownMenuItemType.BUTTON,
  },
];

export default ItemsMock;
