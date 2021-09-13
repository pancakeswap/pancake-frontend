import { noop } from "lodash";
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
    onClick: noop,
    type: DropdownMenuItemType.BUTTON,
  },
];

export default ItemsMock;
