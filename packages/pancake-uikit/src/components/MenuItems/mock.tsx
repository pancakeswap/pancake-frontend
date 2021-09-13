import ItemsMock from "../DropdownMenu/mock";

const MenuItemsMock = [
  {
    label: "Home",
    href: "/",
    items: ItemsMock,
  },
  {
    label: "Earn",
    href: "/",
    items: ItemsMock,
  },
  {
    label: "Win",
    href: "/",
    items: ItemsMock,
  },
  {
    label: "NFT",
    href: "/",
    items: [ItemsMock[0]],
  },
  {
    label: "...",
    href: "/",
    items: ItemsMock,
  },
];

export default MenuItemsMock;
