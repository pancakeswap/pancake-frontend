import ItemsMock from "../DropdownMenu/mock";
import { MenuItemsType } from "../MenuItems/types";

const MenuItemsMock: MenuItemsType[] = [
  {
    label: "Swap",
    href: "/swap",
    icon: "Swap",
    items: ItemsMock,
  },
  {
    label: "Earn",
    href: "/earn",
    icon: "Earn",
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: "Gagnez des jetons",
    href: "/win",
    icon: "Trophy",
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: "NFT",
    href: "/nft",
    icon: "Nft",
    items: ItemsMock,
  },
  {
    label: "More",
    href: "/more",
    icon: "More",
    items: ItemsMock,
    showItemsOnMobile: true,
  },
];

export default MenuItemsMock;
