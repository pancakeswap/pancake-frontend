import { DropdownMenuItems } from "../components";
import { Colors } from "../theme";

export const findMenuItemsStatusColor = (items: DropdownMenuItems[] = []): keyof Colors | undefined => {
  let statusColor: keyof Colors | undefined;

  const traverseItems = (menuItems: DropdownMenuItems[]) => {
    for (const item of menuItems) {
      if (item.status?.color) {
        statusColor = item.status.color;
      }
      if (item.items && item.items.length > 0) {
        traverseItems(item.items);
      }
    }
  };

  traverseItems(items);
  return statusColor;
};
